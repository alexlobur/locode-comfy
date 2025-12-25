import {makeUniqueName, watchProperty} from "./base_utils.js"
import { LoGraphUtils } from "./lo_graph_utils.js"

/**
 *  Утилиты для работы с узлами
 */
export const LoNodesUtils = {

    /* INPUTS & OUTPUTS */

    /**
     *  Добавление типового пустого инпута
     * 
     *  @param {LGraphNode} node
     *  @param {string} prefix Префикс для имени инпута. Если не указан, то будет использоваться "any".
     *  @param {string} type Тип инпута. Если не указан, то будет использоваться "*".
     *  @param {string} label Лейбл инпута. Если не указан, то будет использоваться "*".
     *  @param {object} options  Опции инпута.
     *  @returns {INodeInputSlot}
     */
    addEmptyInput: (node, {
        startName="any", startIndex=1, pattern="{name}_{index}",
        type="*", label="*", options={}
    }={}) => {
        const name = makeUniqueName( startName, node.inputs.map( input => input.name ), {
            pattern: pattern,
            startIndex: startIndex
        })
        return node.addInput(name, type, { label: label, ...options })
    },


    /**
     *  Нормализация динамических инпутов.
     * 
     *  - Удаление пустых инпутов.
     *  - Обновление типов из выходов.
     *  - Вешаем слушатель на изменения label.
     * 
     *  @param {LGraphNode} node
     *  @param {bool} removeEmptyInputs — удалять пустые инпуты
     *  @param {bool} skipWidgetInputs — пропускать инпуты виджетов
     *  @param {(node, input, value)=>void} onLabelChanged - функция для обработки изменений Label
     *  @returns {void}
     */
    normalizeDynamicInputs: (node, { removeEmptyInputs=true, skipWidgetInputs=true, onLabelChanged=null }={}) => {

        // удаление инпутов без соединения
        if(removeEmptyInputs) LoNodesUtils.removeEmptyInputs(node, { skipWidgetInputs })

        // нормализация инпутов
        for(const input of node.inputs){
            // пропускаем инпуты виджетов
            if(skipWidgetInputs && input.isWidgetInputSlot) continue

            // обновление типа из выхода узла по ссылке
            const link = LoGraphUtils.findLinkById(input.link)
            if(link) input.type = link.type

            // вешаем слушатель на label
            if(onLabelChanged){
                watchProperty( input, "label", {
                    onChanged: (value) => onLabelChanged?.(node, input, value)
                })
            }
        }
    },


    /**
     *  Удаление пустых инпутов
     * 
     *  @param {LGraphNode} node
     *  @param {bool} skipWidgetInputs — пропускать инпуты виджетов
     *  @returns {void}
     */
    removeEmptyInputs: (node, { skipWidgetInputs=true }={}) => {
        // удаление пустых инпутов
        node.inputs = node.inputs.filter( input => {
            // пропускаем инпуты виджетов
            if(skipWidgetInputs && input.isWidgetInputSlot) return true

            if(!input.isConnected) return false                     // проверка наличия соединения
            return (LoGraphUtils.findLinkById(input.link)!=null)    // проверка существования ссылки
        })
        // нормализация ссылок инпутов
        node.inputs.forEach( (input, index) => {
            const link = LoGraphUtils.findLinkById(input.link)
            if(link) link.target_slot = index
        })
    },


    /**
     *  Переопределение присоединения к динамическому инпуту.
     * 
     *  @param {LGraphNode} proto Узел или Прототип
     *  @param {bool} setTypeFromOutput — заменить тип из выхода
     *  @param {bool} setLabelFromOutput — заменить label из выхода
     *  @param {(index, type, outputSlot, outputNode, outputIndex)=>boolean} callbackBefore — функция для обработки перед изменениями
     *  @param {(index, type, outputSlot, outputNode, outputIndex)=>boolean} callbackAfter — функция для обработки после изменений
     */
    overrideOnConnectInputDynamic: ( proto, {
        callbackBefore = ()=>true,
        callbackAfter = ()=>true,
        setTypeFromOutput = true,
        setLabelFromOutput = true,
    } = {}) => {
        proto.onConnectInput = function (index, type, outputSlot, outputNode, outputIndex){
            // Вызов callbackBefore
            if(!callbackBefore.call(this, index, type, outputSlot, outputNode, outputIndex)) return false

            // Получаем инпут слота
            const input = this.inputs[index]

            // Берем тип из output
            if(setTypeFromOutput) input.type = type

            // Замена Label
            if(setLabelFromOutput){
                input.label = makeUniqueName(
                    outputSlot.label || outputSlot.localization_name || outputSlot.name,
                    this.inputs.map( item => item.label ),
                    {
                        excludeIndex: index
                    }
                )
            }

            // Вызов callbackAfter
            return callbackAfter.call(this, index, type, outputSlot, outputNode, outputIndex)
        }
    },


    /* MISCELLANEOUS */

    /**
     *  Переопределение границы минимальной ширины узла (computeSize).
     * 
     *  @param {LGraphNode} proto
     *  @param {number|undefined} minWidth
     *  @returns {void}
     */
    overrideComputeSize: ( proto, minWidth=undefined ) => {
        if(!minWidth) return
        const _computeSize = proto.computeSize
        proto.computeSize = function(){
            const ret = _computeSize?.apply(this, arguments)
            ret[0] = Math.min(minWidth, ret[0])
            return ret
        }
    },


    /**
     *  Нормализация меню
     *  - удаляет повторяющиеся null
     */
    normalizeMenu: (menu) => {
        // обратный проход по меню и удаление повторяющихся null
        let nullsCount = 0
        for(let i=menu.length-1; i>=0; i--){
            if(menu[i]==null){
                nullsCount++
                if(nullsCount>2){
                    menu.splice(i, 1)
                    nullsCount=0
                }
            }
        }
    }

}
