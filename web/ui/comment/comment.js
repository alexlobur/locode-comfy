import {coreInit} from "../../.core/core_init.js"
import Logger from "../../.core/utils/Logger.js"
import { app } from "../../../../scripts/app.js"
import { wrapCanvasText } from "../../.core/utils/nodes_utils.js"
import { openCommentModal } from "./comment_modal.js"
import { CommentData } from "./comment_data.js"

// Инициализация ядра
coreInit()

// Конфиг узла
const NODE_CFG = {
	minSize:		[ 100, 100 ],
	borderRadius:	8,
	borderSize:		0.5,
	spacing:		8,
	padding:		8,
}


/**---
 * 
 *	LoCommentNode
 */
export class LoCommentNode extends LGraphNode {


	get commentData(){
		return CommentData.fromJson(this.properties.data)
	}

	/**
	 * @param {CommentData}
	 */
	set commentData(value){
		this.properties.data = value.toJson()
	}


	/**---
	 */
	constructor(title = LoCommentNode.title){
		super(title)

		this.serialize_widgets = true
		this.isVirtualNode = true
		this.resizable = true
        // this.isDropEnabled = false

		// Визуальные настройки нода (минимальные)
		this.size = NODE_CFG.minSize
		// this.clip_area = true
		// this.render_shadow = false
		// this.widgets_up = true

		console.debug(this)
	}


	onPropertyChanged(name, value){
		if (name === "data"){
			this.setDirtyCanvas(true, true)
			return true
		}
	}


	onDrawBackground(ctx) {
		const [w, h] = this.size
		const r = NODE_CFG.borderRadius
		const lineWidth = NODE_CFG.borderSize
		const {borderColor} = this.properties

		// // фон
		// ctx.fillStyle = "#30364a"
		// if (ctx.roundRect) {
		// 	ctx.beginPath()
		// 	ctx.roundRect(0, 0, w, h, r)
		// 	ctx.fill()
		// } else {
		// 	ctx.fillRect(0, 0, w, h)
		// }

		// рамка
		if(!borderColor) return // не задана
		ctx.save()
		ctx.strokeStyle = borderColor
		ctx.lineWidth = lineWidth
		if (ctx.roundRect){
			ctx.beginPath()
			ctx.roundRect(lineWidth/2, lineWidth/2, w - lineWidth/2, h - lineWidth/2, r)
			ctx.stroke()
		} else {
			ctx.strokeRect(lineWidth/2, lineWidth/2, w - lineWidth/2, h - lineWidth/2)
		}
		ctx.restore()
	}


	onDrawForeground(ctx) {
		if (this.flags?.collapsed) return

		// начальные данные
		const {textColor, font, caption} = this.properties
		const {captionFont, padding, spacing} = NODE_CFG
		const [w, h] = this.size
		let topMargin = padding
		ctx.save()

		// Создаем область обрезки
		ctx.beginPath();
		ctx.rect(0, 0, w, h)
		ctx.clip()

		// Заголовок
		if(caption){
			ctx.font = captionFont
			ctx.fillStyle = textColor
			ctx.textBaseline = "top"
			const captionH = wrapCanvasText( ctx, caption, w-padding*2, {
				marginLeft: padding, marginTop: topMargin
			})
			topMargin += captionH + spacing
		}

		// комментарий
		ctx.font = font
		ctx.fillStyle = textColor
		ctx.textBaseline = "top"
		wrapCanvasText( ctx, this.comment, w-padding*2, {
			marginLeft: padding, marginTop: topMargin
		})

		ctx.restore()
	}


	onDblClick(){
		this.#editCommentData()
	}


	/**
	 *	Вывод окна редактирования
	 */
	#editCommentData = async() =>{
		const result = await openCommentModal(this.commentData)
		Logger.debug(result)
		this.commentData = result
	}


	/**
	 *	Дополнительное меню
	 */
	getExtraMenuOptions(_, options) {
		options = options || []
		// options.push(
		// 	{
		// 		content: "Reset Defaults",
		// 		callback: () => {
		// 			this.data = ({
		// 				bgColor:	NODE_CFG.bgColor,
		// 				textColor:	NODE_CFG.textColor,
		// 				boxColor:	NODE_CFG.boxColor,
		// 				textFont:	NODE_CFG.textFont
		// 			})
		// 			this.setDirtyCanvas(true, true)
		// 		},
		// 	},
		// )
	}


	/**
     * Задаём минимальные размеры узла
     */
	// onResize = (...args) => {
    // }


	static setUp() {
        LiteGraph.registerNodeType(this.type, this)
        if (this._category) this.category = this._category
    }

}


LoCommentNode.type			= "Lo:Comment"
LoCommentNode.title			= "Lo:Comment"
LoCommentNode.category		= "locode/ui"
LoCommentNode._category		= "locode/ui"
LoCommentNode.description	= "Comment"
LoCommentNode.title_mode	= LiteGraph.NO_TITLE // .NORMAL_TITLE .AUTOHIDE_TITLE .TRANSPARENT_TITLE .NO_TITLE
LoCommentNode.collapsable	= true


/**---
 * 
 *  registerExtension
 */
app.registerExtension({
	name: "locode.Comment",
	registerCustomNodes() {
		LoCommentNode.setUp()
	},
});
