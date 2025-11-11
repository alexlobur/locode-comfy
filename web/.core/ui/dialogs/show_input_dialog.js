import {importCss, createElement} from "../../utils/dom_utils.js"
import {showModal} from "../modal/show_modal.js"


// Подключаем CSS стили
importCss("input_dialog.css", import.meta)


/**
 *  Модельное окно с зарпросом ввода
 *  @param {String} value
 *  @returns 
 */
export async function showInputDialog({ value='', title='' }){
    return new Promise((resolve)=>{
        const modal = showModal({
            className: "lo-modal-input-dialog",
            title: title,
            content: createElement("input", {
                attributes: { type: "text", value: value },
                events: {
                    "input": (e)=> value = e.target.value,
                    "keydown": (e)=>{
                        if(e.keyCode == 13) modal.close()
                    }
                }
            }),
            onClosed: ()=> resolve(value)
        })
        modal.element.querySelector("INPUT").focus()
    })
}
