import { app } from "../../../../scripts/app.js"
import LoCore from "../../.core/lo_core.js"
import Logger from "../../.core/utils/Logger.js"
import { createElement, importCss } from "../../.core/utils/dom_utils.js"
import { foreachGroups } from "../../.core/utils/nodes_utils.js"


importCss("group_design_sidebar.css", import.meta)


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
 * Singleton класс для работы с дизайном групп (GroupDesign)
 */
export default class GroupDesignSidebar {

	#element = null
	get element(){
		return this.#element
	}
	#widgets = []

	get selectedGroups(){
		return this.groups.filter(group => group.selected)
	}

	get groups(){
		return app.canvas.graph._groups
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
		// задержка для того, чтобы обновиться после всех изменений графа
		setTimeout(() => {
			Logger.debug("eventHandler", this.selectedGroups)
			this.#setState()
		}, 10)
	}


	/* STATE */

	/**
	 * Обновление значений из выбранных групп графа
	 */
	#setState = () => {
		const selected = this.selectedGroups
		const groups = this.groups

		// Обновление информации о выбранных группах
		this.#element.querySelector(".info").textContent = `selected: ${selected.length} / total: ${groups.length}`

		// Обновление значений из групп
		// this.#widgets.forEach(widget=> widget.updateFromGroups(groups, allGroups))
	}


	/**
	 * Создание окна Node Design
	 */
	#createElement(parentElement){

		this.#element = createElement("DIV", {
			classList: ["locode-sidebar-groups"],
			content: [
				'<div class="header">Groups Design</div>',
				'<div class="info">selected: 0 / total: 0</div>',
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
