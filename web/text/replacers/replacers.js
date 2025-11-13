import {app} from "../../../../scripts/app.js"
import {importCss, createElement} from "../../.core/utils/dom_utils.js"
import Logger from "../../.core/utils/Logger.js"
import { showInputDialog } from "../../.core/ui/dialogs/show_input_dialog.js"
import {loadFileFromUser, saveFile} from "../../.core/utils/files_utils.js"
import { ReplacersInputs } from "./replacers_inputs.js"


// Подключаем CSS стили
importCss("replacers.css", import.meta)
importCss("../../.core/.assets/css/styles.css", import.meta)


const CFG = {
	color: "#2f3544",
	bgcolor: "#3a435e"
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
     *  Обработчик сохранения файла
     */
    saveData = async(e) => {
        const data = {
            version: 0,
            data: this.#inputs.data
        }
        const fname = await showInputDialog({
            title: "File Name",
            value: ""
        })
        saveFile(data, ( fname.trim() || "replacers") +".json" )
    }


    /**
     *  Обработчик загрузки из файла
     */
    loadData = async(e) => {
        const jsonData = await loadFileFromUser({ accept: ".json" })
        try{
            const data = JSON.parse(jsonData)
            if(data.version==null || data.version>0){
                throw new Error("Bad file version")
            }
            this.#inputs.fromJson(data.data)
        } catch (e){
            console.error(data)
        }
    }



	/*** GETTERS ***/

	/**
     * Получаем значение
     */
    getValue() {
        return JSON.stringify(this.#inputs.toJson())
    }


	/**
     * Устанавливаем значение
     * @param {any} value - значение
     */
    setValue(value){
        try{
            this.#inputs.fromJson(JSON.parse(value))
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
        if (nodeData.name !== "LoReplacers") return

		//
        // Создание узла и инициализация виджета
        const onNodeCreated = nodeType.prototype.onNodeCreated
        nodeType.prototype.onNodeCreated = function() {
            const ret = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined
            // создаём и сохраняем ссылку на виджет
            this.__replacers = new ReplacersWidget(this, "widget_data", nodeData, app)
			this.color = CFG.color
            this.bgcolor = CFG.bgcolor
            return ret
        }

        //
        // Создание узла и инициализация виджета
        const getExtraMenuOptions = nodeType.prototype.getExtraMenuOptions
        nodeType.prototype.getExtraMenuOptions = function(canvas, menu) {
            menu = menu ?? []
            menu.push(...[
                {
                    content: "Save Replacers",
                    callback: this.__replacers.saveData
                },{
                    content: "Load Replacers",
                    callback: this.__replacers.loadData
                },
            ])
            return getExtraMenuOptions ? getExtraMenuOptions.apply(this, [canvas, menu]) : undefined
        }

    }

})

