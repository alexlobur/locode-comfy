import {createElement, makeDraggable} from "../.core/utils/dom_utils.js"
import { TabsIterrator } from "./tabs_iterrator.js"


/**
 *  TextsTabs
 */
export class TextsTabsBar{

    /**
     * @type {Element}
     */
    #element

    /**
     * @type {TabsIterrator}
     */
    #tabsIterrator


    /**
     *  TextsTabs
     * 
     *  @param {Element} parent
     *  @param {TabsIterrator} tabsIterrator
     */
    constructor({ parent, tabsIterrator }){
        this.#createElement(parent)
        this.#tabsIterrator = tabsIterrator
        this.#tabsIterrator.addListener( this.#tabsIterratorHandler )
        this.#setState()
    }


    /**
     *  Создание контейнера
     */
    #createElement(parent){
        this.#element = createElement("div", { classList: ["tabs"], parent: parent })
    }


    /**
     *  Обновить стейт
     */
    #setState(){
        // Пересоздаем закладки
        const nodes = []
        const createDragTarget = (index)=> createElement( "div", {
            classList: ["drag-target"],
            content: "<div class='hitbox'></div>",
            attributes: { "tabIndex": index }
        })

        for (let index = 0; index < this.#tabsIterrator.tabs.length; index++){
            const tabData = this.#tabsIterrator.tabs[index]
            // Добавляем dragTarget
            nodes.push(createDragTarget(index))

            // Добавляем Закладку
            nodes.push(
                createTabElement({
                    tabData:    tabData,
                    tabIndex:   index,
                    isActive:   index == this.#tabsIterrator.activeIndex,
                    onSelect:   () => this.#tabsIterrator.set({ activeIndex: index }),
                    onClone:    () => this.#tabsIterrator.addTab(index, { text: item.title, text: item.text }),
                    onRemove:   () => this.#tabsIterrator.removeTab(index),
                    onDragStart: this.#dragStartHandler,
                    onDragEnd:   (_, e) => this.#dragEndHandler(e, index),
                })
            )
        }
        // Добавляем последний dragTarget
        nodes.push(createDragTarget(this.#tabsIterrator.tabs.length))

        // замена элементов
        this.#element.replaceChildren(...nodes)
    }


    /* HANDLERS */

    /**
     *  Обработчик Итерратора Табов
     */
    #tabsIterratorHandler = (data) => {
        this.#setState()
    }


    /**
     *  Обработчик DragStart
     */
    #dragStartHandler = () => {
        this.#element.classList.add("drag-mode")
    }


    /**
     *  Обработчик DragEnd
     */
    #dragEndHandler = (event, index) => {
        this.#element.classList.remove("drag-mode")
        // получение индекса
        let gragIndex = event.target.closest(".drag-target")?.getAttribute("tabIndex")

        // проверка индекса
        if(gragIndex==null) return // нет индекса - выдох
        gragIndex = Number(gragIndex)
        if(gragIndex==index || gragIndex==index+1) return // перетаскивание на самого себя

        // перемещение
        console.log(index, gragIndex)
        this.#tabsIterrator.moveTab(index, gragIndex)
    }

}


/**********************************************************************
 * Создаем элемент закладки
 * 
 * @returns {HTMLElement}
 */
function createTabElement({
    tabData,
    tabIndex,
    isActive,
    onSelect,
    onClone,
    onRemove,
    onDragStart,
    onDragEnd,
    parent=null
}){
    const name = String(tabIndex).padStart(2, "0")
    const tab = createElement("div", {
        parent:     parent,
        classList:  [ "tab", isActive ? "active" : null ],
        content: `
            <span class="name">
                ${name}
            </span>
            <div class="tab-menu">
                <button name="remove">Remove</button>
                <button name="clone">Clone</button>
                <button name="rename">Rename</button>
            </div>
        `,
        events: {
            // Выбор закладки
            "click": (e) => {
                onSelect?.(e, tabIndex)
            },
        }
    });

    // Добавление событий
    tab.querySelector('button[name="clone"]').addEventListener("click", (e)=> onClone?.(e, tabIndex) )
    tab.querySelector('button[name="remove"]').addEventListener("click", (e)=> onRemove?.(e, tabIndex) )

    // Перетаскивание
    makeDraggable({
        element: tab,
        onDragStart: (item, event)=>{
            tab.classList.add("dragged")
            onDragStart(item, event)
        },
        onDragEnd:   (item, event)=>{
            tab.classList.remove("dragged")
            onDragEnd(item, event)
        },
    })

    return tab

}

