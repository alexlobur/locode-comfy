import { app } from "../../../../scripts/app.js"
import LoCore from "../../.core/lo_core.js"
import Logger from "../../.core/utils/Logger.js"
import { createElement, importCss } from "../../.core/utils/dom_utils.js"

importCss("subgraph_modal.css", import.meta)


/**
 *	Окно для редактирования сабграфов
 */
export default class SubgraphModal {

	#element = null
	get element(){
		return this.#element
	}

	#node = null

	constructor(node){
		this.#node = node
		this.#createElement()
	}


	/**
	 * Создание окна Subgraph Modal
	 */
	#createElement(){
		this.#element = createElement( "DIALOG", {
			classList: ["locode-subgraph-modal"],
			parent: document.body,
			content: [
				`
					<div class="title">${this.#node.title}</div>
					<div class="close"><button>×</button></div>
				`,
				_InputsBlock(this.#node),
			],
			attributes: {
				// closedby: "any",
			},
			events: {
				close: () => {
					this.close()
				},
				open: () => {
					Logger.debug("open", this)
				},
			},
		})
	}


	close(){
		Logger.debug("close", this)
		this.#element.remove()
		return this
	}


	static show(node){
		Logger.debug("show", node, node.inputs, node.outputs, node.widgets)
		const modal = new SubgraphModal(node)
		modal.element.show()
		return modal
	}

}



/**
 *	Создание блока INPUTS
 * 
 *	@returns {HTMLElement}
 */
 function _InputsBlock(node){

	// Создание блока INPUTS
	const element = createElement("DIV", {
		classList: ["inputs"],
		content: `
			<table>
				<caption>Inputs</caption>
				<thead>
					<tr><th></th><th>Name</th><th>Type</th><th>Widget</th></tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		`,
	})
	element._node = node

	/**
	 * Создание строки ввода
	 * @param {Object} input - Входной параметр
	 * @returns {HTMLElement}
	 */
	const createInputRow = (input) => {
		const row = createElement("TR", {
			content: `
				<td class="actions"><button>↑</button><button>↓</button></td>
				<td class="name">${input.name}</td>
				<td class="type">${input.type}</td>
				<td class="widget">${input.widget?.name??"—"}</td>
			`,
		})
		row.querySelector("button:first-child").addEventListener("click", () => changeIndex(input, -1))
		row.querySelector("button:last-child").addEventListener("click", () => changeIndex(input, 1))
		return row
	}

	/**
	 * Изменение индекса входного параметра
	 * @param {Object} input - Входной параметр
	 * @param {number} delta - Изменение индекса
	 */
	const changeIndex = (input, delta) => {
		const inputs = element._node.inputs
		const currentIndex = inputs.indexOf(input)
		
		if (currentIndex === -1) return
		
		const newIndex = currentIndex + delta
		
		// Проверка границ массива
		if (newIndex < 0 || newIndex >= inputs.length) return
		
		// Перемещение элемента в массиве
		inputs.splice(currentIndex, 1)
		inputs.splice(newIndex, 0, input)
		
		// Обновление UI
		element.setState()
	}

	/**
	 * Установка состояния блока INPUTS
	 */
	element.setState = () => {
		element.querySelector("tbody").replaceChildren(...element._node.inputs.map(createInputRow))
	}

	// Установка начального состояния
	element.setState()

	return element

}

