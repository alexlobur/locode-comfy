import { app } from "../../../../scripts/app.js"
import { wrapCanvasText } from "../../.core/utils/nodes_utils.js"


const DEFAULT_COLOR = "#33333344"
const DEFAULT_TEXT_COLOR = "#FFFFFF66"
const DEFAULT_TEXT_FONT = "400 10px Arial"
const MIN_NODE_SIZE = [ 100, 100 ]

export class LoCommentNode extends LGraphNode {


	constructor(title = LoCommentNode.title){
		super(title)

		this.serialize_widgets = true
		this.isVirtualNode = true
		this.resizable = true
        // this.isDropEnabled = false

		// Обновление свойств
		this.updateProperties()

		// Визуальные настройки нода (минимальные)
		this.size = MIN_NODE_SIZE
		// this.clip_area = true
		// this.render_shadow = false
		// this.widgets_up = true

		console.debug(this)
	}


	updateProperties({ bgcolor=null, text_color=null, comment=null, font=null }={}){
		this.properties = this.properties || {}
		this.properties.comment		= comment || this.properties.comment || ""
		this.properties.bgcolor		= bgcolor || this.properties.bgcolor || DEFAULT_COLOR
		this.properties.text_color	= text_color || this.properties.text_color || DEFAULT_TEXT_COLOR
		this.properties.font		= font || this.properties.font || DEFAULT_TEXT_FONT
		this.color		= this.properties.bgcolor
		this.bgcolor	= this.properties.bgcolor
		this.boxcolor	= this.properties.text_color
	}


	onPropertyChanged(name, value){
		if (name === "comment"){
			console.debug(value)
			value = String(value).replaceAll("\n", "\\n")
			this.updateProperties({ comment: value })
			this.setDirtyCanvas(true, true)
			return true
		}
		if (["bgcolor", "text_color", "font"].includes(name)){
			this.updateProperties()
			this.setDirtyCanvas(true, true)
			return true
		}
	}


	onDrawBackground(ctx) {
		// const [w, h] = this.size
		// const r = 8
		// ctx.save()
		// // фон
		// ctx.fillStyle = "#30364a"
		// if (ctx.roundRect) {
		// 	ctx.beginPath()
		// 	ctx.roundRect(0, 0, w, h, r)
		// 	ctx.fill()
		// } else {
		// 	ctx.fillRect(0, 0, w, h)
		// }
		// // рамка
		// ctx.strokeStyle = "rgba(255,255,255,0.08)"
		// ctx.lineWidth = 1
		// if (ctx.roundRect) {
		// 	ctx.beginPath()
		// 	ctx.roundRect(0.5, 0.5, w - 1, h - 1, r)
		// 	ctx.stroke()
		// } else {
		// 	ctx.strokeRect(0.5, 0.5, w - 1, h - 1)
		// }
		// ctx.restore()
	}


	onDrawForeground(ctx) {
		const {comment, text_color, font} = this.properties

		if (this.flags?.collapsed) return
		ctx.save()
		ctx.font = font
		ctx.fillStyle = text_color
		ctx.textBaseline = "top"
		wrapCanvasText( ctx, comment, this.size[0]-16, { marginLeft: 8, marginTop: 8 })
		ctx.restore()
	}


	onDblClick(...args){
		console.debug("onDblClick", args)
	}


	getExtraMenuOptions(_, options) {
		options = options || [];
		options.push(
			{
				content: "Reset Defaults",
				callback: () => {
					this.updateProperties({ bgcolor: DEFAULT_COLOR, text_color: DEFAULT_TEXT_COLOR, font: DEFAULT_TEXT_FONT })
					this.setDirtyCanvas(true, true)
				},
			},
		);
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

LoCommentNode.type = "Lo:Comment"
LoCommentNode.title = "Lo:Comment"
LoCommentNode.category = "locode/ui"
LoCommentNode._category = "locode/ui"
LoCommentNode.description = "Comment"
LoCommentNode.title_mode = LiteGraph.NORMAL_TITLE //LiteGraph.AUTOHIDE_TITLE // LiteGraph.TRANSPARENT_TITLE //LiteGraph.NO_TITLE
LoCommentNode.collapsable = true


/**---
 *  registerExtension
 */
app.registerExtension({
	name: "locode.Comment",
	registerCustomNodes() {
		LoCommentNode.setUp()
	},
});
