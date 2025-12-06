import { app } from "../../../../scripts/app.js"
import LoCore from "../../.core/lo_core.js"
import { createElement, importCss } from "../../.core/utils/dom_utils.js"
import { normalizeMenu } from "../../.core/utils/nodes_utils.js"


importCss("node_design.css", import.meta)


/**
 * Singleton класс для работы с дизайном узлов (NodeDesign)
 */
class _NodeDesign {

	#window = null

	get selectedNodes(){
		return Object.values(app.canvas.selected_nodes ?? {})
	}

	get graphNodes(){
		return app.canvas.getCurrentGraph()?._nodes ?? []
	}



	/**
	 * Открыть окно дизайна для текущих узлов
	 * @returns {Promise<void>}
	 */
	openWindow(){
		if (this.#window) return this

		this.#createWindow()
		this.#setEvents()
		this.#setState()
		LoCore.events.on("canvas_selection_changed", this.#setState)
	}


	/**
	 * Закрыть окно дизайна
	 */
	closeWindow(){
		this.#window?.remove()
		this.#window = null
		LoCore.events.off("canvas_selection_changed", this.#setState)
		return this
	}


	/* STATE */

	/**
	 * Обновление значений из выбранных узлов графа
	 */
	#setState = () => {
		const values = this.#getValuesFromNodes()
		console.log(values)
		this.#window.querySelector("input[name='color']").value = values.color??""
		this.#window.querySelector("input[name='bgcolor']").value = values.bgcolor??""
		this.#updateShapesState(values.shape)
		this.#updateColorSelector("color", values.colors)
		this.#updateColorSelector("bgcolor", values.bgColors)
	}


	/**
	 * Обновление состояния значений
	 * @param {number} shapeIndex
	 */
	#updateColorSelector(type="color", colors){
		const nodes = []
		const selector = this.#window.querySelector(`.color-selector[data-type='${type}']`)
		const input = this.#window.querySelector(`input[name='${type}']`)
		for (const color of colors.all){
			nodes.push(
				createElement("LI", {
					classList: [colors.selected.has(color) ? "selected" : null],
					styles: { backgroundColor: color },
					events: {
						click: (e)=>{
							input.value = color
							input.dispatchEvent(new Event("change"))
						},
					},
				})
			)
		}
		selector.querySelector("ul").replaceChildren(...nodes)
	}


	/**
	 * Обновление состояния кнопок Shapes
	 * @param {number} shapeIndex
	 */
	#updateShapesState(shapeIndex){
		this.#window.querySelectorAll(".shapes button[name='shape']").forEach(shapeEl=>{
			shapeEl.classList.toggle("selected", shapeEl.getAttribute("value") == shapeIndex)
		})
	}	


	/**
	 * Создание окна Node Design
	 */
	#createWindow(){
		this.#window = createElement("DIV", {
			classList: ["locode-nodedesign-window"],
			content: `
				<div class="-content">
					<button type="button" class="-close" title="Close">✕</button>
					<div class="header">Lo: Nodes Design</div>
					<div class="colors">
						<div class="color-icon title">
							<input type="text" name="color" title="Title Background Color">
						</div>
						<div class="color-selector" data-type="color">
							<ul><li></li></ul>
						</div>
						<div class="color-icon content">
							<input type="text" name="bgcolor" title="Content Background Color">
						</div>
						<div class="color-selector" data-type="bgcolor">
							<ul><li></li></ul>
						</div>
					</div>
					<div class="shapes">
						<button type="button" name="shape" value="0" title="Default"></button>
						<button type="button" name="shape" value="1" title="Box"></button>
						<button type="button" name="shape" value="2" title="Round"></button>
						<button type="button" name="shape" value="4" title="Card"></button>
					</div>
				</div>
			`,
			parent: document.getElementById("graph-canvas-container"),
		})
	}


	/**
	 * Получение значений из выбранных узлов графа
	 */
	#getValuesFromNodes(){

		const colors = { all: new Set([null]), selected: new Set() }
		const bgColors = { all: new Set([null]), selected: new Set() }
		const shapes = new Set()

		// цвета и формы из выбранных узлов
		for (const node of this.selectedNodes){
			if (node.color) colors.selected.add(node.color)
			if (node.bgcolor) bgColors.selected.add(node.bgcolor)
			shapes.add(node.shape??0) // 0 - default
		}

		// цвета из всех узлов
		for (const node of this.graphNodes){
			if (node.color) colors.all.add(node.color)
			if (node.bgcolor) bgColors.all.add(node.bgcolor)
		}

		return {
			color:	  colors.selected.size	  !== 1 ? undefined : colors.selected.values().next().value,
			bgcolor:  bgColors.selected.size  !== 1 ? undefined : bgColors.selected.values().next().value,
			shape:	  shapes.size			  !== 1 ? undefined : shapes.values().next().value,
			colors:	  colors,
			bgColors: bgColors,
			shapes:   shapes,
		}
	}


	/**
	 * Установка событий для окна Node Design
	 */
	#setEvents(){
		// Закрытие окна
		this.#window.querySelector("button.-close")?.addEventListener("click", ()=>{
			this.closeWindow()
		})

		const setColor = (type, color)=>{
			color = color.trim()
			for (const node of this.selectedNodes) {
				node[type] = color || null
				node.setDirtyCanvas(true, true)
			}
			this.#setState()
		}

		// Обработка событий color
		this.#window.querySelector("input[name='color']").addEventListener("change", (e)=>{
			setColor("color", e.target.value)
		})

		// Обработка событий bgcolor
		this.#window.querySelector("input[name='bgcolor']").addEventListener("change", (e)=>{
			setColor("bgcolor", e.target.value)
		})


		// Обработка событий Shape
		this.#window.querySelectorAll("button[name='shape']").forEach(shapeEl=>{
			shapeEl.addEventListener("click", (e)=>{
				this.#updateShapesState(shapeEl.getAttribute("value"))
				for (const node of this.selectedNodes) {
					node.shape = parseInt(shapeEl.getAttribute("value"))
					node.setDirtyCanvas(true, true)
				}
				this.#setState()
			})
		})
	}


	/**
	 * Добавляет пункт меню "Nodes Design" в меню
	 * @param {IContextMenuValue[]} menu - Меню
	 */
	addToMenu(menu){
		// Находим индекс для вставки после заголовка или после последнего разделителя (null) или в начало
		let insertIndex = menu.findLastIndex((o) => o?.content?.includes("Title")) - 1
		if (insertIndex == -1) insertIndex = menu.findLastIndex((o) => o==null) + 1
		insertIndex = insertIndex || 0

		// Добавляем разделитель и пункты меню
		menu.splice(insertIndex, 0, 
			null,
			{
				content: "Lo: Nodes Design",
				callback: () => NodeDesign.openWindow()
			},
			null
		)
		normalizeMenu(menu)
	}

}

const NodeDesign = new _NodeDesign()
export default NodeDesign