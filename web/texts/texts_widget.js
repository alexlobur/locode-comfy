import Logger from "../.core/utils/Logger.js"
import {app} from "../../../scripts/app.js"
import {showInputDialog} from "../.core/ui/dialogs/show_input_dialog.js"
import {importCss, createElement} from "../.core/utils/dom_utils.js"
import {loadFileFromUser, saveFile} from "../.core/utils/files_utils.js"
import {clipboardWrite, clipboardRead} from "../.core/utils/clipboard.js"
import {TabsIterrator} from "./tabs_iterrator.js"
import {TextsTabsBar} from "./texts_tabs_bar.js"


// Подключаем CSS стили
importCss("texts_widget.css", import.meta)

// Конфиг узла
const NODE_CFG = {
    type:       "LoTexts",
    minSize:    [250, 200],
}


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


    get disabledHidden(){ return this.#tabsIterrator.hideDisabled }


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
            const newW = Math.max(size[0], NODE_CFG.minSize[0])
            const newH = Math.max(size[1], NODE_CFG.minSize[1])
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
     *  Обработчик изменения текста.
     *  сохраняем текст текущей вкладки и обновляем значение узла
     */
    #textInputHandler = () => {
        this.#tabsIterrator.activeTab.text = this.#textInput.value
    }


    /**
     *  Копирование в Буфер
     */
    copyData = async() => {
        const data = JSON.stringify(this.#tabsIterrator.toJson(), null, 2)
        await clipboardWrite(data)
    }


    /**
     *  Вставка из Буфера
     */
    pasteData = async(append=false) => {
        const data = JSON.parse(await clipboardRead())
        this.#tabsIterrator.fromJson(data, append)
    }


    clearData = () => {
        this.#tabsIterrator.reset()
    }


    /**
     *  Обработчик сохранения файла
     */
    saveData = async() => {
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
    loadData = async(append=false) => {
        const jsonData = await loadFileFromUser({ accept: ".json" })
        try{
            const data = JSON.parse(jsonData)
            if(data.version==null || data.version>0){
                throw new Error("Bad file version")
            }
            this.#tabsIterrator.fromJson(data.data, append)
        } catch (e){
            Logger.error("loadData", data)
        }
    }


    /**
     *  Изменение отображения неактивных табов
     *  @param {*} data 
     */
    toggleShowDisable = ()=>{
        this.#tabsIterrator.set({ hideDisabled: !this.#tabsIterrator.hideDisabled })
    }


    /**
     *  Обработчик изменения Итерратора
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
            Logger.warn("Bad value in setValue", e)
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
        if (nodeData.name !== NODE_CFG.type) return

        //
        // Создание узла
        const onNodeCreated = nodeType.prototype.onNodeCreated
        nodeType.prototype.onNodeCreated = function() {
            // создаём и сохраняем ссылку на виджет
            this.__widget = new TextsWidget(this, "widget_data", nodeData, app)
            return onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined
        }

        //
        // Контекстное меню
        const getExtraMenuOptions = nodeType.prototype.getExtraMenuOptions
        nodeType.prototype.getExtraMenuOptions = function(canvas, menu) {
            menu = menu ?? []
            menu.unshift(
                {
                    content: "Lo:Texts",
                    has_submenu: true,
                    submenu: {
                        // title: "",
                        options: [ 
                            {
                                content: `${this.__widget.disabledHidden ? "Show Disabled" : "Hide Disabled" }`,
                                callback: this.__widget.toggleShowDisable
                            },
                            null,
                            {
                                content: "Copy to Clipboard",
                                callback: this.__widget.copyData
                            },{
                                content: "Append from Clipboard",
                                callback: () => this.__widget.pasteData(true)
                            },{
                                content: "Replace from Clipboard",
                                callback: () => this.__widget.pasteData(false)
                            },
                            null,
                            {
                                content: "Save to File",
                                callback: this.__widget.saveData
                            },{
                                content: "Append from File",
                                callback: ()=> this.__widget.loadData(true)
                            },{
                                content: "Replace from File",
                                callback: ()=> this.__widget.loadData(false)
                            },
                            null,
                            {
                                content: "Clear Data",
                                callback: ()=> this.__widget.clearData()
                            },
                        ]
                    }
                },
                null
            )
            return getExtraMenuOptions ? getExtraMenuOptions.apply(this, [canvas, menu]) : undefined
        }

    }

})
