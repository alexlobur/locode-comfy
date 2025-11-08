import {app} from "../../../scripts/app.js"
import {importCss, createElement} from "../.core/utils/dom_utils.js"
import {TabsIterrator} from "./tabs_iterrator.js"
import {TextsTabsBar} from "./texts_tabs_bar.js"


// Подключаем CSS стили
importCss("texts_widget.css", import.meta)

// Минимальные размеры самого узла
const MIN_NODE_WIDTH = 240
const MIN_NODE_HEIGHT = 300

/**
 * TextsWidget
 * Кастомный виджет для массива текстов с закладками
 */
class TextsWidget {

    node            // ссылка на узел
    inputName       // имя входного параметра
    inputData       // данные входного параметра
    app             // ссылка на приложение

    #element

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

        this.node.color = "#2f3544"
        this.node.bgcolor = "#3a435e"

        this.#tabsIterrator.addListener( this.#tabsIterratorHandler )

        // Создаем элемент
        this.#createElement()
    }


    /*** INTERFACE ***/


    /**
     *  Скелет элемента
     */
    #buildDomScaffold({ onInput, onSave, onLoad, onAddTab }){

        this.dom = {
            parent: parent,
            topBar: parent.querySelector(".topbar"),
            menu: parent.querySelector(".popup-menu"),
            textInput: parent.querySelector(".text-input"),
        }
    }


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

        // Tabs
        this.#tabsBar = new TextsTabsBar({
            parent:         element.querySelector(".topbar"),
            tabsIterrator:  this.#tabsIterrator
        })

        // Events
        element.querySelector(".btn_save").addEventListener("click", this.#saveHandler )
        element.querySelector(".btn_load").addEventListener("click", this.#loadHandler )
        element.querySelector(".btn_add_tab").addEventListener("click", ()=> this.#tabsIterrator.addTab() )
        element.querySelector(".text-input").addEventListener("input", this.#textInputHandler )

        // Добавляем элемент к узлу (node)
        this.node.addDOMWidget(this.inputName, "text_array", this.dom.parent, {
            getValue: () => this.getValue(),
            setValue: (value) => this.setValue(value)
        })

        this.#setState()           // Обновляем состояние
        this.#setNodeMinSize()     // Задаём минимальные размеры самого узла и оборачиваем onResize
        this.#updateNodeValue()    // Инициализируем значение узла текущим состоянием, чтобы оно попало в сохранение
        this.#element = element
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
        this.dom.textInput.value = this.#tabsIterrator.activeTab.text
    }



    /*** ACTIONS ***/


    /**
     *  Обработчик изменения текста.
     *  сохраняем текст текущей вкладки и обновляем значение узла
     */
    #textInputHandler = (e) => {
        this.#tabsIterrator.activeTab.text = this.dom.textInput.value
        this.#updateNodeValue()
    }


    /**
     *  Обработчик сохранения файла
     */
    #saveHandler = () => {
    }


    /**
     *  Обработчик загрузки из файла
     */
    #loadHandler = () => {
    }


    /**
     *  Обрабтчик изменения Итерратора
     *  @param {*} data 
     */
    #tabsIterratorHandler = (data) => {
        console.debug(data)
        this.#updateNodeValue()
        this.#setState()
    }


    /**
     * Обновляем значение узла TODO: исправить этот бред
     */
    #updateNodeValue() {
        // Обновляем значение узла
        if (this.node.widgets && this.node.widgets[this.inputName]) {
            this.node.widgets[this.inputName].value = this.getValue()
        }
        // Дублируем в свойства узла для надёжной сериализации
        if (!this.node.properties) this.node.properties = {}
        this.node.properties.widget_data = this.getValue()
        
        // Обновляем узел
        if (this.node.onResize) this.node.onResize()
    }


    /*** GETTERS ***/


    /**
     * Получаем значение
     */
    getValue() {
        return this.#tabsIterrator.toJson()
    }


    /**
     * Устанавливаем значение
     * @param {any} value - значение
     */
    setValue(value){
        this.#tabsIterrator.fromJson(value)
        this.#setState()
        this.#updateNodeValue()
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
    name: "TextsWidget",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // Проверяем, что имя узла соответствует нужному типу
        if (nodeData.name !== "LoTexts") return

        //
        // Создание узла и инициализация виджета
        const onNodeCreated = nodeType.prototype.onNodeCreated
        nodeType.prototype.onNodeCreated = function() {
            const ret = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined

            // создаём и сохраняем ссылку на виджет
            this.__widget = new TextsWidget(this, "widget_data", {}, app)

            // если есть сохранённые значения в properties — загрузим их
            try {
                const saved = this?.properties?.widget_data
                this.__widget.setValue(saved)
            } catch (e) {
                console.warn("LoTexts restore on create failed", e)
            }
            return ret
        }


        //
        // Сериализация: гарантируем сохранение значений
        const onSerialize = nodeType.prototype.onSerialize
        nodeType.prototype.onSerialize = function(o){
            const ret = onSerialize ? onSerialize.apply(this, arguments) : undefined
            try {
                if (!o.properties) o.properties = {};
                const data = this?.__widget?.getValue?.()
                o.properties.widget_data = data;
            } catch (e) {
                console.warn("LoTexts onSerialize warning", e)
            }
            return ret;
        }


        //
        // Конфигурация (загрузка из workflow): восстановим значения в виджет
        const onConfigure = nodeType.prototype.onConfigure;
        nodeType.prototype.onConfigure = function(o) {
            const ret = onConfigure ? onConfigure.apply(this, arguments) : undefined
            try {
                const saved = o?.properties?.widget_data
                this.__widget.setValue(saved)
            } catch (e) {
                console.warn("LoTexts onConfigure warning", e)
            }
            return ret;
        }

    }
})
