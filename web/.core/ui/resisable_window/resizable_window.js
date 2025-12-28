import {importCss, createElement} from "../../utils/dom_utils.js"

// Подключаем CSS стили
importCss("resizable_window.css", import.meta)

/**
 *  Модальное окно с возможностью изменения размера
 * 
 *  @param {String} value
 *  @returns 
 */
export async function showResizableWindow(){

    const dialog = createElement("dialog", {
        className: "lo-modal-resizable",
        content: createElement("div", {
            className: "lo-modal-resizable-content",
            children: [
                createElement("div", {
                    className: "lo-modal-resizable-header",
                }),
                createElement("div", {
                    className: "lo-modal-resizable-body",
                }),
            ]
        }),
        attributes: {
            "open": "open"
        }
    })

}

