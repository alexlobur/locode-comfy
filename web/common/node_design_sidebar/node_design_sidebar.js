import { app } from "../../../../scripts/app.js"
import LoCore from "../../.core/lo_core.js"
import Logger from "../../.core/utils/Logger.js"
import { createElement, importCss } from "../../.core/utils/dom_utils.js"
import { foreachNodes } from "../../.core/utils/nodes_utils.js"


importCss("node_design_sidebar.css", import.meta)


const OPTIONS = {
	pinned:		{ title: "Pinned",		default: false },
	removable:	{ title: "Removable",	default: true },
	resizable:	{ title: "Resizable",	default: true },
	collapsed:	{ title: "Collapsed",	default: false },
	has_errors:	{ title: "Has Errors",	default: false },
}

const SHAPES = [
	{ value: 0, title: "Round" },
	{ value: 1, title: "Box" },
	{ value: 4, title: "Card" },
]

const MODES = [
	{ value: 0, label: "A", title: "Active" },
	{ value: 2, label: "M", title: "Muted" },
	{ value: 4, label: "B", title: "Bypassed" },
]


/**
 * Singleton класс для работы с дизайном узлов (NodeDesign)
 */
export default class NodeDesignSidebar {

	#element = null
	get element(){
		return this.#element
	}

	#widgets = []

	get selectedNodes(){
		return Object.values(app.canvas.selected_nodes ?? {})
	}

	get graphNodes(){
		return foreachNodes(null)
	}


	/**
	 * Конструктор
	 */
	constructor(parentElement=null){
		this.#createElement(parentElement)
		this.#setState()
		LoCore.events.on("canvas_selection_changed", this.#eventHandler)
		LoCore.events.on("canvas_node_moved", this.#eventHandler)
	}


	#eventHandler = (event, data) => {
		Logger.debug("eventHandler", this.selectedNodes)
		this.#setState()
	}


	/* STATE */

	/**
	 * Обновление значений из выбранных узлов графа
	 */
	#setState = () => {
		const nodes = this.selectedNodes
		const allNodes = this.graphNodes

		// Обновление информации о выбранных узлах
		this.#element.querySelector(".info").textContent = `selected: ${nodes.length} / total: ${allNodes.length}`

		// Обновление значений из узлов
		this.#widgets.forEach(widget=> widget.updateFromNodes(nodes, allNodes))
	}


