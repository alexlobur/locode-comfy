import {app} from "../../../../scripts/app.js"

/**
 *  Утилиты для работы с графом
 */
export const LoGraphUtils = {

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
    foreachNodes: (nodes=null, callBack=null, parentNodesIds=[]) => {
        if(nodes==null) nodes = app.graph.nodes
        const result = []
        for (const node of nodes){
            // нод
            callBack?.(node, parentNodesIds)
            result.push(node)
            // сабграф
            if(node.subgraph!=null){
                result.push(
                    ...LoGraphUtils.foreachNodes( node.subgraph._nodes, callBack, [...parentNodesIds, node.id] )
                )
            }
        }
        return result
    },


    /**
     *  Проход по списку всех ссылок графа (по дереву)
     * 
     *  @param {?function(LLink)} callBack Колбэк функция при проходе каждой ссылки
     *  @returns {LLink[]} Список всех ссылок графа
     */
    foreachLinks: (callBack=null)=>{
        // берём все ссылки из графа
        const links = Array.from(app.graph.links?.values()??[])

        // затем из сабграфов
        const subgraphs = LoGraphUtils.foreachSubgraphs( null, (subgraph)=>{
            links.push(...Array.from(subgraph.links?.values()??[]))
        })

        // проходим по всем ссылкам
        for(const link of links){
            callBack?.(link)
        }

        return links
    },


    /**
     *  Проход по списку всех групп графа (по дереву)
     * 
     * @param {LGraphGroup[]|null} groups
     * @param {?function(group, parentSubgraphs)} callBack
     *  Колбэк функция при проходе каждой группы
     *  Вернет группу и список сабграфов родителей
     * @returns {LGraphGroup[]} Список всех групп графа
     */
    foreachGroups: (callBack=null)=>{
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
        LoGraphUtils.foreachSubgraphs( null, (subgraph, parentSubgraphs)=>
            _callback(subgraph._groups, [...parentSubgraphs, subgraph])
        )

        return result
    },


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
    foreachSubgraphs: (subgraphs=null, callBack=null, parentSubgraphs=[]) => {
        // сабграфы графа
        if(subgraphs==null) subgraphs = Array.from(app.graph._subgraphs?.values()??[])
        const result = []

        // проход по сабграфам
        for (const subgraph of subgraphs){
            callBack?.(subgraph, parentSubgraphs)
            result.push(subgraph)
            if(subgraph._subgraphs!=null){
                result.push(
                    ...LoGraphUtils.foreachSubgraphs(
                        Array.from(subgraph._subgraphs?.values()??[]),
                        callBack, [...parentSubgraphs, subgraph]
                    )
                )
            }
        }
        return result
    },


    /**
     *  Поиск узлов по типу и id
     * 
     *  Если type или ids не указан, то будут найдены все узлы.
     * 
     *  @param {string|null} type
     *  @param {string[]} ids
     *  @returns {LGraphNode[]}
     */
    findNodesBy: ({ type=null, ids=[] }={})=>{
        const result = []
        LoGraphUtils.foreachNodes( app.graph.nodes, (node)=>{
            if(type && node.type != type) return
            if(ids.length > 0 && !ids.includes(node.id)) return
            result.push(node)
        })
        return result
    },


    /**
     *  Поиск узла по свойствам
     * 
     *  @param {{}} props
     *  @returns {LGraphNode|null}
     */
    findNodeBy: (props)=>{
        let result = null
        LoGraphUtils.foreachNodes( app.graph.nodes, (node)=>{
            for(const key in props) if(node[key] !== props[key]) return
            result = node
        })
        return result
    },


    /**
     *  Поиск узла по id (быстрый)
     * 
     *  @param {number} id
     *  @returns {LGraphNode|null}
     */
    findNodeById: (id)=>{
        // сначала ищем в текущем графе
        const node = app.graph._nodes_by_id[id]??null
        if(node) return node
        // затем в сабграфах графа
        const subgraphs = LoGraphUtils.foreachSubgraphs()
        for(const subgraph of subgraphs){
            const node = subgraph._nodes_by_id[id]??null
            if(node) return node
        }
        return null
    },


    /**
     *  Поиск ссылки по id
     * 
     *  @param {number} id
     *  @returns {LLink|null}
     */
    findLinkById: (id)=>{
        // сначала ищем в графе
        const link = app.graph.getLink(id)
        if(link) return link

        // затем в сабграфах графа
        const subgraphs = LoGraphUtils.foreachSubgraphs()
        for(const subgraph of subgraphs){
            const link = subgraph.getLink(id)
            if(link) return link
        }
        return null
    },


    /**
     *  Пытается перейти к узлу
     */
    gotoNode: (node, select = true)=>{
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


}

