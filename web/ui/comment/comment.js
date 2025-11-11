import { app } from "../../../../scripts/app.js"
import { wrapText } from "../../.core/utils/nodes_utils.js"


const NO_COLOR = "#00000033"

export class LoCommentNode extends LGraphNode {


	set comment(val){
		this.properties.comment = val
	}

	get comment (){
		return this.properties.comment
	}


	constructor(title = LoCommentNode.title){
		super(title)

		this.serialize_widgets = true
		this.isVirtualNode = true
		this.resizable = true
        // this.isDropEnabled = false

		this.properties = this.properties || {}
		this.properties.comment = this.properties.comment || ""

		// Визуальные настройки нода (минимальные)
		// this.size = MIN_NODE_SIZE
		this.color = NO_COLOR
		this.bgcolor = NO_COLOR
		// this.boxcolor = NO_COLOR
		// this.clip_area = true
		// this.render_shadow = false
		// this.widgets_up = true

		console.debug(this)
	}


	onPropertyChanged(name, value){
		if (name === "comment"){
			this.comment = value ?? ""
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
		if (this.flags?.collapsed) return
		ctx.save()
		ctx.font = "400 10px Arial"
		ctx.fillStyle = "#666"
		ctx.textBaseline = "top"
		wrapText(ctx, this.comment, 10, 10, this.size[0], 16)
		// ctx.fillText(this.comment, 8, 6)
		ctx.restore()
	}


	onDblClick(...args){
		console.debug("onDblClick", args)
	}


	getExtraMenuOptions(_, options) {
		options = options || [];
		options.push(
			{
				content: "Clear comment",
				callback: () => {
					this.comment = ''
					this.setDirtyCanvas(true, true)
				},
			},
			{
				content: "Reset Color",
				callback: () => {
					this.color = NO_COLOR
					this.bgcolor = NO_COLOR
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
LoCommentNode.title_mode = LiteGraph.AUTOHIDE_TITLE // LiteGraph.TRANSPARENT_TITLE //LiteGraph.NO_TITLE
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
