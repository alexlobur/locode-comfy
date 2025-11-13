import {app} from "../../../../scripts/app.js"
import { showInputDialog } from "../../.core/ui/dialogs/show_input_dialog.js"
import Logger from "../../.core/utils/Logger.js"
import {importCss, createElement, haltEvent} from "../../.core/utils/dom_utils.js"
import {loadFileFromUser, saveFile} from "../../.core/utils/files_utils.js"
import {TabsIterrator} from "./tabs_iterrator.js"
import {TextsTabsBar} from "./texts_tabs_bar.js"


// Подключаем CSS стили
importCss("texts_widget.css", import.meta)

// Минимальные размеры самого узла
const MIN_NODE_WIDTH = 260
const MIN_NODE_HEIGHT = 200


/**
 *  TextsWidget
 *  Кастомный виджет для массива текстов с закладками
 */
class TextsWidget {

    node            // ссылка на узел
    inputName       // имя входного параметра
    inputData       // данные входного параметра
    app             // ссылка на приложение

    #element

    #textInput

    /**
     * @type {TabsIterrator}
     */
    #tabsIterrator = new TabsIterrator()

    /**
     * @type {TextsTabsBar}
     */
    #tabsBar


    /**
     * constructor
     * 
     * @param {any} node - узел
     * @param {any} inputName - имя входного параметра
     * @param {any} inputData - данные входного параметра
     * @param {any} app - приложение
     */
    constructor(node, inputName, inputData, app) {
        this.node = node
        this.inputName = inputName
        this.inputData = inputData
        this.app = app

        this.#tabsIterrator.addListener( this.#tabsIterratorHandler )

        // Создаем элемент
        this.#createElement()
    }


    /*** INTERFACE ***/

    /**
     * Создаем интерфейс
     */
    #createElement() {
        // Создаем скелет DOM
        const element = createElement("div", {
            classList: ["lo-texts-widget"],
            content: `
                <div class="popup-menu">
                    <button class="btn_add_tab">Add Tab</button>
                    <button class="btn_save">Save</button>
                    <button class="btn_load">Load</button>
                </div>
                <div class="topbar">
                </div>
                <div class="content">
                    <textarea class="text-input comfy-multiline-input"></textarea>
                </div>
            `
        })
        this.#element = element

        // Текстовый блок
        this.#textInput = this.#element.querySelector(".text-input")

        // Tabs
        this.#tabsBar = new TextsTabsBar({
            parent:             element.querySelector(".topbar"),
            tabsIterrator:      this.#tabsIterrator,
        })

        // Events
        element.querySelector(".btn_save").addEventListener("click", this.#saveHandler )
        element.querySelector(".btn_load").addEventListener("click", this.#loadHandler )
        element.querySelector(".btn_add_tab").addEventListener("click", this.#addTabHandler )
        element.querySelector(".text-input").addEventListener("input", this.#textInputHandler )

        // Добавляем элемент к узлу (node)
        this.node.addDOMWidget( this.inputName, "STRING", element, {
            getValue: () => this.getValue(),
            setValue: (value) => this.setValue(value),
        })

        this.#setNodeMinSize()     // Задаём минимальные размеры самого узла и оборачиваем onResize
        this.#setState()           // Обновляем состояние
    }


    /**
     * Задаём минимальные размеры самого узла и оборачиваем onResize
     */
    #setNodeMinSize() {
        const originalOnResize = this.node.onResize ? this.node.onResize.bind(this.node) : null
        this.node.onResize = (...args) => {
            if (originalOnResize) originalOnResize(...args)
            const size = this.node.size || [0, 0]
            const newW = Math.max(size[0], MIN_NODE_WIDTH)
            const newH = Math.max(size[1], MIN_NODE_HEIGHT)
            if (newW !== size[0] || newH !== size[1]) {
                this.node.size[0] = newW
                this.node.size[1] = newH
                if (this.node.setDirtyCanvas) this.node.setDirtyCanvas(true, true)
            }
        }

        // Применяем ограничения сразу
        if (this.node.onResize) this.node.onResize()
    }


    /**
     *  Обновляем состояние
     */
    #setState(){
        // Устанавливаем значение текстового поля
        this.#textInput.value = this.#tabsIterrator.activeTab.text
        // Обновляем узел
        if (this.node.onResize) this.node.onResize()
    }


    /*** ACTIONS ***/


    /**
     *  Добавление таба
     */
    #addTabHandler = (e) => {
        haltEvent(e)
        this.#tabsIterrator.addTab()
    }


    /**
     *  Обработчик изменения текста.
     *  сохраняем текст текущей вкладки и обновляем значение узла
     */
    #textInputHandler = (e) => {
        haltEvent(e)
        this.#tabsIterrator.activeTab.text = this.#textInput.value
    }


    /**
     *  Обработчик сохранения файла
     */
    #saveHandler = async(e) => {
        haltEvent(e)
        const data = {
            version: 0,
            data: this.#tabsIterrator.toJson()
        }
        const fname = await showInputDialog({
            title: "File Name",
            value: ""
        })
        saveFile(data, ( fname.trim() || "texts_data") +".json" )
    }


    /**
     *  Обработчик загрузки из файла
     */
    #loadHandler = async(e) => {
        haltEvent(e)
        const jsonData = await loadFileFromUser({ accept: ".json" })
        try{
            const data = JSON.parse(jsonData)
            if(data.version==null || data.version>0){
                throw new Error("Bad file version")
            }
            this.#tabsIterrator.fromJson(data.data)
        } catch (e){
            console.error(data)
        }
    }


    /**
     *  Обрабтчик изменения Итерратора
     *  @param {*} data 
     */
    #tabsIterratorHandler = (data) => {
        this.#setState()
    }


    /*** GETTERS ***/


    /**
     * Получаем значение
     */
    getValue() {
        return JSON.stringify(this.#tabsIterrator.toJson())
    }


    /**
     * Устанавливаем значение
     * @param {any} value - значение
     */
    setValue(value){
        try{
            this.#tabsIterrator.fromJson(JSON.parse(value))
            this.#setState()
        } catch (e){
            console.warn("Bad value in setValue")
        }
    }

}


//---
//
// Регистрация фронтенд-расширения ComfyUI:
// - name: произвольное имя расширения (для логов/отладки)
// - beforeRegisterNodeDef: хук, вызывается перед регистрацией каждого определения узла.
//   Здесь мы перехватываем конструктор узла и добавляем наш кастомный виджет
//   только для узла с именем "LoTextArray2".
//
app.registerExtension({
    name: "locode.Texts",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // Проверяем, что имя узла соответствует нужному типу
        if (nodeData.name !== "LoTexts") return

        //
        // Создание узла и инициализация виджета
        const onNodeCreated = nodeType.prototype.onNodeCreated
        nodeType.prototype.onNodeCreated = function() {
            const ret = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined
            // создаём и сохраняем ссылку на виджет
            this.__widget = new TextsWidget(this, "widget_data", nodeData, app)
            this.color = "#2f3544"
            this.bgcolor = "#3a435e"
        }

        //
        // Сериализация: гарантируем сохранение значений
        // const onSerialize = nodeType.prototype.onSerialize
        // nodeType.prototype.onSerialize = function(o) {
        //     const ret = onSerialize ? onSerialize.apply(this, arguments) : undefined
        //     console.debug("SERIALIZE", this, arguments)
        //     return ret
        // }

    }

})
