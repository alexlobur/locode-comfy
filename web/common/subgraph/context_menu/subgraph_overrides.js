// import {app} from "../../../../../scripts/app.js"
// import { ComfyWidgets } from '../../../../../scripts/widgets.js';
// import { api } from '../../../../../scripts/api.js';
// import * as utils from '../../../../../scripts/utils.js';
// import { ComfyButtonGroup } from '../../../../../scripts/ui/components/buttonGroup.js';
// import { SubgraphInputNode } from "../../../../../lib/litegraph/src/subgraph/SubgraphInputNode.js"

import { hookMethod } from "../../../.core/utils/base_utils.js"


/**
 *  Утилиты для сабграфов
 */
export class LoSubgraphOverrides{

    static setOverrides(node){
        if(!node.subgraph) return

        console.debug("window.comfyAPI", window.comfyAPI)
        // console.debug("ComfyWidgets", ComfyWidgets)
        // console.debug("api", api)
        // console.debug("utils", utils)
        // console.debug("ComfyButtonGroup", ComfyButtonGroup)

        this.#overrideGetExtraMenuOptions(node)
    }

    /**
     * Переопределяет метод getExtraMenuOptions для сабграфа
     * @param {LGraphNode} subgraphNode - Сабграф
     */
    static #overrideGetExtraMenuOptions(subgraphNode){
        // получение сабграфа
        const subgraph = subgraphNode.graph._subgraphs.get(subgraphNode.type)
        console.debug("subgraph", subgraph, inputNode, outputNode)

        // Устанавливает контекстное меню для сабграфов
        hookMethod(subgraphNode, "getExtraMenuOptions", {
            after: (canvas, options) => {
                console.debug("getExtraMenuOptions", options)
                options.unshift({
                    content: "Manage Subgraph [lo]",
                    callback: () => {
                        console.debug("test")
                    }
                })
            }
        })
    }


    /**
     * Переопределяет метод getExtraMenuOptions для сабграфа
     * @param {LGraphNode} subgraphNode - Сабграф
     */
    // static #overrideGetExtraMenuOptions(subgraphNode){
    //     // получение сабграфа
    //     const subgraph = subgraphNode.graph._subgraphs.get(subgraphNode.type)
    //     const inputNode = subgraph?.inputNode
    //     const outputNode = subgraph?.outputNode
    //     console.debug("subgraph", subgraph, inputNode, outputNode)

        // // переопределение getExtraMenuOptions
        // hookMethod(subgraph, "getExtraMenuOptions", {
        //     after: () => {
        //         console.debug("getExtraMenuOptions: after", ...arguments)
        //     }
        // })

        // // переопределение getExtraMenuOptions для входного нода
        // hookMethod(inputNode, "getExtraMenuOptions", {
        //     before: () => {
        //         console.debug("getExtraMenuOptions: after", ...arguments)
        //     }
        // })

        // // переопределение getSlotMenuOptions для входного нода
        // hookMethod(inputNode, "showSlotContextMenu", {
        //     before: () => {
        //         console.debug("showSlotContextMenu: after", ...arguments)
        //     }
        // })

        // // переопределение getSlotMenuOptions для выходного нода
        // hookMethod(outputNode, "getSlotMenuOptions", {
        //     before: () => {
        //         console.debug("getSlotMenuOptions: after", ...arguments)
        //     }
        // })
    // }

}

