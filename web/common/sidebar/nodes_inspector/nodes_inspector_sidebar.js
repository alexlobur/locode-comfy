import LoCore from "../../../.core/lo_core.js"
import Logger from "../../../.core/utils/Logger.js"
import {createElement, importCss} from "../../../.core/utils/dom_utils.js"
import {SidebarComponents} from "../components/sidebar_components.js"
import {LoGraphUtils} from "../../../.core/utils/lo_graph_utils.js"

importCss("nodes_inspector_sidebar.css", import.meta)


/**
 * Singleton класс для работы с инспектором узлов (NodesInspector)
 */
export default class NodesInspectorSidebar {

	#element = null
	get element(){
		return this.#element
	}

	#topBar = null


	/**
	 * Конструктор
	 */
	constructor(parentElement=null){
		this.#createElement(parentElement)
		this.#setState()

		// подписка на события
        LoCore.events.on("graph_load",                this.#eventHandler)
        LoCore.events.on("graph_node_added",          this.#eventHandler)
        LoCore.events.on("graph_node_removed",  	  this.#eventHandler)
        LoCore.events.on("canvas_selection_changed",  this.#eventHandler)
	}


	#eventHandler = (event, data) => {
		// задержка для того, чтобы обновиться после всех изменений графа
		setTimeout(() => {
			this.#setState()
		}, 10)
	}


	/* STATE */

	/**
	 * Обновление значений
	 */
	#setState = () => {
        // получение данных нодов
        const data = this.#getNodesData()

		// обновление узлов
		this.#refreshNodesList(data.nodes)

		// обновление сводной информации
		this.#refreshInfo(data.total, data.deprecated, data.hasErrors)
	}


	/**
	 *	
	 */
	#toggleCollapse = (collapsed=null) => {
		this.#element.classList.toggle("collapsed", collapsed !== null ? collapsed : !this.#element.classList.contains("collapsed"))
		LoCore.settings.sidebarNodesInspectorCollapsed = this.#element.classList.contains("collapsed")
		this.#setState()
	}


	/**
	 * Создание окна Group Design
	 */
	#createElement(parentElement){

		// создание верхней панели
		this.#topBar = SidebarComponents.TopBar({
			header: "Nodes Inspector",
			info: ``,
			onCollapsePressed: () => this.#toggleCollapse()
		})

		// создание основного элемента
		this.#element = createElement("DIV", {
			classList: ["-section", "locode-nodes-inspector"],
			content: [
				this.#topBar,
				createElement("DIV", {
					classList: ["--content"],
					content: `
						<div class="nodes-list"></div>
					`
				}),
			],
			parent: parentElement,
		})

		// установка состояния свернутости
		this.#toggleCollapse(LoCore.settings.sidebarNodesInspectorCollapsed)
	}


	/**
	 *	Сводная информация
	 */
    #refreshInfo(total, deprecated, hasErrors){
		this.#topBar.setInfo(`
			<span>deprecated: ${deprecated},</span>
			<span>errors: ${hasErrors},</span>
			<span>total: ${total}</span>
		`)
	}


	/**
	 *	Обновление списка узлов
	 *	@returns
	 */
    #refreshNodesList(nodesData){

		// список узлов
		const items = []
		for (const nodeData of nodesData){
			const rowItems = [
				createElement("div", {
					classList: ["id"],
					content: nodeData.ids.map( id => createElement("span", {
						content: id,
						events: {
							"click": (e)=>this.#gotoNode(id)
						}
					}))
				}),
				createElement("div", {
					classList: ["type", nodeData.deprecated ? "deprecated" : "", nodeData.hasErrors ? "error" : ""],
					content: nodeData.node.title || nodeData.node.type,
					events: {
						"click": (e)=>this.#gotoNode(nodeData.node.id)
					},
					attributes: {
						"title": nodeData.node.type + (nodeData.deprecated ? " (deprecated)" : "") + (nodeData.hasErrors ? " (error)" : "")
					}
				})
			]
			items.push(...rowItems)
        }

		// обновление списка узлов
		this.#element.querySelector(".nodes-list").replaceChildren(...items)
    }


	/**
	 *	Переход к Узлу
	 */
	#gotoNode(nodeId){
		const node = LoGraphUtils.findNodeById(nodeId)
		LoGraphUtils.gotoNode(node)
		Logger.debug(node, nodeId)
	}


	/**
	 *	Получение данных узлов
	 */
	#getNodesData(){
		const result = {
			nodes: [],
			total: 0,
			deprecated: 0,
			hasErrors: 0
		}

		LoGraphUtils.foreachNodes(null, (node, parentNodeIds)=>{

			const error = node.has_errors
			const deprecated = LoCore.DEPRECATED_TYPES.has(node.type)

			result.nodes.push({
				node: node,
				ids: [...parentNodeIds, node.id],
				deprecated: deprecated,
				hasErrors: error
			})
			result.total++
			result.deprecated += deprecated ? 1 : 0
			result.hasErrors += error ? 1 : 0
		})
		return result
	}

}
