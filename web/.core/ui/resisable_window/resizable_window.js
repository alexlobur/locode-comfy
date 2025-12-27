import {importCss, createElement} from "../../utils/dom_utils.js"

// Подключаем CSS стили
importCss("resizable_window.css", import.meta)

/**
 *  Модальное окно с возможностью изменения размера
 * 
 *  @param {String} value
 *  @returns 
 */
export async function showResizableWindow({ value='', title='' }){

    const dialog = createElement("dialog", {
        attributes: {
            "open": "open"
        }
    })

    // return new Promise((resolve)=>{
    //     const modal = showModal({
    //         className: "lo-modal-resizable",
    //         title: title,
    //         content: createElement("input", {
    //             attributes: { type: "text", value: value },
    //             events: {
    //                 "input": (e)=> value = e.target.value,
    //                 "keydown": (e)=>{
    //                     if(e.keyCode == 13) modal.close()
    //                 }
    //             }
    //         }),
    //         onClosed: ()=> resolve(value)
    //     })
    //     modal.element.querySelector("INPUT").focus()
    // })
}
