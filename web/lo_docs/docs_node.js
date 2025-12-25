import { app } from "../../../scripts/app.js"
import { importCss } from "../.core/utils/dom_utils.js"
import { DocsContentWidget } from "./DocsContentWidget.js"
import { LoNodeComputeSizeOverride } from "../.core/overrides/LoNodeComputeSizeOverride.js"
import { clipboardWrite, clipboardRead } from "../.core/utils/clipboard.js"

importCss("docs_node.css", import.meta)

// Конфиг узла
const NODE_CFG = {
	nodeSize:			[ 200, 100 ],
	nodeType:			'Docs [lo]',
	title:				'Docs [lo]',
	nodeCategory:		'locode/ui',
	nodeDescription:	'Node for creating documentation in markdown format.',
	menu: {
		title: 'Docs [lo]',
		submenu: {
			copyDocs:		'Copy to Clipboard',
			replaceDocs:	'Replace with Clipboard',
			appendDocs:		'Append from Clipboard',
			clearDocs:		'Clear Docs',
		},
	},
}


/**---
 * 
 *	LoDocsNode
 */
export class LoDocsNode extends LGraphNode {

	/**---
	 */
	constructor(){
		super()

		this.title				= NODE_CFG.title
		this.isVirtualNode		= true
		this.resizable			= true
		this.serialize_widgets	= true

		// Кастомный виджет с DIV блоком
		this.docsWidget = new DocsContentWidget(this)

		// Визуальные настройки нода (минимальные)
		this.size = NODE_CFG.nodeSize
	}


	/* MENU & METHODS */

	#copyDocs = async () => {
		await clipboardWrite(JSON.stringify(this.docsWidget.getValue()))
	}


	#replaceDocs = async () => {
		const text = await clipboardRead()
		this.docsWidget.setValue(JSON.parse(text))
	}


	#appendDocs = async () => {
		const text = await clipboardRead()
		const oldData = this.docsWidget.getValue()
		const newData = JSON.parse(text)

		this.docsWidget.setValue({
			articleIndex: oldData.articleIndex,
			articles: [...oldData.articles, ...(newData?.articles??[]) ]
		})
	}


	#clearDocs = () => {
		this.docsWidget.clearValue()
	}


	/**
     *	Дополнительные опции
     */
	 getExtraMenuOptions(canvas, menu){
		// Опции будут наверху
		menu.unshift(
			{
				content:  NODE_CFG.menu.title,
				has_submenu: true,
				submenu: {
					options: [
						{
							content:	NODE_CFG.menu.submenu.copyDocs,
							callback:	()=> this.#copyDocs()
						},{
							content:	NODE_CFG.menu.submenu.replaceDocs,
							callback:	()=> this.#replaceDocs()
						},{
							content:	NODE_CFG.menu.submenu.appendDocs,
							callback:	()=> this.#appendDocs()
						},{
							content:	NODE_CFG.menu.submenu.clearDocs,
							callback:	()=> this.#clearDocs()
						},
				],
				},
			},
			null
		)
	}


	/**
	 * Регистрация нода
	 */
	static setUp() {
        LiteGraph.registerNodeType(NODE_CFG.nodeType, this)
		this.category		= NODE_CFG.nodeCategory
		this.description	= NODE_CFG.nodeDescription

		new LoNodeComputeSizeOverride().override( this.prototype, {
			minWidth:       NODE_CFG.nodeSize[0],
			overrideWidth:  true
		})

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
