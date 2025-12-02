import {app} from "../../../../../scripts/app.js"
import { importCss, createElement } from "../../.core/utils/dom_utils.js"
import { foreachNodes } from "../../.core/utils/nodes_utils.js"

importCss("deprecated_banner.css", import.meta)


/**---
 * 
 *  Выводит баннер устаревших нодов
 * 
 *  @param {Set<String>} deprecatedTypes
 */
export function updateDeprecatedBanner(deprecatedTypes){
    const banner = createBannerElement(deprecatedTypes)
    banner._refreshNodesList()
}


function createBannerElement(deprecatedTypes){

    // Уже создан
    let banner = document.getElementById("locode_deprecated_banner")
    if(banner) return banner

    // Создание
    banner = createElement("div", {
        classList: ["deprecated_banner"],
        styles: {
            // display: nodes > 0 ? null : "none"
        },
        attributes: {
            id: "locode_deprecated_banner"
        },
        content: `
            <div class="banner_button" title="Deprecated Nodes">
                <span></span>
            </div>
            <div class="banner_window">
                <div class="title">Deprecated Nodes:</div>
                <div class="items"></div>
            </div>
        `,
    })
    banner._deprecatedTypes = deprecatedTypes

    // Обновление списка нодов
    banner._refreshNodesList = function(){
        // получение данных устаревших нодов
        const nodes = getDeprecatedNodesData(this._deprecatedTypes)

        // Видимость баннера
        banner.style.display = nodes.length==0 ?  "none" : ""

        // обновление кнопки баннера
        this.querySelector(".banner_button > SPAN").innerHTML = String(nodes.length)

        // Список нодов
        const itemsList = this.querySelector(".items")
        itemsList.innerHTML = ''
        for (const node of nodes){
            itemsList.insertAdjacentHTML("beforeend", `
                <div class="id"><span>${node.ids.join("</span><span>")}</span></div>
                <div class="title">${node.title}</div>
                <div class="type">${node.type}</div>
            `)
        }
        return nodes.length
    }

    // Скрыть / Показать Баннер
    banner.querySelector(".banner_button").addEventListener("click", (e)=>{
        banner._refreshNodesList()
        banner.classList.toggle("active")
    })

    // Размещение в меню
    const insertElement = document.querySelector("#comfyui-body-top .comfyui-menu-right")
    insertElement.parentNode.insertBefore(banner, insertElement)
    return banner
}




/**
 *  Получение данных списка устаревших узлов
 */
function getDeprecatedNodesData(deprecatedTypes, nodes=null, parentNodeIds=[]){
    const result = []
    foreachNodes(app.graph.nodes, (node, parentNodeIds)=>{
        // устаревший нод
        if(deprecatedTypes.has(node.type)){
            result.push({ ids: [...parentNodeIds, node.id], title: node.title, type: node.type, node: node })
        }
    })
    return result
}