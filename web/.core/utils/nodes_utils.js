import {app} from "../../../../scripts/app.js"
import {makeUniqueName} from "./base_utils.js"


/**
 *  Проход по списку всех узлов графа (по дереву)
 * 
 * @param {{}[]} nodes
 * @param {?function(node, parentNodeIds)} callBack Колбэк функция при проходе каждого нода. Вернет нод и список id родителей
 * @param {Number[]} parentNodeIds
 * @returns 
 */
export function foreachNodes(nodes, callBack=null, parentNodeIds=[]){
    const result = []
    for (const node of nodes){
        // сабграф
        if(node.subgraph!=null){
            result.push(
                ...foreachNodes( node.subgraph._nodes, callBack, [...parentNodeIds, node.id] )
            )
            continue
        }
        // нод
        callBack?.(node, parentNodeIds)
        result.push(node)
    }
    return result

}


/**
 *  Пытается перейти к узлу
 */
export function gotoNode(node, select = true){
    if(!node) return
    app.canvas.centerOnNode(node)
    if(select) app.canvas.selectNode(node, false)
}


/**
 *  Принимает список объектов, у который есть параметр `name`,
 *  Возвращает именованный объект.
 *  
 *  @param {*[]} namedList
 */
export function listToNamedObject( namedList ){
    const resut = {}
    for (const item of namedList){
        resut[item.name] = item
    }
    return resut
}


/**
 *  Пишет многострочный текст на канве, учитывая ручные переносы строк.
 *
 *  @param {CanvasRenderingContext2D} ctx   Контекст канвы, в котором будет рисоваться текст.
 *  @param {string} text                    Исходный текст, допускающий переносы `\n`.
 *  @param {number} marginLeft              Координата X первой строки.
 *  @param {number} marginTop               Координата Y первой строки.
 *  @param {number} maxWidth                Максимальная ширина строки.
 *  @param {number|null} lineSpacing        Межстрочный интервал.
 *  @param {boolean} calcOnly               Только посчет без вывода
 *  @returns {{width: number, height: number}}  Итоговая высота и ширина блока текста.
 */
export function wrapCanvasText( ctx, text, maxWidth, { marginLeft=0, marginTop=0, lineSpacing=1.25, calcOnly=false }){

    // Вычисляем высоту строки
    const metrics = ctx.measureText("M")
    //const effectiveLineHeight = ((metrics.fontBoundingBoxAscent ?? 0) + (metrics.fontBoundingBoxDescent ?? 0))*1.25
    // const effectiveLineHeight = metrics.fontBoundingBoxDescent*lineSpacing
    const lineHeight = metrics.actualBoundingBoxDescent * lineSpacing

    let cursorY = marginTop
    const result = { width: 0, height: 0 }

    /**
     * Фиксирует текущую строку на канве и смещает курсор на следующую.
     * @param {string} line Строка, которую нужно нарисовать.
     */
    const commitLine = (line) => {
        const m = ctx.measureText(line)
        // обновление результирущих данных
        result.width = Math.max(result.width, m.width)
        result.height = m.actualBoundingBoxDescent + cursorY - marginTop
        if(!calcOnly) ctx.fillText(line, marginLeft, cursorY)
        cursorY += lineHeight
    }

    const paragraphs = String(text ?? "").split(/\r?\n/)
    for (const paragraph of paragraphs){
        let line = ""
        const words = paragraph.trim().split(" ")

        for (const word of words){
            const testLine = line + word
            const testWidth = ctx.measureText(testLine).width

            // Переносим строку на новую линию, если достигли ограничения по ширине.
            if (testWidth > maxWidth && line !== ""){
                commitLine(line)
                line = word + " "
            } else {
                line = testLine + " "
            }
        }
        // Добавляем завершающую строку параграфа (возможно пустую).
        commitLine(line.trimEnd())
    }

    return result
}



/**
 *  Обновление динамических инпутов в таких нодах как Switcher, Eval, ReplaceVars
 *  @param {*} node 
 *  @param {*} prefix 
 *  @deprecated Use normalizeNodeInputs instead
 *  @returns {void}
 */
export function updateDynamicInputs(node, prefix="any"){
    // список активных инпутов начинающихся с префикса
    const linkedInputs = Array.from(node.inputs)
        .filter( input => input.name.startsWith(prefix) && input.isConnected )

    // список прочих инпутов
    const otherInputs = Array.from(node.inputs)
        .filter( input => !input.name.startsWith(prefix) )

    // переименование инпутов
    linkedInputs.forEach( (item, index) => item.name = `${prefix}${index}` )

    // замена инпутов узла с сохранением прочих, и добавление пустого
    node.inputs = [...otherInputs, ...linkedInputs]
    node.addInput(`${prefix}${linkedInputs.length}`, "*",)

}


