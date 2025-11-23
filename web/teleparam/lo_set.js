import Logger from "../.core/utils/Logger.js"
import { LoSetWidget } from "./LoSetWidget.js"

/*
    + onAdded: when added to graph (warning: this is called BEFORE the node is configured when loading)
    + onRemoved: when removed from graph
    + onStart: when the graph starts playing
    + onStop: when the graph stops playing
    + onDrawForeground: render the inside widgets inside the node
    + onDrawBackground: render the background area inside the node (only in edit mode)
    + onMouseDown
    + onMouseMove
    + onMouseUp
    + onMouseEnter
    + onMouseLeave
    + onExecute: execute the node
    + onPropertyChanged: when a property is changed in the panel (return true to skip default behaviour)
    + onGetInputs: returns an array of possible inputs
    + onGetOutputs: returns an array of possible outputs
    + onBounding: in case this node has a bigger bounding than the node itself (the callback receives the bounding as [x,y,w,h])
    + onDblClick: double clicked in the node
    + onNodeTitleDblClick: double clicked in the node title
    + onInputDblClick: input slot double clicked (can be used to automatically create a node connected)
    + onOutputDblClick: output slot double clicked (can be used to automatically create a node connected)
    + onConfigure: called after the node has been configured
    + onSerialize: to add extra info when serializing (the callback receives the object that should be filled with the data)
    + onSelected
    + onDeselected
    + onDropItem : DOM item dropped over the node
    + onDropFile : file dropped over the node
    + onConnectInput : if returns false the incoming connection will be canceled
    + onConnectionsChange : a connection changed (new one or removed) (NodeSlotType.INPUT or NodeSlotType.OUTPUT, slot, true if connected, link_info, input_info )
    + onAction: action slot triggered
    + getExtraMenuOptions: to add option to context menu

*/


const NODE_CFG = {
    type: "LoSet",
    title: "Lo:Set",
    inputPrefix: "_",
    category: "locode/params",
    decription: "Set List of Params...",
    output: {
        name: "PROPS",
        type: "LIST",
        props: {
            color_on: "black",
            color_off: "grey",
        }
    }
}


export class LoSet extends LGraphNode {

	constructor(title){
		super(NODE_CFG.title)

        //	Начальные значения
		this.serialize_widgets = true
		this.isVirtualNode = true

        // Нормализация инпутов
        this.#normalizeInputs()

        // добавление выхода
        const output = this.addOutput( NODE_CFG.output.name, NODE_CFG.output.type, NODE_CFG.output.props )

        Logger.debug(this)
	}


    getOutputData(){
		Logger.debug("getOutputData", arguments)
    }


    onConnectInput(){
        Logger.debug("onConnectInput", arguments)
    }


    onConnectionsChange(
        slotType,	//1 = input, 2 = output
        slot,
        isChangeConnect,
        link_info,
        output
    ){
        Logger.debug("onConnectionsChange", arguments)
        Logger.debug(this.inputs, this.outputs)

        this.#normalizeInputs()

        // //On Connect
        // if (link_info && node.graph && slotType == 1 && isChangeConnect) {
        //     const fromNode = node.graph._nodes.find((otherNode) => otherNode.id == link_info.origin_id)
        //     Logger.debug(fromNode)
        //     if (fromNode && fromNode.outputs && fromNode.outputs[link_info.origin_slot]) {
        //     //     const type = fromNode.outputs[link_info.origin_slot].type
            
        //     //     if (this.title === "Set"){
        //     //         this.title = (!disablePrefix ? "Set_" : "") + type
        //     //     }
        //     //     if (this.widgets[0].value === '*'){
        //     //         this.widgets[0].value = type	
        //     //     }
        //     //     this.validateName(node.graph)
        //     //     this.inputs[0].type = type
        //     //     this.inputs[0].name = type
        //     }
        // }
    }


    #normalizeInputs(){
        // Нормализация инпутов - удаление пустых, добавление свободного
        this.inputs = this.inputs.filter( input => input.isConnected )

        // Обновление информации о слотах
        for (const input of this.inputs){
        }

        // Добавление свободного
        this.addInput(`${NODE_CFG.inputPrefix}${this.inputs.length}`, "*",)
    }


    static setUp() {
        LiteGraph.registerNodeType(NODE_CFG.type, this)
        this.category = NODE_CFG.category
		this.description = NODE_CFG.decription
    }

}

