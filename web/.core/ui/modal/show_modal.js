import {importCss, createElement, modalBodyFix, runTimer} from "../../utils/dom_utils.js"


// Подключаем CSS стили
importCss("lomodal.css", import.meta)

let zIndex = 20000


/**
 *  Выводит модальное окно.
 *  
 *  Возвращает ссылку на элемент и метод close()
 *  
 *  @param {string|string[]|Node|Node[]|Element|Element[]} title
 *  @param {string|string[]|Node|Node[]|Element|Element[]} content
 *  @param {string|string[]|Node|Node[]|Element|Element[]} actions
 *  @returns {{ element: Element, close: function() }}
 */
export function showModal({ title, content, actions, closeByClickingOutside=true, className, onClosed }){


    /**
     *  Анимация закрытия/открытия
     */
    const openCloseAnimation = async(isClosing = false) => {
        return new Promise((resolve) => {
            runTimer({ duration: 250,
                onProgress: (val) => {
                    const process = isClosing ? 1-val : val
                    element.style.opacity = process
                    const container = element.querySelector(".lomodal-container")
                    const scale = process*0.1+0.9
                    container.style.transform = "scale("+scale+", "+scale+")"
                },
                onDone: ()=>resolve()
            })
        })
    }


    /**
     *  Функция закрытия
     */
    const closeModal = async() => {
        await openCloseAnimation(true)
        element.remove()
        modalBodyFix(false)
        onClosed?.()
    }


    // создание элемента
    const element = createElement("div", {
        classList: ["lomodal", className],
        styles: {
            zIndex: zIndex++
        },
        content: `
            <div class='lomodal-overlay'></div>
            <div class='lomodal-container'>
                <div class='lomodal-wrapper'>
                    <div class='lomodal-window'>
                        <div class='lomodal-close'></div>
                    </div>
                </div>
            </div>"
        `,
    })

    // Содержимое
    element.querySelector(".lomodal-window").append(...[
        createElement("div", { classList: ["lomodal-title"], content: title }),
        createElement("div", { classList: ["lomodal-content"], content: content }),
        createElement("div", { classList: ["lomodal-actions"], content: actions }),
    ])

    console.debug(element)

    // События
    // Закрытие при нажатии вовне
    element.querySelector(".lomodal-container").addEventListener("click", (e)=>{
        if(!closeByClickingOutside) return
        const window = element.querySelector(".lomodal-window")
        if( e.composedPath().indexOf(window) > -1 ) return
        closeModal()
    })
    // Закрытие по кнопке [X]
    element.querySelector(".lomodal-close").addEventListener("click", closeModal )


    // Открытие
    document.body.appendChild(element)
    modalBodyFix(true)
    openCloseAnimation()

    // Результирующий объект
    return {
        element: element,
        close: closeModal
    }

}

