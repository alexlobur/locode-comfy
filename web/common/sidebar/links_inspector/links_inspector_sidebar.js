import LoCore from "../../../.core/lo_core.js"
import Logger from "../../../.core/utils/Logger.js"
import {createElement, importCss} from "../../../.core/utils/dom_utils.js"
import {SidebarComponents} from "../components/sidebar_components.js"
import {LoGraphUtils} from "../../../.core/utils/lo_graph_utils.js"

importCss("links_inspector_sidebar.css", import.meta)

/**
 * Singleton класс для работы с инспектором ссылок (LinksInspector)
 */
export default class LinksInspectorSidebar {

	#element = null
	#topBar = null
	get element(){
		return this.#element
	}


	/**
	 * Конструктор
	 */
	constructor(parentElement=null){
		this.#createElement(parentElement)
		this.#setState()

		// События графа
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
		// получение данных ссылок
        const data = this.#getLinksData()

		// обновление списка ссылок
		this.#refreshLinksList(this.#element.querySelector("#broken-links"))

		// обновление сводной информации
		this.#refreshInfo(data.total)
	}


	/**
	 *	
	 */
	#toggleCollapse = (collapsed=null) => {
		this.#element.classList.toggle("collapsed", collapsed !== null ? collapsed : !this.#element.classList.contains("collapsed"))
		LoCore.settings.sidebarLinksInspectorCollapsed = this.#element.classList.contains("collapsed")
		this.#setState()
	}


	/**
	 * Создание элемента блока
	 */
	#createElement(parentElement){

		// создание верхней панели
		this.#topBar = SidebarComponents.TopBar({
			header: "Links Inspector",
			info: ``,
			onCollapsePressed: () => this.#toggleCollapse()
		})

		// создание основного элемента
		this.#element = createElement("DIV", {
			classList: ["-section", "locode-links-inspector"],
			content: [
				this.#topBar,
				createElement("DIV", {
					classList: ["--content"],
					content: `
						<div class="links-list"></div>
					`
				}),
			],
			parent: parentElement,
		})

		// установка состояния свернутости
		this.#toggleCollapse(LoCore.settings.sidebarLinksInspectorCollapsed)
	}


	/**
	 *	Сводная информация
	 */
    #refreshInfo(total){
		this.#topBar.setInfo(`<span>total: ${total}</span>`)
	}


	/**
	 *	Обновление списка ссылок
	 *	@returns
	 */
	 #refreshLinksList(){
		const linksData = LoGraphUtils.foreachLinks()

		// список ссылок
		const items = []
		for (const linkData of linksData){
			const rowItems = [
				createElement("div", {
					classList: ['origin'],
					content: `${linkData.origin_id}.${linkData.origin_slot}`,
					events: {
						click: (e)=>this.#gotoNode(linkData.origin_id)
					},
					attributes: {
						"title": `Node: #${linkData.origin_id}, Slot: ${linkData.origin_slot}`
					}
				}),
				createElement("div", { classList: ['type'], content: linkData.type }),
				createElement("div", {
					classList: ['target'],
					content: `${linkData.target_id}.${linkData.target_slot}`,
					events: {
						click: (e)=>this.#gotoNode(linkData.target_id)
					},
					attributes: {
						"title": `Node: #${linkData.target_id}, Slot: ${linkData.target_slot}`
					}
				}),
			]
			items.push(...rowItems)
        }

		// обновление списка ссылок
		this.#element.querySelector(".links-list").replaceChildren(...items)
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
	 *	Получение данных ссылок
	 */
	#getLinksData(){
		const result = {
			links: [],
			total: 0
		}
		result.links = LoGraphUtils.foreachLinks()
		result.total = result.links.length
		return result
	}

}
