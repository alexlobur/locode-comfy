import LoCore from "../../../.core/lo_core.js"
import Logger from "../../../.core/utils/Logger.js"
import {createElement, importCss} from "../../../.core/utils/dom_utils.js"
import {SidebarComponents} from "../components/sidebar_components.js"
import {findNodeById, foreachLinks, gotoNode} from "../../../.core/utils/nodes_utils.js"

importCss("links_inspector_sidebar.css", import.meta)

/**
 * Singleton класс для работы с инспектором ссылок (LinksInspector)
 */
export default class LinksInspectorSidebar {

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
		this.#refreshInfo(data.allLinks.length, data.brokenLinks.length)
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

		this.#element = createElement("DIV", {
			classList: ["-section", "locode-links-inspector"],
			content: [
				// topbar
				createElement("DIV", {
					classList: ["--topbar"],
					content: [
						SidebarComponents.Header({ title: "Links Inspector", onCollapsePressed: () => this.#toggleCollapse() }),
						'<div class="info"></div>',
					]
				}),
				// content
				createElement("DIV", {
					classList: ["--content"],
					content: `
						<div id="broken-links"></div>
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
    #refreshInfo(total, broken){
		this.#element.querySelector(".info")
			.innerHTML = `broken: ${broken}, total: ${total}`
	}


	/**
	 *	Обновление списка ссылок
	 *	@returns
	 */
	 #refreshLinksList(parentElement){

		const linksData = foreachLinks()

		// список ссылок
		const items = []
		for (const linkData of linksData){
			const rowItems = [
				createElement("div", { content: `#${linkData.origin_id} [${linkData.origin_slot}] &nbsp;&rarr; ` }),
				createElement("div", { content: `${linkData.type}` }),
				createElement("div", { content: ` &rarr;&nbsp; #${linkData.target_id} [${linkData.target_slot}]` }),
			]
			items.push(...rowItems)
        }

		// общий контейнер
		parentElement.replaceChildren(
			createElement("div", {
				classList: ['label'],
				content: "Broken links: " + linksData.length
			}),
			createElement("div", {
				classList: ['links-list'],
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
	 *	Получение данных ссылок
	 */
	#getLinksData(){
		const result = {
			allLinks: [],
			brokenLinks: [],
		}
		result.allLinks = foreachLinks((link)=>{
			if(link.broken){
				result.brokenLinks.push(link)
			}
		})
		return result
	}

}
