import Logger from "../.core/utils/Logger.js"
import {app} from "../../../scripts/app.js"
import {importCss, createElement} from "../.core/utils/dom_utils.js"
import {showInputDialog} from "../.core/ui/dialogs/show_input_dialog.js"
import {loadFileFromUser, saveFile} from "../.core/utils/files_utils.js"
import {clipboardWrite, clipboardRead} from "../.core/utils/clipboard.js"
import {ReplacersInputs} from "./replacers_inputs.js"

// Подключаем CSS стили
importCss("replacers.css", import.meta)

// Конфиг узла
const NODE_CFG = {
    type:       "LoReplacers",
}


/**
 *  ReplacersWidget
 *  Кастомный виджет для ReplacersWidget
 */
class ReplacersWidget {

    node            // ссылка на узел
    inputName       // имя входного параметра
    inputData       // данные входного параметра
    app             // ссылка на приложение

    #element
	#inputs

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

        // Создаем элемент
        this.#createElement()
	}


    /*** INTERFACE ***/

    /**
     * Создаем интерфейс
     */
    #createElement() {
        // Создаем скелет DOM
        this.#element = createElement("div", {
            classList: ["locode-replacers"],
            content: `
				<div class="inputs locode-scrollbar"></div>
			`
        })

		// Инпуты
		this.#inputs = new ReplacersInputs({
			parent:		this.#element.querySelector(".inputs"),
			onChanged:	this.#changeHandler
		})

        // Добавляем элемент к узлу (node)
        this.node.addDOMWidget( this.inputName, "STRING", this.#element, {
            getValue: () => this.getValue(),
            setValue: (value) => this.setValue(value),
        })
    }


	/*** ACTIONS ***/

    /**
     *  Обработчик изменения данных
     */
    #changeHandler = () => {
		if(this.node.onResize) this.node.onResize()
    }


    /**
     *  Копирование данных в буфер обмена
     */
    copyData = async() => {
        const data = JSON.stringify(this.#inputs.encode(), null, 2)
        await clipboardWrite(data)
    }


    /**
     *  Вставка данных из буфера обмена
     *  @param {boolean} append - флаг, указывающий, нужно ли добавлять данные к существующим
     */
    pasteData = async(append=false) => {
        const data = JSON.parse(await clipboardRead())
        this.#inputs.decode(data, append)
    }


    /**
     *  Обработчик сохранения файла
     */
    saveData = async() => {
        const data = { version: 0, data: this.#inputs.encode() }
        const fname = await showInputDialog({
            title: "File Name",
            value: ""
        })
        saveFile(data, ( fname.trim() || "replacers") +".json" )
    }


    /**
     *  Обработчик загрузки из файла
     *  @param {boolean} append - флаг, указывающий, нужно ли добавлять данные к существующим
     */
    loadData = async(append=false) => {
        const jsonData = await loadFileFromUser({ accept: ".json" })
        try{
            const data = JSON.parse(jsonData)
            if(data.version==null || data.version>0){
                throw new Error("Bad file version")
            }
            this.#inputs.decode(data.data, append)
        } catch (e){
            Logger.error("loadData Error", e)
        }
    }


    /**
     *  Очистка данных
     */
    clearData = () => {
        this.#inputs.reset()
    }


    /*** GETTERS ***/

    /**
     * Получаем значение
     */
    getValue() {
        return JSON.stringify(this.#inputs.encode())
    }


	/**
     * Устанавливаем значение
     * @param {any} value - значение
     */
    setValue(value){
        try{
            this.#inputs.decode(JSON.parse(value))
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
    name: "locode.Replacers",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // Проверяем, что имя узла соответствует нужному типу
        if (nodeData.name !== NODE_CFG.type) return

		//
        // Создание узла и инициализация виджета
        const onNodeCreated = nodeType.prototype.onNodeCreated
        nodeType.prototype.onNodeCreated = function() {
            // создаём и сохраняем ссылку на виджет
            this.__replacers = new ReplacersWidget(this, "replacers", nodeData, app)
            return onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined
        }

        //
        // Контекстное меню
        const getExtraMenuOptions = nodeType.prototype.getExtraMenuOptions
        nodeType.prototype.getExtraMenuOptions = function(canvas, menu) {
            menu = menu ?? []
            menu.unshift(
                {
                    content: "Lo:Replacers",
                    has_submenu: true,
                    submenu: {
                        title: "Replacers",
                        options: [
                            {
                                content: "Copy to Clipboard",
                                callback: () => this.__replacers.copyData()
                            },{
                                content: "Append from Clipboard",
                                callback: () => this.__replacers.pasteData(true)
                            },{
                                content: "Replace from Clipboard",
                                callback: () => this.__replacers.pasteData(false)
                            },
                            null,
                            {
                                content: "Save to File",
                                callback: ()=>this.__replacers.saveData()
                            },{
                                content: "Append from File",
                                callback: ()=>this.__replacers.loadData(true)
                            },{
                                content: "Load from File",
                                callback: ()=>this.__replacers.loadData(false)
                            },
                            null,
                            {
                                content: "Clear Data",
                                callback: ()=> this.__replacers.clearData()
                            },
                        ]
                    }
                },
                null,
            )

            return getExtraMenuOptions ? getExtraMenuOptions.apply(this, [canvas, menu]) : undefined
        }

    }

})

