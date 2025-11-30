import {app} from "../../../../scripts/app.js"
import { LoSetPropsExtends } from "./lo_set_props.js"
import { LoGetPropsExtends } from "./lo_get_props.js"
import GetSetProps, { _CFG } from "./get_set_props_vm.js"
import Logger from "../../.core/utils/Logger.js"


//---
//
// Регистрация фронтенд-расширения ComfyUI:
//
app.registerExtension({
    name: _CFG.extName,
    async beforeRegisterNodeDef(nodeType, nodeData, app){

        // Расширение прототипа Set
        if (nodeType.comfyClass == _CFG.setNode.type){
            LoSetPropsExtends(nodeType.prototype)
        }

        // Расширение прототипа Get
        if (nodeType.comfyClass == _CFG.getNode.type){
            LoGetPropsExtends(nodeType.prototype)
        }
    }

})

GetSetProps.events.onAny( (e, d)=> Logger.debug(e, d) )



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
    + onConnectionsChange : a connection changed (new one or removed)
        (NodeSlotType.INPUT or NodeSlotType.OUTPUT, slot, true if connected, link_info, input_info )
    + onAction: action slot triggered
    + getExtraMenuOptions: to add option to context menu

*/

