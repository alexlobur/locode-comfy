import {coreInit} from "../../.core/core_init.js"
import { app } from "../../../../scripts/app.js"
import { wrapCanvasText } from "../../.core/utils/nodes_utils.js"
import { openCommentModal } from "./comment_modal.js"
import { CommentData } from "./comment_data.js"
import Logger from "../../.core/utils/Logger.js"

// Инициализация ядра
coreInit()

// Конфиг узла
const NODE_CFG = {
	minSize:		[ 100, 100 ],
	borderRadius:	8,
	spacing:		2,
	commentDataDefault: new CommentData({
        title:		'',
        titleColor:	'#FFFFFF66',
        titleFont:	'600 11px Arial, sans-serif',
        text:		'Double click...',
        textColor:	'#FFFFFF66',
        textFont:	'400 10px Arial, sans-serif',
        bgColor:	'#33333344',
        borderColor:'#FFFFFF66',
        borderSize:	0.0,
		padding:	10.0
	})
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
	 *	@param {CommentData}
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

		// Начальные свойства
		this.properties = {
			data: this.properties.data || NODE_CFG.commentDataDefault.toJson()
		}

		// Визуальные настройки нода (минимальные)
		this.size = NODE_CFG.minSize
		// this.clip_area = true
		// this.render_shadow = false
		// this.widgets_up = true

		Logger.debug(this)
	}


	onPropertyChanged(name, value){
		if (name === "data"){
			this.setDirtyCanvas(true, true)
			return true
		}
	}

	onShowCustomPanelInfo(panel) {
        var _a, _b;
        (_a = panel.querySelector('div.property[data-property="Mode"]')) === null || _a === void 0 ? void 0 : _a.remove();
        (_b = panel.querySelector('div.property[data-property="Color"]')) === null || _b === void 0 ? void 0 : _b.remove();
    }

	onDrawBackground(ctx) {
		const [w, h] = this.size
		const r = NODE_CFG.borderRadius
		const {bgColor, borderColor, borderSize} = this.commentData

		this.bgcolor = bgColor || this.bgcolor

		// // фон
		// ctx.save()
		// ctx.fillStyle = bgColor
		// if (ctx.roundRect) {
		// 	ctx.beginPath()
		// 	ctx.roundRect(0, 0, w, h, r)
		// 	ctx.fill()
		// } else {
		// 	ctx.fillRect(0, 0, w, h)
		// }
		// ctx.restore()

		/// Рамка
		if(!borderColor || borderSize<=0) return // не задана
		ctx.save()

		const borderRadius = ctx.roundRect ? r : 0

		// Создаем область обрезки
		ctx.beginPath()
		ctx.roundRect(0, 0, w, h, borderRadius)
		ctx.clip()

		ctx.strokeStyle = borderColor
		ctx.lineWidth = borderSize*2 // это чтобы учесть обрезку
		ctx.beginPath()
		ctx.roundRect(0, 0, w, h, borderRadius)
		ctx.stroke()
		ctx.restore()
	}


	onDrawForeground(ctx) {
		if (this.flags?.collapsed) return

		// начальные данные
		const {spacing} = NODE_CFG
		const [w, h] = this.size
		const data = this.commentData
		const padding = data.padding
		let topMargin = padding

		ctx.save()
		// Создаем область обрезки
		ctx.beginPath();
		ctx.rect(0, 0, w, h)
		ctx.clip()

		// Заголовок
		if(data.title){
			ctx.font = data.titleFont
			ctx.fillStyle = data.titleColor
			ctx.textBaseline = "top"
			const captionH = wrapCanvasText( ctx, data.title, w-padding*2, { marginLeft: padding, marginTop: topMargin })
			topMargin += captionH + spacing
		}
		// комментарий
		ctx.font = data.textFont
		ctx.fillStyle = data.textColor
		ctx.textBaseline = "top"
		wrapCanvasText( ctx, data.text, w-padding*2, { marginLeft: padding, marginTop: topMargin })
		ctx.restore()
	}


	onDblClick(){
		this.#editCommentData()
	}


	/**
	 *	Вывод окна редактирования
	 */
	#editCommentData = async() =>{
		this.commentData = await openCommentModal(this.commentData)
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