	/**
	 *	Обновление состояния кнопок Shapes

	 *	@param {string} type - Тип
	 *	@param {string} value - Значение
	 */
	 #haddleChanges = (type, value) => {
		for (const node of this.selectedNodes){
			switch (type) {
				case "pinned":
					if(node["pinned"] !== value) node.pin()
					break;
				case "collapsed":
					if(node["collapsed"] !== value) node.collapse()
					break;
				case "size":
					node.setSize([ value[0] ?? node.size[0], value[1] ?? node.size[1] ])
					break;
				case "pos":
					node.pos = [ value[0] ?? node.pos[0], value[1] ?? node.pos[1] ]
					break;
				default:
					node[type] = value
			}
			node.setDirtyCanvas(true, true)
		}
		this.#setState()
	}


	/**
	 * Создание окна Node Design
	 */
	#createElement(parentElement){

		this.#widgets = [
			_ColorBlock({label: "Box Color", type: "boxcolor", renderingType: "renderingBoxColor", onChanged: this.#haddleChanges }),
			_ColorBlock({label: "Title Background", type: "color", renderingType: "renderingColor", onChanged: this.#haddleChanges }),
			_ColorBlock({label: "Content Background", type: "bgcolor", renderingType: "renderingBgColor", onChanged: this.#haddleChanges }),
			_ShapesBlock({ onChanged: this.#haddleChanges }),
			_OffsetBlock({ label: "Size: ", type: "size", xTitle: "width", yTitle: "height", onChanged: this.#haddleChanges }),
			_OffsetBlock({ label: "Pos: ", type: "pos", onChanged: this.#haddleChanges }),
			_ModesBlock({ onChanged: this.#haddleChanges }),
			_OptionsBlock({ onChanged: this.#haddleChanges }),
		]

		this.#element = createElement("DIV", {
			classList: ["locode-sidebar-nodes"],
			content: [
				'<div class="header">Nodes Design</div>',
				'<div class="info">selected: 0 / total: 0</div>',
				...this.#widgets,
			],
			parent: parentElement,
		})
	}

}


//---
//
// WIDGETS
//
//---


/**
 *	Создание блока для выбора режимов работы узлов
 * 
 *	@param {(type: string, value: string)=>void} onChanged - Функция на изменение значения
 *	@returns {HTMLElement}
 */
 function _ModesBlock({ onChanged }){

	// Создание элемента
	const element = createElement("DIV", {
		classList: [ "modes" ],
		content: [
			...MODES.map( mode =>
				createElement("BUTTON", {
					attributes: { value: mode.value, title: mode.title },
					content: mode.label,
					events: {
						click: (e)=>onChanged?.("mode", mode.value)
					}
				})
			),
		]
	})

	element.updateFromNodes = function(nodes){
		const modes = new Set()
		for (const node of nodes) modes.add(node.mode??0)
		this.querySelectorAll("button").forEach(modeEl=>{
			modeEl.classList.toggle("selected", modes.has( parseInt(modeEl.getAttribute("value")) ))
		})
	}

	return element
}



/**
 *	Создание блока для выбора размера/положения
 *
 *	@param {(type: string, value: string)=>void} onChanged - Колбэк при изменении значения
 *	@returns {HTMLElement}
 */
 function _OffsetBlock({ label, type, xTitle="x", yTitle="y", onChanged }){
	// Создание элемента
	const element = createElement("DIV", {
		classList: ["nodes_offset"],
		content: `
			<div class="label">${label}</div>
			<input type="number" min="10" name="x" title="${xTitle}">
			<input type="number" min="10" name="y" title="${yTitle}">
		`,
	})
	const xInput = element.querySelector("input[name='x']")
	const yInput = element.querySelector("input[name='y']")

	// Обработка событий изменения значения
	xInput.addEventListener("change", (e)=>onChanged?.( type, [ xInput.value, null ] ))
	yInput.addEventListener("change", (e)=>onChanged?.( type, [ null, yInput.value ] ))

	// Обновление значений из узлов
	element.updateFromNodes = function(nodes){
		const offsets = { x: new Set(), y: new Set() }
		for (const node of nodes){
			offsets.x.add(parseInt(node[type][0]))
			offsets.y.add(parseInt(node[type][1]))
		}
		// обновление значений
		xInput.value = offsets.x.size !== 1 ? "" : offsets.x.values().next().value
		yInput.value = offsets.y.size !== 1 ? "" : offsets.y.values().next().value
		// обновление placeholder
		xInput.setAttribute("placeholder", offsets.x.size > 1 ? "mixed..." : xTitle )
		yInput.setAttribute("placeholder", offsets.y.size > 1 ? "mixed..." : yTitle )
	}
	return element
}


/**
 *	Создание блока для выбора опций
 *
 *	@param {(type: string, value: string)=>void} onChanged - Функция на изменение значения
 *	@returns {HTMLElement}
 */
function _OptionsBlock({ onChanged }){

	// Создание блоков для опций
	const options = Object.entries(OPTIONS).map( ([key, data])=>{
		return _OptionBlock({
			name:			key,
			title:			data.title,
			defaultValue:	data.default,
			onChanged: 		onChanged
		})
	})

	// Создание элемента
	const element = createElement("DIV", { classList: ["options"], content: options })

	// Обновление значений из узлов
	element.updateFromNodes = function(nodes){
		for (const option of options) option.updateFromNodes(nodes)
	}

	return element
}


/**
 *	Создание элемента для выбора опций
 *
 *	@param {string} name - Имя
 *	@param {string} title - Заголовок
 *	@param {string} defaultValue - Значение по умолчанию
 *	@param {(type: string, value: string)=>void} onChanged - Функция на изменение значения
 *	@returns {HTMLElement}
 */
 function _OptionBlock({ name, title, defaultValue, onChanged }){
	// Создание элемента
	const element = createElement("BUTTON", {
		classList: ["option"],
		attributes: { name: name, title: title, value: defaultValue },
		content: title,
		events: {
			click: (e)=>onChanged?.(name, !element._optionValue)
		}
	})
	element._optionValue = defaultValue

	// Обновление значений из узлов
	element.updateFromNodes = function(nodes){
		const values = new Set()
		for (const node of nodes) values.add(node[name]??defaultValue)
		this._optionValue = values.size !== 1 ? null : values.values().next().value
		this.setAttribute("value", this._optionValue )
	}
	return element
}


/**
 *	Создание блока для выбора формы
 * 
 *	@param {(type: string, value: string)=>void} onChanged - Функция на изменение значения
 *	@returns {HTMLElement}
 */
function _ShapesBlock({ onChanged }){

	// Создание элемента
	const element = createElement("DIV", {
		classList: ["shapes"],
		content: SHAPES.map( shape =>
			createElement("BUTTON", {
				attributes: { value: shape.value, title: shape.title },
				events: {
					click: (e)=>onChanged?.("shape", shape.value)
				}
			})
		)
	})

	element.updateFromNodes = function(nodes){
		const shapes = new Set()
		for (const node of nodes){
			const value = SHAPES.find(shape=>shape.value === node.shape)?.value ?? 0
			shapes.add(value)
		}
		this.querySelectorAll("button").forEach(shapeEl=>{
			shapeEl.classList.toggle("selected", shapes.has(parseInt(shapeEl.getAttribute("value"))))
		})
	}

	// Обработка событий Shape
	element.querySelectorAll("button").forEach(shapeEl=>{
		shapeEl.addEventListener("click", (e)=>{
			onChanged?.("shape", parseInt(shapeEl.getAttribute("value")))
		})
	})
	return element
}


/**
 *	Создание блока для выбора цвета
 * 
 *	@param {string} label - Лейбл
 *	@param {string} type - Тип
 *	@param {string} renderingType
 *	@param {(type: string, value: string)=>void} onChanged - Функция на изменение значения
 *	@returns {HTMLElement}
 */
function _ColorBlock({ label, type, renderingType, onChanged }){
	const element = createElement("DIV", {
		content: `
			<div class="label">${label}</div>
			<input type="text">
			<div class="color-selector"><ul></ul></div>
		`,
	})
	const input = element.querySelector("input")
	const colorSelector = element.querySelector(".color-selector ul")

	// Обработка событий изменения значения
	input.addEventListener("change", (e)=> onChanged?.(type, e.target.value.trim()))

	// Обновление значений из узлов
	element.updateFromNodes = function(selectedNodes, allNodes){
		// цвета из выбранных узлов
		const colors = {
			selected: new Set(),
			all: new Set([null]),
		}
		for (const node of selectedNodes) colors.selected.add(node[type]??node[renderingType]??null)
		for (const node of allNodes) colors.all.add(node[type]??node[renderingType]??null)

		// обновление значений
		input.value = colors.selected.size !== 1 ? "" : colors.selected.values().next().value
		input.setAttribute("placeholder", colors.selected.size > 1 ? "mixed..." : "#RRGGBBAA" )
		colorSelector.replaceChildren(
			...[...colors.all].map( color => createElement("LI", {
				classList: [ colors.selected.has(color) ? "selected" : null],
				styles: { backgroundColor: color },
				events: {
					click: (e)=> onChanged?.(type, color)
				},
			}))
		)
	}

	return element
}

