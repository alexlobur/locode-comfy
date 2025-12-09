import { app } from "../../../scripts/app.js"
import Logger from "../.core/utils/Logger.js"
import { DocsNodeItem } from "./DocsNodeItem.js"
import { importCss } from "../.core/utils/dom_utils.js"
import { DocsContentWidget } from "./DocsContentWidget.js"


importCss("docs_node.css", import.meta)


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
		this.serialize_widgets = true


		Logger.debug("constructor", this)

		// Кастомный виджет с DIV блоком
		this.docsWidget = new DocsContentWidget(this)

		// Добавляем кнопки в заголовок
		// this.addTitleButton({
		// 	text:		"\ue967", 
		// 	fgColor: 	"white",
		// 	bgColor: 	"#0F1F0F",
		// 	name:	 	"pages",
		// 	xOffset:	-10,
		// 	yOffset:	0,
		// 	fontSize:	16,
		// 	padding:	6,
		// 	height:		20,
		// 	cornerRadius: 5,
		// })

		// Визуальные настройки нода (минимальные)
		this.size = NODE_CFG.nodeSize

	}


	/**
	 * Обработчик нажатия на кнопку в заголовке
	 */
	// onTitleButtonClick(button){
	// 	Logger.debug("onTitleButtonClick", button)
	// }


	/**
	 * Регистрация нода
	 */
	static setUp() {
        LiteGraph.registerNodeType(NODE_CFG.nodeType, this)
		this.category		= NODE_CFG.nodeCategory
		this.description	= NODE_CFG.nodeDescription
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
