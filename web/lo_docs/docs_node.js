import { app } from "../../../scripts/app.js"
import Logger from "../.core/utils/Logger.js"
import { DocsNodeItem } from "./DocsNodeItem.js"
import { createElement } from "../.core/utils/dom_utils.js"


// Конфиг узла
const NODE_CFG = {
	nodeSize:		[ 200, 100 ],
	nodeType:		"Lo:Docs",
	title:			"Docs",
	nodeCategory:	"locode/ui",
	nodeDescription: `Node for creating documentation in markdown format.`,
}


/**---
 * 
 *	LoDocsNode
 */
export class LoDocsNode extends LGraphNode {

	/**---
	 */
	constructor(title = LoDocsNode.title){
		super(title)

		this.isVirtualNode = true
		this.resizable = true

		Logger.debug("constructor", this)

		// Кастомный виджет с документацией
		this.docsWidget = new LoDocsWidget(this, "docs_content")

		// Визуальные настройки нода (минимальные)
		this.size = NODE_CFG.nodeSize

	}


	onDblClick(){
		Logger.debug("onDblClick", this)
	}


	static setUp() {
        LiteGraph.registerNodeType(NODE_CFG.nodeType, this)
		this.category		= NODE_CFG.nodeCategory
		this.description	= NODE_CFG.nodeDescription
    }

}



/**---
 * 
 *	Виджет для отображения/редактирования текущего документа
 *
 */
 class LoDocsWidget {
	
	#element
	#node

	constructor(node, name = "docs_content") {
		this.#node = node
		this.name = name
		this.#createElement()
	}

	/**
	 * Создаем DIV элемент
	 */
	#createElement() {
		// Создаем DIV блок
		this.#element = createElement("div", {
			classList: ["lo-docs-widget"],
			styles: {
				minHeight: "100px",
				padding: "10px",
				backgroundColor: "rgba(0, 0, 0, 0.1)",
				borderRadius: "4px"
			},
			content: "Документация"
		})

		// Добавляем виджет к узлу
		this.#node.addDOMWidget(this.name, "STRING", this.#element, {
			getValue: () => this.getValue(),
			setValue: (value) => this.setValue(value),
		})
	}

	/**
	 * Получаем значение
	 */
	getValue() {
		return this.#element.textContent || ""
	}

	/**
	 * Устанавливаем значение
	 */
	setValue(value) {
		if (this.#element) {
			this.#element.textContent = value || ""
		}
	}

	/**
	 * Получаем элемент для внешнего доступа
	 */
	get element() {
		return this.#element
	}
}



/**---
 * 
 *  registerExtension
 */
app.registerExtension({
	name: "locode.Docs",
	registerCustomNodes(){
		LoDocsNode.setUp()
	},
});
