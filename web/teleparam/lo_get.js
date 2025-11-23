import Logger from "../.core/utils/Logger.js"


export class LoGet extends LGraphNode {
	constructor(){
		super("Lo:Get")

		//	Начальные значения
		this.serialize_widgets = true
		this.isVirtualNode = true

		this.addInput("PROPS", "LO_SET_PROPS")
		this.addOutput("*", '*')

		Logger.debug(this)

	}

	static setUp(){
        LiteGraph.registerNodeType("LoGet", this)
		this.description = "Get List of Params..."
		this.category = "locode/params"
    }

}

