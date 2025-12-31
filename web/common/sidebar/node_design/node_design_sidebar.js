import {app} from "../../../../../scripts/app.js"
import LoCore from "../../../.core/lo_core.js"
import Logger from "../../../.core/utils/Logger.js"
import {createElement} from "../../../.core/utils/dom_utils.js"
import {SidebarComponents} from "../components/sidebar_components.js"


/**
 * Singleton класс для работы с дизайном узлов (NodeDesign)
 */
export default class NodeDesignSidebar {

	#element = null
	get element(){
		return this.#element
	}

	#topBar = null

	#widgets = []

	get selectedNodes(){
		return Object.values(app.canvas.selected_nodes ?? {})
	}

	get graphNodes(){
		return app.canvas.graph._nodes
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
			Logger.debug("nodes_design", this.selectedNodes)
			this.#setState()
		}, 10)
	}


	/* STATE */

	/**
	 * Обновление значений из выбранных узлов графа
	 */
	#setState = () => {
		const nodes = this.selectedNodes
		const allNodes = this.graphNodes

		// Обновление информации о выбранных узлах
		this.#refreshInfo(allNodes.length, nodes.length)

		// Обновление значений из узлов
		this.#widgets.forEach(widget=> widget.updateFromItems(nodes, allNodes))
	}


	/**
	 *	Обработка изменений в узлах

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


	#toggleCollapse = (collapsed=null) => {
		this.#element.classList.toggle("collapsed", collapsed !== null ? collapsed : !this.#element.classList.contains("collapsed"))
		LoCore.settings.sidebarNodeDesignCollapsed = this.#element.classList.contains("collapsed")
		this.#setState()
	}


	/**
	 *	Сводная информация
	 */
	 #refreshInfo(total, selected){
		this.#topBar.setInfo(`<span>selected: ${selected},</span><span>total: ${total}</span>`)
	}


	/**
	 * Создание окна Node Design
	 */
	#createElement(parentElement){
		this.#widgets = [
			SidebarComponents.Input({ label: "Title", type: "title", title: "Nodes Title", onChanged: this.#haddleChanges }),
			SidebarComponents.Color({ label: "Box Color", type: "boxcolor", renderingType: "renderingBoxColor", onChanged: this.#haddleChanges }),
			SidebarComponents.Color({ label: "Title Background", type: "color", renderingType: "renderingColor", onChanged: this.#haddleChanges }),
			SidebarComponents.Color({ label: "Content Background", type: "bgcolor", renderingType: "renderingBgColor", onChanged: this.#haddleChanges }),
			SidebarComponents.Shapes({ onChanged: this.#haddleChanges }),
			SidebarComponents.Offset({ label: "Size: ", type: "size", xTitle: "width", yTitle: "height", onChanged: this.#haddleChanges }),
			SidebarComponents.Offset({ label: "Pos: ", type: "pos", onChanged: this.#haddleChanges }),
			SidebarComponents.Modes({ onChanged: this.#haddleChanges }),
			SidebarComponents.Options({ onChanged: this.#haddleChanges }),
		]

		// создание верхней панели
		this.#topBar = SidebarComponents.TopBar({
			header: "Nodes Design",
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
		this.#toggleCollapse(LoCore.settings.sidebarNodeDesignCollapsed)

	}

}

