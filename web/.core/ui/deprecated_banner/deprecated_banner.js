import {app} from "../../../../../scripts/app.js"
import { importCss, createElement } from "../../utils/dom_utils.js"
import Logger from "../../utils/Logger.js"

importCss("deprecated_banner.css", import.meta)


/**---
 * 
 *  Выводит баннер устаревших нодов
 * 
 *  @param {Set<String>} deprecatedTypes
 */
export function showDeprecatedBanner(deprecatedTypes){
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
                <div class="actions">
                    <div class="refresh">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.0461 9.57675C21.1482 9.95772 21.2272 10.3596 21.2824 10.7792C21.3385 11.2054 21.3667 11.6132 21.3667 11.9999C21.3667 14.5863 20.3182 16.9283 18.6231 18.6232C16.9281 20.3183 14.5863 21.3668 11.9998 21.3668C9.4133 21.3668 7.07136 20.3183 5.37641 18.6232C3.68139 16.9282 2.63281 14.5863 2.63281 11.9999C2.63281 9.41338 3.68139 7.07145 5.37641 5.37649C7.04061 3.71229 9.32843 2.6713 11.8589 2.63399V1.27942L16.1566 4.04224L11.8589 6.80513V5.28962C10.0613 5.32675 8.43734 6.07043 7.25384 7.25392C6.03947 8.4683 5.28802 10.1464 5.28802 11.9999C5.28802 13.8534 6.03941 15.5315 7.25384 16.7459C8.46821 17.9604 10.1464 18.7117 11.9998 18.7117C13.8533 18.7117 15.5315 17.9604 16.7458 16.7459C17.9603 15.5315 18.7117 13.8534 18.7117 11.9999C18.7117 11.6838 18.6938 11.3902 18.6585 11.1215C18.6222 10.8462 18.5641 10.5586 18.4843 10.2613L21.0463 9.57681L21.0461 9.57675Z"/></svg>
                    </div>
                </div>
                <div class="title">Deprecated Nodes:</div>
                <div class="items"></div>
            </div>
        `,
    })
    banner._deprecatedTypes = deprecatedTypes

    // Обновление списка нодов
    banner._refreshNodesList = function(){

        Logger.debug(app.graph.nodes)

        // получение списка нодов
        const nodes = app.graph.nodes.filter( node => this._deprecatedTypes.has(node.type) )

        // TODO: Нужен рекурсивный поиск в сабграфах node.subgraph
        for (let subgraph of app.graph.subgraphs.values()){
            const sgNodes = subgraph._nodes.filter( node => this._deprecatedTypes.has(node.type) )
            nodes.push(...(sgNodes??[]))
        }

        // Видимость баннера
        banner.style.display = nodes.length==0 ?  "none" : ""

        // обновление кнопки баннера
        this.querySelector(".banner_button > SPAN").innerHTML = String(nodes.length)

        // Список нодов
        const itemsList = this.querySelector(".items")
        itemsList.innerHTML = ''
        for (const node of nodes){
            itemsList.insertAdjacentHTML("beforeend", `
                <div class="id">${node.id}</div>
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

    // Обновление
    banner.querySelector(".refresh").addEventListener("click", ()=>banner._refreshNodesList() )

    // Размещение в меню
    const insertElement = document.querySelector("#comfyui-body-top .comfyui-menu-right")
    insertElement.parentNode.insertBefore(banner, insertElement)
    return banner
}