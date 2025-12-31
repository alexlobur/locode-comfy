import {app} from "../../../../../scripts/app.js"
import LoCore from "../../../.core/lo_core.js"
import Logger from "../../../.core/utils/Logger.js"
import {createElement} from "../../../.core/utils/dom_utils.js"
import {SidebarComponents} from "../components/sidebar_components.js"


/**
 * Singleton класс для работы с дизайном групп (GroupDesign)
 */
export default class GroupDesignSidebar {

	#element = null
	get element(){
		return this.#element
	}
	#widgets = []

	#topBar = null

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

		// Обновление информации о выбранных узлах
		this.#refreshInfo(groups.length, selected.length)

		// Обновление значений из групп
		this.#widgets.forEach(widget=> widget.updateFromItems(selected, groups))
	}


	/**
	 *	Обработка изменений в группах

	 *	@param {string} type - Тип
	 *	@param {string} value - Значение
	 */
	 #haddleChanges = (type, value) => {
		for (const group of this.selectedGroups){
			switch (type) {
				case "pinned":
					if(group["pinned"] !== value) group.pin()
					break;
				case "collapsed":
					if(group["collapsed"] !== value) group.collapse()
					break;
				case "size":
					group.resize(value[0] ?? group.size[0], value[1] ?? group.size[1])
					break;
				case "pos":
					group.pos = [ value[0] ?? group.pos[0], value[1] ?? group.pos[1] ]
					break;
				case "font_size":
					group[type] = Number(value)
					break;
				default:
					group[type] = value
			}
			group.setDirtyCanvas(true, true)
		}
		this.#setState()
	}


	#toggleCollapse = (collapsed=null) => {
		this.#element.classList.toggle("collapsed", collapsed !== null ? collapsed : !this.#element.classList.contains("collapsed"))
		LoCore.settings.sidebarGroupDesignCollapsed = this.#element.classList.contains("collapsed")
		this.#setState()
	}


	/**
	 *	Сводная информация
	 */
	 #refreshInfo(total, selected){
		this.#topBar.setInfo(`<span>selected: ${selected},</span><span>total: ${total}</span>`)
	}


	/**
	 * Создание окна Group Design
	 */
	#createElement(parentElement){

		this.#widgets = [
			SidebarComponents.Input({ label: "Title", type: "title", title: "Group Title", onChanged: this.#haddleChanges }),
			SidebarComponents.Input({
				label: "Font Size: ", type: "font_size", title: "Title Font Size",
				attributes: { type: "number", min: 0, step: 1 },
				inRow: true,
				onChanged: this.#haddleChanges
			}),
			SidebarComponents.Color({ label: "Color", type: "color", renderingType: "color", onChanged: this.#haddleChanges }),
			SidebarComponents.Offset({ label: "Size: ", type: "size", xTitle: "width", yTitle: "height", onChanged: this.#haddleChanges }),
			SidebarComponents.Offset({ label: "Pos: ", type: "pos", onChanged: this.#haddleChanges }),
			SidebarComponents.Options({ onChanged: this.#haddleChanges, isGroup: true }),
		]

		// создание верхней панели
		this.#topBar = SidebarComponents.TopBar({
			header: "Groups Design",
			info: ``,
			onCollapsePressed: () => this.#toggleCollapse()
		})

		// создание основного элемента
		this.#element = createElement("DIV", {
			classList: ["-section"],
			content: [
				this.#topBar,
				createElement("DIV", {
					classList: ["--content"],
					content: this.#widgets
				}),
			],
			parent: parentElement,
		})

		// установка состояния свернутости
		this.#toggleCollapse(LoCore.settings.sidebarGroupDesignCollapsed)
	}

}

