import {app} from "../../../../scripts/app.js"
import Logger from "../../.core/utils/Logger.js"
import {LoGetNode} from "./get_node.js"
import {LoSetNode} from "./set_node.js"
import {_CFG} from "./config.js"


//---
//
// Регистрация фронтенд-расширения ComfyUI:
//
//---

app.registerExtension({
    name: _CFG.extName,
	registerCustomNodes() {
		LoSetNode.setUp()
		LoGetNode.setUp()
	},
})


/*
    TEST
*/
LoSetNode.events.onAny(
    (e, d)=> Logger.debug(e, d)
)