/**
 *  Нормализация Инпутов
 *  Удаление пустых, добавление свободного
 * 
 *  @param {LGraphNode} node 
 *  @param {(node, index, input)=>void} onLabelChanged - функция для обработки изменений Label
 *  @param {boolean} addDefaultEmptyInput - добавлять пустой инпут в конец
 *  @returns {void}
 */
export function normalizeNodeInputs(node, { onLabelChanged=null, addDefaultEmptyInput=true }={}){

    // удаление инпутов без соединения
    node.inputs = node.inputs.filter( input => input.isConnected )

    // Обновление типов
    let index=0
    for (const input of node.inputs){
        // обновление типа из выхода узла по ссылке
        const link = app.graph.getLink(input.link)
        if(link){
            const originNode = app.graph.getNodeById(link.origin_id)
            input.type = originNode?.outputs[link.origin_slot].type??"*"
        }
        // вешаем слушатель на label
        if(onLabelChanged){
            watchSlotLabel( input, {
                onChanged: (input) => onLabelChanged?.(node, index, input)
            })
        }
        index++
    }

    // Добавление пустого инпута в конец
    if(addDefaultEmptyInput) addEmptyNodeInput(node)

}


/**
 *  Типовой пустой инпут
 *  @param {LGraphNode} node
 *  @param {string} prefix Префикс для имени инпута. Если не указан, то будет использоваться "any".
 *  @param {string} type Тип инпута. Если не указан, то будет использоваться "*".
 *  @param {string} label Лейбл инпута. Если не указан, то будет использоваться "*".
 *  @param {object} options  Опции инпута.
 *  @returns {INodeInputSlot}
 */
export function addEmptyNodeInput(node, { prefix="any", type="*", label="*", options={} }={}){
    const name = makeUniqueName( prefix, node.inputs.map( input => input.name ))
    return node.addInput(name, type, { label: label, ...options })
}


/**
 *  Отслеживание изменений label слота
 *  @param {INodeInputSlot} slot 
 *  @param {function(slot: INodeInputSlot)=>void} onChanged - функция для обработки изменений
 *  @param {function(value: string)=>string} onSet - функция для установки значения
 *  @returns {INodeInputSlot}
 */
export function watchSlotLabel(slot, { onSet, onChanged }={}){
    if(slot._label) return

    slot._label = slot.label
    Object.defineProperty( slot, "label", {
        set(value){
            slot._label = onSet?.(value)??value
            onChanged?.(slot)
        },
        get(){ return slot._label }
    })
    return slot
}


/**
 *  Переопределение присоединения к слоту.
 * 
 *  @param {LGraphNode} proto Узел или Прототип
 *  @param {bool} setTypeFromOutput — заменить тип из выхода
 *  @param {bool} setLabelFromOutput — заменить label из выхода
 *  @param {(index, type, outputSlot, outputNode, outputIndex)=>boolean} callbackBefore — функция для обработки перед изменениями
 *  @param {(index, type, outputSlot, outputNode, outputIndex)=>boolean} callbackAfter — функция для обработки после изменений
 */
export function overrideOnConnectInput( proto, {
    callbackBefore = ()=>true,
    callbackAfter = ()=>true,
    setTypeFromOutput = true,
    setLabelFromOutput = true,
}){
    proto.onConnectInput = function (index, type, outputSlot, outputNode, outputIndex){

        // Вызов callbackBefore
        if(!callbackBefore.call(this, index, type, outputSlot, outputNode, outputIndex))
            return false

        // Получаем инпут слота
        const input = this.inputs[index]

        // Берем тип из output
        if(setTypeFromOutput) input.type = type

        // Замена Label
        if(setLabelFromOutput){
            input.label = makeUniqueName(
                outputSlot.label || outputSlot.name,
                this.inputs.map( item => item.label )
            )
        }

        // Вызов callbackAfter
        return callbackAfter.call(this, index, type, outputSlot, outputNode, outputIndex)

    }

}




/**
 *  Переопределение границы минимальной ширины узла (computeSize).
 * 
 *  @param {LGraphNode} proto
 *  @param {number} minWidth
 *  @returns {void}
 */
export function overrideComputeSizeMinWidth( proto, minWidth=140 ){
    const _computeSize = proto.computeSize
    proto.computeSize = function(){
        const ret = _computeSize?.apply(this, arguments)
        ret[0] = Math.min(minWidth, ret[0])
        return ret
    }
}
