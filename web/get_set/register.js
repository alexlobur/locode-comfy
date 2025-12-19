import {app} from "../../../../scripts/app.js"
import {LoGetNode} from "./get_set/get_node.js"
import {LoSetNode} from "./get_set/set_node.js"
import {LoRerouter} from "./rerouter/rerouter.js"
import {LoSetPropsExtends} from "./get_set_props/lo_set_props.js"
import {LoGetPropsExtends} from "./get_set_props/lo_get_props.js"

//
// Регистрация фронтенд-расширения ComfyUI:
app.registerExtension({
    name: "locode.PropsAndRerouter",

	// Регистрация кастомных узлов
	registerCustomNodes() {
		LoSetNode.setUp()
		LoGetNode.setUp()
		LoRerouter.setUp()
	},

	// Расширение прототипов узлов
	async beforeRegisterNodeDef(nodeType, nodeData, app){

		// Расширение прототипа Set
        if (nodeType.comfyClass == LoSetPropsExtends.nodeType){
            LoSetPropsExtends(nodeType.prototype)
        }

		// Расширение прототипа Get
        if (nodeType.comfyClass == LoGetPropsExtends.nodeType){
            LoGetPropsExtends(nodeType.prototype)
        }
    }

})

