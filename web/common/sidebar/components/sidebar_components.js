import { createElement } from "../../../.core/utils/dom_utils.js"


/**
 * Компоненты для sidebar
 */
const _SidebarComponents = {

	/**
	 *	Формы
	 */
	SHAPES: [
		{ value: 0, title: "Round" },
		{ value: 1, title: "Box" },
		{ value: 4, title: "Card" },
	],

	/**
	 *	Режимы
	 */
	MODES: [
		{ value: 0, label: "A", title: "Active" },
		{ value: 2, label: "M", title: "Muted" },
		{ value: 4, label: "B", title: "Bypassed" },
	],

	/**
	 *	Опции узлов
	 */
	NODE_OPTIONS: {
		pinned:		{ title: "Pinned",		default: false },
		removable:	{ title: "Removable",	default: true },
		resizable:	{ title: "Resizable",	default: true },
		collapsed:	{ title: "Collapsed",	default: false },
		has_errors:	{ title: "Has Errors",	default: false },
	},

	/**
	 *	Опции групп
	 */
	GROUP_OPTIONS: {
		pinned:		{ title: "Pinned",		default: false },
	},


	/**
	 *	Заголовок
	 */
	Header: _HeaderBlock,

	/**
     * Блок для выбора цвета
     */
    Color: _ColorBlock,

	/**
	 * Блок для выбора текста
	 */
	Input: _InputBlock,

	/**
     * Блок для выбора размера/положения
     */
    Offset: _OffsetBlock,

    /**
     * Блок для выбора формы
     */
    Shapes: _ShapesBlock,

    /**
     * Блок для выбора режимов работы узлов
     */
    Modes: _ModesBlock,

    /**
     * Блок для выбора опций
     */
    Options: _OptionsBlock,

}
export const SidebarComponents = Object.freeze(_SidebarComponents)



/*************************************************************************************************************
 * PRIVATE FUNCTIONS
*/


/**
 *	Создание блока для текста
 *
 *	@param {()=>void} onCollapsePressed - Колбэк для переключения свернутости
 *	@returns {HTMLElement}
 */
 function _HeaderBlock({ title, onCollapsePressed }){
	const element = createElement("DIV", {
		classList: [ "header" ],
		content: title,
		events: {
			click: (e)=>onCollapsePressed?.()
		}
	})
	return element
}


/**
 *	Создание блока для текста
 *
 *	@param {(type: string, value: string)=>void} onChanged - Колбэк при изменении значения
 *	@returns {HTMLElement}
 */
 function _InputBlock({ label, type, title="text", attributes={ type: "text" }, inRow = false, className="input-block", onChanged }){

	// Создание элемента ввода
	const input = createElement("INPUT", {
		attributes: {
			name:	type,
			title:	title,
			...attributes,
		},
		events: {
			change: (e)=>onChanged?.( type, input.value.trim() )
		}
	})

	// Создание элемента
	const element = createElement("DIV", {
		classList: [ className, inRow ? "in-row" : null ],
		content: [
			`<div class="label">${label}</div>`,
			input,
		]
	})

	// Обновление значений из узлов
	element.updateFromItems = function(items){
		const values = new Set()
		for (const item of items){
			values.add(item[type])
		}
		// обновление значений и placeholder
		input.value = values.size !== 1 ? "" : values.values().next().value
		input.setAttribute("placeholder", values.size > 1 ? "mixed..." : title )
	}
	return element
}


