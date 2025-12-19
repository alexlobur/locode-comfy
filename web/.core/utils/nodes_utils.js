import {app} from "../../../../scripts/app.js"
import Logger from "./Logger.js"
import {makeUniqueName} from "./base_utils.js"


/**
 *  Проход по списку всех узлов графа (по дереву)
 * 
 * @param {LGraphNode[]|null} nodes
 * @param {?function(node, parentNodesIds)} callBack
 *  Колбэк функция при проходе каждого нода.
 *  Вернет нод и список id родителей
 * @param {Number[]} parentNodesIds
 * @returns {LGraphNode[]} Список всех узлов графа
 */
export function foreachNodes(nodes=null, callBack=null, parentNodesIds=[]){
    if(nodes==null) nodes = app.graph.nodes
    const result = []
    for (const node of nodes){
        // нод
        callBack?.(node, parentNodesIds)
        result.push(node)
        // сабграф
        if(node.subgraph!=null){
            result.push(
                ...foreachNodes( node.subgraph._nodes, callBack, [...parentNodesIds, node.id] )
            )
        }
    }
    return result
}


/**
 *  Проход по списку всех ссылок графа (по дереву)
 * 
 *  @param {?function(LLink)} callBack Колбэк функция при проходе каждой ссылки
 *  @returns {LLink[]} Список всех ссылок графа
 */
export function foreachLinks(callBack=null){
    // берём все ссылки из графа
    const links = Array.from(app.graph.links?.values()??[])

    // затем из сабграфов
    const subgraphs = foreachSubgraphs( null, (subgraph)=>{
        links.push(...Array.from(subgraph.links?.values()??[]))
    })

    // проходим по всем ссылкам
    for(const link of links){
        callBack?.(link)
    }

    return links
}



/**
 *  Проход по списку всех групп графа (по дереву)
 * 
 * @param {LGraphGroup[]|null} groups
 * @param {?function(group, parentSubgraphs)} callBack
 *  Колбэк функция при проходе каждой группы
 *  Вернет группу и список сабграфов родителей
 * @returns {LGraphGroup[]} Список всех групп графа
 */
export function foreachGroups(callBack=null){
    const result = []

    // колбэк для прохода по группам
    const _callback = (groups, parentSubgraphs)=>{
        for(const group of groups){
            callBack?.(group, parentSubgraphs)
            result.push(group)
        }
    }

    // группы графа
    _callback(app.graph._groups, [])

    // группы сабграфов
    foreachSubgraphs( null, (subgraph, parentSubgraphs)=>
        _callback(subgraph._groups, [...parentSubgraphs, subgraph])
    )

    return result
}


/**
 *  Проход по списку всех сабграфов графа (по дереву)
 * 
 * @param {LGraphSubgraph[]|null} subgraphs
 * @param {?function(subgraph, parentSubgraphs)} callBack
 *  Колбэк функция при проходе каждого сабграфа
 *  Вернет сабграф и список сабграфов родителей
 * @param {LGraphSubgraph[]} parentSubgraphs
 * @returns {LGraphSubgraph[]} Список всех сабграфов графа
 */
function foreachSubgraphs(subgraphs=null, callBack=null, parentSubgraphs=[]){
    // сабграфы графа
    if(subgraphs==null) subgraphs = Array.from(app.graph._subgraphs?.values()??[])
    const result = []

    // проход по сабграфам
    for (const subgraph of subgraphs){
        callBack?.(subgraph, parentSubgraphs)
        result.push(subgraph)
        if(subgraph._subgraphs!=null){
            result.push(
                ...foreachSubgraphs(
                    Array.from(subgraph._subgraphs?.values()??[]),
                    callBack, [...parentSubgraphs, subgraph]
                )
            )
        }
    }
    return result
}


/**
 *  Поиск узлов по типу и id
 * 
 *  Если type или ids не указан, то будут найдены все узлы.
 * 
 *  @param {string|null} type
 *  @param {string[]} ids
 *  @returns {LGraphNode[]}
 */
