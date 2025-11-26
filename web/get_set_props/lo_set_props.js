import {app} from "../../../scripts/app.js"
import Logger from "../.core/utils/Logger.js"
import {setObjectParams} from "../.core/utils/base_utils.js"
import GetSetPropsVM, { _CFG } from "./get_set_props_vm.js"


/**---
 * 
 *  Расширение прототипа
 */
export function LoSetPropsExtends(proto){
    const {setNode: NODE_CFG} = _CFG
	const vm = GetSetPropsVM


    /**
     * Создание узла и инициализация виджета
     */
    const _onNodeCreated = proto.onNodeCreated
    proto.onNodeCreated = function(){
        const ret = _onNodeCreated?.apply(this, arguments)

        this.title = NODE_CFG.title     // Начальные значения
        this._addEmptyInput()           // Узел
        setObjectParams(this.outputs[0], NODE_CFG.outputProps)  // Параметры выхода

        return ret
    }


    /**
     *  Конфигурация узла
     */
    const _onConfigure = proto.onConfigure
    proto.onConfigure = function(){
        const ret = _onConfigure?.apply(this, arguments)
        // Нормализация инпутов
        this.normalizeInputs()
        return ret
    }


    /**
     *  При изменении соединений	// side: 1 = input, 2 = output
     */
    const _onConnectionsChange = proto.onConnectionsChange
    proto.onConnectionsChange = function (side, index, connected, link, slot){
        const ret = _onConnectionsChange?.apply(this, arguments)
        // input
        if(side==1){
            this._onInputConnecionChange(index, connected, link, slot)
        } else {
        // output
            vm.onSetOutputChanged(this, index, slot)
        }
        return ret
    }


    /**
     *  Обработка изменения соединения инпута
     *  @param {number} index - индекс инпута
     *  @param {boolean} connected - соединен ли инпут
     *  @param {object} link - ссылка на соединение
     *  @param {object} input - инпут
     */
    proto._onInputConnecionChange = function(index, connected, link, input){
        setTimeout(()=>{ // задержка, чтобы успели обновиться слоты

            // входы
            if(connected && link){
                const originNode = app.graph.getNodeById(link.origin_id)
                this.inputs[index].name = originNode.outputs[link.origin_slot].type
            }
            this.normalizeInputs()

            // оповещение об изменении
            vm.onSetInputChanged(this, index, input)

        }, 10)
    }


    /**
     *  Нормализация Инпутов
     */
    proto.normalizeInputs = function(){
        const that = this

        // Нормализация инпутов - удаление пустых, добавление свободного
        this.inputs = this.inputs.filter( input => input.isConnected )

        // Обновление типов
        let index=0
        for (const input of this.inputs){
            const link = app.graph.getLink(input.link)
            const originNode = app.graph.getNodeById(link.origin_id)
            input.type = originNode.outputs[link.origin_slot].type

            // создаем get/set для label
            if(!input._label){
                input._label = input.label
                Object.defineProperty( input, "label", {
                    set(value) {
                        this._label = value
                        // оповещение об изменении
                        vm.onSetInputChanged(that, index, input)
                    },
                    get(){ return this._label }
                })
            }
            index++
        }
        // Добавление свободного
        this._addEmptyInput()
    }


    /**
     *  Типовой пустой инпут
     */
    proto._addEmptyInput = function(){
        this.addInput(`${NODE_CFG.inputPrefix}${this.inputs.length}`, "*",)
    }

}

