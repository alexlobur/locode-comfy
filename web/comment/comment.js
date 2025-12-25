import { app } from "../../../scripts/app.js"
import { wrapCanvasText } from "../.core/utils/dom_utils.js"
import { TextData } from "../.core/entity/TextData.js"
import { openCommentModal } from "./comment_modal.js"
import { CommentData } from "./CommentData.js"


// Конфиг узла
const NODE_CFG = {
	nodeMinSize:	[ 30, 30 ],
	nodeType:		"Lo:Comment",
	title: 			"Lo:Comment",
	commentDataDefault: new CommentData({
        header:			new TextData({ value: "Comment", color: '#FFFFFF66', font: '600 14px Arial, sans-serif' }),
        text:			new TextData({ value: 'Double click to Edit...', color: '#FFFFFF66', font: '400 10px Arial, sans-serif' }),
		padding:		10.0,
        bgColor:		'#33333344',
		borderRadius:	10.0,
        borderColor:	'#FFFFFF66',
        borderSize:		0.0,
	}),

	nodeDefaults: {
		size:			[ 200, 100 ],
		resizable:		true,
		isVirtualNode:	true,
	},
	proto: {
		category: 		"locode/ui",
		description:	"Comment...",
		title_mode:		LiteGraph.NO_TITLE, // .NORMAL_TITLE .AUTOHIDE_TITLE .TRANSPARENT_TITLE .NO_TITLE
		collapsable:	false,
	}

}


/**---
 * 
 *	LoCommentNode
 */
export class LoCommentNode extends LGraphNode {


	/**
	 *	@param {CommentData}
	 */
	get commentData(){ return CommentData.fromJson(this.properties.data) }
	set commentData(value){ this.setProperty("data", value.toJson()) }


	/**---
	 */
	constructor(){
		super(NODE_CFG.title)

		// Начальные параметры узла
		Object.assign(this, NODE_CFG.nodeDefaults)

		// Начальные свойства
		this.properties = {
			...this.properties || {},
			data: this.properties.data || NODE_CFG.commentDataDefault.toJson()
		}

	}


	onShowCustomPanelInfo(panel) {
		// скрытие свойств
		["Mode", "Color", "Title", "data"]
			.forEach( name => panel.querySelector(`div.property[data-property="${name}"]`)?.remove())
    }


	onDblClick(){
		this.#editCommentData()
	}


	/**
	 *	Вывод окна редактирования
	 */
	#editCommentData = async() =>{
		this.commentData = await openCommentModal(this.commentData)
		this.setDirtyCanvas(true, true)
	}


	/**
	 *	Дополнительное меню
	 */
	getExtraMenuOptions(_, options){
		options = options || []
		options.push(
			{
				content: "Edit Comment",
				callback: () => this.#editCommentData()
			},
		)
	}


	/* DRAW */

	draw(ctx){
		const data = this.commentData
		const x = 0, y = 0

		// подсчет ширины и высоты (если hugContent)
		const size = [...this.size]
		if(data.hugContent){
			const textBounds = this.#calcTextBounds(ctx, size[0], data)
			size[0] = textBounds.width + data.padding*2
			size[1] = textBounds.height + data.padding*2
			this.size = [...size]
		}
		// рисуем
		this.#drawBackground(ctx, x, y, size[0], size[1], data)
		this.#drawBorder(ctx, x, y, size[0], size[1], data)
		this.#drawText(ctx, x, y, size[0], size[1], data)
	}


	/**
	 *  Расчет минимального размера узла
	 */
	computeSize(){
		return [...NODE_CFG.nodeMinSize]
	}


	#calcTextBounds(ctx, width, data){
		const {header, text, headerGap, padding} = data

		// подсчет текста
		const headerWH = this.#drawTextData(ctx, header, { width: width-padding*2, calcOnly: true })
		const textWH = this.#drawTextData(ctx, text, { width: width-padding*2, calcOnly: true })

		return {
			width:	Math.max(headerWH.width, textWH.width),
			height: headerWH.height + textWH.height + ( headerWH.height*textWH.height>0 ? headerGap : 0 )
		}
	}


	#drawBackground(ctx, x, y, width, height, data){
		const {bgColor, borderRadius} = data
		if(!bgColor) return

		ctx.save()
		ctx.fillStyle = bgColor
		ctx.beginPath()
		ctx.roundRect(x, y, width, height, borderRadius)
		ctx.fill()
		ctx.restore()
	}


	#drawBorder(ctx, x, y, width, height, data){
		const {borderColor, borderSize, borderRadius} = data
		if(borderSize<=0 || !borderColor) return

		// Создаем область обрезки
		ctx.save()
		ctx.beginPath()
		ctx.roundRect(x, y, width, height, borderRadius)
		ctx.clip()

		ctx.strokeStyle = borderColor
		ctx.lineWidth = borderSize*2 // это чтобы учесть обрезку
		ctx.beginPath()
		ctx.roundRect(x, y, width, height, borderRadius)
		ctx.stroke()
		ctx.restore()
	}


	/**
	 *	Рисует текстовый блок, возвращает высоту и ширину
	 *	@returns {{ width: number, height: number }}
	 */
	#drawTextData( ctx, textData, { left=0, top=0, width=0, calcOnly=false }){
		// пусто
		if(textData.isEmpty) return { width: 0, height: 0 }
		// рисуем
		ctx.font = textData.font
		ctx.fillStyle = textData.color
		ctx.textBaseline = "top"
		return wrapCanvasText( ctx, textData.value, width, {
			marginLeft: left,
			marginTop: top,
			lineSpacing: textData.lineSpacing,
			calcOnly: calcOnly
		})
	}


	#drawText(ctx, x, y, width, height, data){
		const {header, text, padding, headerGap} = data
		let topMargin = padding

		ctx.save()
		// Создаем область обрезки
		ctx.beginPath()
		ctx.rect(x, y, width, height)
		ctx.clip()

		// Заголовок
		if(!header.isEmpty){
			const headerBounds = this.#drawTextData(ctx, header, { left: padding, top: topMargin, width: width-padding*2 })
			topMargin += headerBounds.height + headerGap
		}

		// комментарий
		if(!text.isEmpty){
			this.#drawTextData(ctx, text, { left: padding, top: topMargin, width: width-padding*2 })
		}

		ctx.restore()
	}


	/**
     * Задаём минимальные размеры узла
     */
	// onResize = (...args) => {
    // }

	static setUp() {
        LiteGraph.registerNodeType(NODE_CFG.nodeType, this)
		Object.assign(this, NODE_CFG.proto)
    }

}


// Замена отрисовки узла
const oldDrawNode = LGraphCanvas.prototype.drawNode
LGraphCanvas.prototype.drawNode = function (node, ctx) {
	if (node.constructor === LoCommentNode.prototype.constructor) {
        node.bgcolor = "transparent"
        node.color = "transparent"
        const v = oldDrawNode.apply(this, arguments)
        node.draw(ctx)
        return v
    }
    const v = oldDrawNode.apply(this, arguments)
    return v
}


/**---
 * 
 *  registerExtension
 */
app.registerExtension({
	name: "locode.Comment",
	registerCustomNodes(){
		LoCommentNode.setUp()
	},
});
