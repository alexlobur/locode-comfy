import { app } from "../../../../../scripts/app.js"
import LoCore from "../../../.core/lo_core.js"
import Logger from "../../../.core/utils/Logger.js"
import {createElement, importCss} from "../../../.core/utils/dom_utils.js"
import {SidebarComponents} from "../components/sidebar_components.js"
import {findNodeById, foreachNodes, gotoNode} from "../../../.core/utils/nodes_utils.js"

importCss("nodes_inspector_sidebar.css", import.meta)

/**
 * Singleton класс для работы с инспектором узлов (NodesInspector)
 */
export default class NodesInspectorSidebar {

	#element = null
	get element(){
		return this.#element
	}


	/**
	 * Конструктор
	 */
	constructor(parentElement=null){
		this.#createElement(parentElement)
		this.#setState()

        // Обновление баннера устаревших нодов
        LoCore.events.on("graph_load",          this.#eventHandler)
        LoCore.events.on("graph_node_added",    this.#eventHandler)
        LoCore.events.on("graph_node_removed",  this.#eventHandler)
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
        // получение данных нодов
        const data = this.#getNodesData()

		// обновление устеревших узлов
		this.#refreshNodesList(data.deprecated, this.#element.querySelector("#deprecated-nodes"), "Deprecated nodes: " + data.deprecated.length)

		// обновление узлов с ошибками
		this.#refreshNodesList(data.hasErrors, this.#element.querySelector("#error-nodes"), "Nodes with errors: " + data.hasErrors.length)

		// обновление сводной информации
		this.#refreshInfo(data.deprecated.length, data.hasErrors.length)
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

		this.#element = createElement("DIV", {
			classList: ["-section", "locode-nodes-inspector"],
			content: [
				// topbar
				createElement("DIV", {
					classList: ["--topbar"],
					content: [
						SidebarComponents.Header({ title: "Nodes Inspector", onCollapsePressed: () => this.#toggleCollapse() }),
						'<div class="info"></div>',
					]
				}),
				// content
				createElement("DIV", {
					classList: ["--content"],
					content: `
						<div id="deprecated-nodes"></div>
						<div id="error-nodes"></div>
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
    #refreshInfo(deprecated, hasErrors){
		this.#element.querySelector(".info")
			.innerHTML = `deprecated: ${deprecated}, errors: ${hasErrors}`
	}


	/**
	 *	Обновление списка узлов
	 *	@returns
	 */
    #refreshNodesList(nodesData, parentElement, title){

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
					classList: ["type"],
					content: nodeData.node.type,
					events: {
						"click": (e)=>this.#gotoNode(nodeData.node.id)
					}
				})
			]
			items.push(...rowItems)
        }

		// общий контейнер
		parentElement.replaceChildren(
			createElement("div", {
				classList: ['label'],
				content: title
			}),
			createElement("div", {
				classList: ['nodes-list'],
				content: items
			})
		)
    }


	/**
	 *	Переход к Узлу
	 */
	#gotoNode(nodeId){
		const node = findNodeById(nodeId)
		gotoNode(node)
		Logger.debug(node, nodeId)
	}


	/**
	 *	Получение данных устаревших и узлов с ошибками
	 */
	#getNodesData(){
		const result = {
			total: 0,
			deprecated: [],
			hasErrors: []
		}

		foreachNodes(app.graph.nodes, (node, parentNodeIds)=>{
			// устаревший узел
			if(LoCore.DEPRECATED_TYPES.has(node.type)){
				result.deprecated.push({ node: node, ids: [...parentNodeIds, node.id] })
			}
			// узлы с ошибками
			if(node.has_errors){
				result.hasErrors.push({ node: node, ids: [...parentNodeIds, node.id] })
			}
		})
		return result
	}

}