/**
 *	Создание блока для выбора формы
 * 
 *	@param {(type: string, value: string)=>void} onChanged - Функция на изменение значения
 *	@returns {HTMLElement}
 */
 function _ShapesBlock({ onChanged, className="shapes-block" }){

	// Создание элемента
	const element = createElement("DIV", {
		classList: [ className ],
		content: SidebarComponents.SHAPES.map( shape =>
			createElement("BUTTON", {
				attributes: { value: shape.value, title: shape.title },
				events: {
					click: (e)=>onChanged?.("shape", shape.value)
				}
			})
		)
	})

	element.updateFromItems = function(items){
		const shapes = new Set()
		for (const item of items){
			const value = SidebarComponents.SHAPES.find(shape=>shape.value === item.shape)?.value ?? 0
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
 *	Создание блока для выбора размера/положения
 *
 *	@param {(type: string, value: string)=>void} onChanged - Колбэк при изменении значения
 *	@returns {HTMLElement}
 */
 function _OffsetBlock({ label, type, xTitle="x", yTitle="y", min=10, className="nodes-offset", onChanged }){
	// Создание элемента
	const element = createElement("DIV", {
		classList: [ className ],
		content: `
			<div class="label">${label}</div>
			<input type="number" min="${min}" name="x" title="${xTitle}">
			<input type="number" min="${min}" name="y" title="${yTitle}">
		`,
	})
	const xInput = element.querySelector("input[name='x']")
	const yInput = element.querySelector("input[name='y']")

	// Обработка событий изменения значения
	xInput.addEventListener("change", (e)=>onChanged?.( type, [ xInput.value, null ] ))
	yInput.addEventListener("change", (e)=>onChanged?.( type, [ null, yInput.value ] ))

	// Обновление значений из узлов
	element.updateFromItems = function(items){
		const offsets = { x: new Set(), y: new Set() }
		for (const item of items){
			offsets.x.add(parseInt(item[type][0]))
			offsets.y.add(parseInt(item[type][1]))
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
 *	Создание блока для выбора цвета
 * 
 *	@param {string} label - Лейбл
 *	@param {string} type - Тип
 *	@param {string} renderingType
 *	@param {(type: string, value: string)=>void} onChanged - Функция на изменение значения
 *	@returns {HTMLElement}
 */
 function _ColorBlock({ label, type, renderingType, className="color-block", onChanged }){
	const element = createElement("DIV", {
        classList: [ className ],
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

	// Обновление значений из узлов/групп
	element.updateFromItems = function(selectedItems, allItems){
		// цвета из выбранных узлов
		const colors = {
			selected: new Set(),
			all: new Set([null]),
		}
		for (const item of selectedItems) colors.selected.add(item[type]??item[renderingType]??null)
		for (const item of allItems) colors.all.add(item[type]??item[renderingType]??null)

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


/**
 *	Создание блока для выбора режимов работы узлов/групп
 * 
 *	@param {(type: string, value: string)=>void} onChanged - Функция на изменение значения
 *	@returns {HTMLElement}
 */
 function _ModesBlock({ onChanged, className="modes-block" }){

	// Создание элемента
	const element = createElement("DIV", {
		classList: [ className ],
		content: [
			...SidebarComponents.MODES.map( mode =>
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

	element.updateFromItems = function(items){
		const modes = new Set()
		for (const item of items) modes.add(item.mode??0)
		this.querySelectorAll("button").forEach(modeEl=>{
			modeEl.classList.toggle("selected", modes.has( parseInt(modeEl.getAttribute("value")) ))
		})
	}

	return element
}


/**
 *	Создание блока для выбора опций
 *
 *	@param {(type: string, value: string)=>void} onChanged - Функция на изменение значения
 *	@returns {HTMLElement}
 */
function _OptionsBlock({ onChanged, className="options-block", isGroup=false }){
	// Создание блоков для опций
	const options = Object.entries(SidebarComponents[ isGroup ? "GROUP_OPTIONS" : "NODE_OPTIONS" ])
		.map( ([key, data])=>{
			return _OptionBlock({
				name:			key,
				title:			data.title,
				defaultValue:	data.default,
				onChanged: 		onChanged
			})
		})

	// Создание элемента
	const element = createElement("DIV", { classList: [ className ], content: options })

	// Обновление значений из узлов
	element.updateFromItems = function(items){
		for (const option of options) option.updateFromItems(items)
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

	// Обновление значений из узлов/групп
	element.updateFromItems = function(items){
		const values = new Set()
		for (const item of items) values.add(item[name]??defaultValue)
		this._optionValue = values.size !== 1 ? null : values.values().next().value
		this.setAttribute("value", this._optionValue )
	}
	return element
}

