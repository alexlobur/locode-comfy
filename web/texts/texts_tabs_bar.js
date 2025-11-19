import {createElement, makeDraggable, haltEvent} from "../.core/utils/dom_utils.js"
import { showInputDialog } from "../.core/ui/dialogs/show_input_dialog.js"
import {TabsIterrator} from "./tabs_iterrator.js"

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

        // Пропущено из-за disabled
        let skipped = 0

        for (let index = 0; index < this.#tabsIterrator.tabs.length; index++){
            const tabData = this.#tabsIterrator.tabs[index]

            // Если Таб отключен, увеличиваем число пропущенных
            if(tabData.disabled) skipped++

            // скипаем если включен режим hideDisabled
            if(this.#tabsIterrator.hideDisabled) continue

            // Добавляем dragTarget
            nodes.push(createDragTarget(index))

            // Добавляем Закладку
            nodes.push(
                createTabElement({
                    tabData:        tabData,
                    displayIndex:   index-skipped,
                    tabIndex:       index,
                    isActive:   index == this.#tabsIterrator.activeIndex,
                    onSelect:   () => this.#tabsIterrator.set({ activeIndex: index }),
                    onAdd:      () => this.#tabsIterrator.addTab(index+1, { title: "", text: "", activeIndex: index+1 }),
                    onClone:    () => this.#tabsIterrator.addTab(index+1, { title: tabData.title, text: tabData.text, activeIndex: index+1 }),
                    onRemove:   this.#tabsIterrator.tabs.length>1
                        ? () => this.#tabsIterrator.removeTab(index)
                        : null,
                    onRename:   () => this.#renameHandler(index),
                    onDisableToggle: ()=>{
                        tabData.disabled = !tabData.disabled
                        this.#tabsIterrator.notify()
                    },
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
    #renameHandler = async(index) => {
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
    displayIndex,
    tabIndex,
    isActive,
    onSelect,
    onAdd,
    onClone,
    onRemove,
    onRename,
    onDragStart,
    onDragEnd,
    onDisableToggle,
    parent=null
}){
    const name = tabData.title || ( tabData.disabled ? "-" : String(displayIndex) )
    const title = tabData.disabled ? `[-] ${tabData.title}` : `[${displayIndex}] ${tabData.title}`

    const tab = createElement("div", {
        parent:     parent,
        classList:  [ "tab", isActive ? "active" : null, tabData.disabled ? "disabled" : null ],
        content: `
            <span class="name" title="${title}">
                ${name}
            </span>
            <div class="locode-widget-menu">
                <button name="remove">Remove</button>
                <button name="add">Add</button>
                <button name="clone">Clone</button>
                <button name="toggle_disable">${ tabData.disabled ? "Enable" : "Disable" }</button>
                <button name="rename">Rename</button>
            </div>
        `,
        events: {
            "click": (e) => haltEvent(e, ()=>onSelect?.(e, tabIndex))
        }
    })

    // Добавление событий
    tab.querySelector('button[name="add"]').addEventListener("click", (e)=> haltEvent(e, ()=>onAdd?.(e)) )
    tab.querySelector('button[name="clone"]').addEventListener("click", (e)=> haltEvent(e, ()=>onClone?.(e)) )
    tab.querySelector('button[name="rename"]').addEventListener("click", (e)=>haltEvent(e, ()=>onRename?.(e)) )
    tab.querySelector('button[name="toggle_disable"]').addEventListener("click", (e)=>haltEvent(e, ()=>onDisableToggle?.(e)) )

    onRemove!=null
        ? tab.querySelector('button[name="remove"]').addEventListener("click", (e)=>haltEvent(e, ()=>onRemove?.(e)) )
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
