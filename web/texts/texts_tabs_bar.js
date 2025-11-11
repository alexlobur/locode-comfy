import {createElement, makeDraggable, haltEvent} from "../.core/utils/dom_utils.js"
import {TabsIterrator} from "./tabs_iterrator.js"
import { showInputDialog } from "../.core/ui/dialogs/show_input_dialog.js"


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
                    onClone:    () => this.#tabsIterrator.addTab(index, { text: tabData.title, text: tabData.text }),
                    onRemove:   this.#tabsIterrator.tabs.length>1
                        ? () => this.#tabsIterrator.removeTab(index)
                        : null,
                    onRename:    this.#renameHandler,
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
     *  Обработчик переименования Таба
     */
    #renameHandler = async(e, index) => {
        const tabData = this.#tabsIterrator.tabs[index]
        tabData.title = await showInputDialog({ value: tabData.title })
        this.#tabsIterrator.notify()
    }


    /**
     *  Обработчик DragEnd
     */
    #dragEndHandler = (event, index) => {
        // получение индекса
        let dragIndex = event.target.closest(".drag-target")?.getAttribute("tabIndex")
        dragIndex = dragIndex!=null ? Number(dragIndex) : null

        // проверка индекса: нет таргета или перетаскивание на самого себя
        if(dragIndex==null || dragIndex==index || dragIndex==index+1){
            this.#element.classList.remove("drag-mode")
            return
        }

        // корректировка dragIndex после index
        dragIndex = dragIndex < index ? dragIndex : dragIndex-1
        this.#tabsIterrator.moveTab(index, dragIndex)

        // ставим отметку was-dragged
        setTimeout(()=>{
            this.#element.querySelectorAll(".tab")[dragIndex].classList.add("was-dragged")
        }, 50 )

        // удаляем по истечении времени
        setTimeout(()=>{
            this.#element.querySelectorAll(".tab").forEach(el => el.classList.remove("was-dragged") )
            this.#element.classList.remove("drag-mode")
        }, 300 )

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
    onRename,
    onDragStart,
    onDragEnd,
    parent=null
}){
    const name = tabData.title || String(tabIndex)
    const tab = createElement("div", {
        parent:     parent,
        classList:  [ "tab", isActive ? "active" : null ],
        content: `
            <span class="name" title="[${tabIndex}] ${tabData.title}">
                ${name}
            </span>
            <div class="tab-menu">
                <button name="remove">Remove</button>
                <button name="clone">Clone</button>
                <button name="rename">Rename</button>
            </div>
        `,
        events: {
            "click": (e) => haltEvent(e, ()=>onSelect?.(e, tabIndex))
        }
    });

    // Добавление событий
    tab.querySelector('button[name="clone"]').addEventListener("click", (e)=> haltEvent(e, ()=>onClone?.(e, tabIndex)) )
    tab.querySelector('button[name="rename"]').addEventListener("click", (e)=>haltEvent(e, ()=>onRename?.(e, tabIndex)) )
    onRemove!=null
        ? tab.querySelector('button[name="remove"]').addEventListener("click", (e)=>haltEvent(e, ()=>onRemove?.(e, tabIndex)) )
        : tab.querySelector('button[name="remove"]').setAttribute("disabled", "true")

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