export function findNodesBy({ type=null, ids=[] }={}){
    const result = []
    foreachNodes( app.graph.nodes, (node)=>{
        if(type && node.type != type) return
        if(ids.length > 0 && !ids.includes(node.id)) return
        result.push(node)
    })
    return result
}


/**
 *  Поиск узла по свойствам
 * 
 *  @param {{}} props
 *  @returns {LGraphNode|null}
 */
export function findNodeBy(props){
    let result = null
    foreachNodes( app.graph.nodes, (node)=>{
        for(const key in props) if(node[key] !== props[key]) return
        result = node
    })
    return result
}


/**
 *  Поиск узла по id (быстрый)
 * 
 *  @param {number} id
 *  @returns {LGraphNode|null}
 */
export function findNodeById(id){
    // сначала ищем в текущем графе
    const node = app.graph._nodes_by_id[id]??null
    if(node) return node
    // затем в сабграфах графа
    const subgraphs = foreachSubgraphs()
    for(const subgraph of subgraphs){
        const node = subgraph._nodes_by_id[id]??null
        if(node) return node
    }
    return null
}


/**
 *  Поиск ссылки по id
 * 
 *  @param {number} id
 *  @returns {LLink|null}
 */
export function findLinkById(id){
    // сначала ищем в графе
    const link = app.graph.getLink(id)
    if(link) return link

    // затем в сабграфах графа
    const subgraphs = foreachSubgraphs()
    for(const subgraph of subgraphs){
        const link = subgraph.getLink(id)
        if(link) return link
    }
    return null
}




/**
 *  Пытается перейти к узлу
 */
export function gotoNode(node, select = true){
    if(!node) return
    // переход на граф узла
    if(app.canvas.graph.id !== node.graph.id){
        app.canvas.openSubgraph(node.graph)
    }
    // переход к узлу и выделение
    setTimeout(()=>{
        app.canvas.centerOnNode(node)
        if(select) app.canvas.selectNode(node, false)
    }, 50)
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
 *  Нормализация динамических инпутов
 *  Удаление пустых
 * 
 *  @param {LGraphNode} node 
 *  @param {(node, index, input)=>void} onLabelChanged - функция для обработки изменений Label
 *  @returns {void}
 */
export function normalizeDynamicInputs(node, { onLabelChanged=null }={}){

    // удаление инпутов без соединения
    node.inputs = node.inputs.filter( input =>{
        if(!input.isConnected) return false        // проверка наличия соединения
        return (findLinkById(input.link)!=null)    // проверка существования ссылки
    })

    // Обновление типов
    let index=0
    for (const input of node.inputs){
        // обновление типа из выхода узла по ссылке
        const link = findLinkById(input.link)
        if(link){
            input.type = link.type
            // const originNode = app.graph.getNodeById(link.origin_id)
            // input.type = originNode?.outputs[link.origin_slot].type??"*"
        }
        // вешаем слушатель на label
        if(onLabelChanged){
            watchSlotLabel( input, {
                onChanged: (input) => onLabelChanged?.(node, index, input)
            })
        }
        index++
    }
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
    setLocalizationNameFromOutput = false,
} = {}){
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

        // Замена localization_name
        if(setLocalizationNameFromOutput){
            input.localization_name = makeUniqueName(
                outputSlot.label || outputSlot.localization_name || outputSlot.name,
                this.inputs.map( item => item.localization_name ),
                { excludeIndex: index }
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
 *  @param {number|undefined} minWidth
 *  @returns {void}
 */
export function overrideComputeSizeMinWidth( proto, minWidth=undefined ){
    if(!minWidth) return
    const _computeSize = proto.computeSize
    proto.computeSize = function(){
        const ret = _computeSize?.apply(this, arguments)
        ret[0] = Math.min(minWidth, ret[0])
        return ret
    }
}


/**
 *  Нормализация меню
 *  - удаляет повторяющиеся null
 */
export function normalizeMenu(menu){
    // обратный проход по меню и удаление повторяющихся null
    let nullsCount = 0

    console.log("normalizeMenu", menu)

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


