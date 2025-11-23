import {app} from "../../../scripts/app.js"
import {LoSet} from "./lo_set.js"
import {LoGet} from "./lo_get.js"


app.registerExtension({
	name: "locode.LoSetGet",
	registerCustomNodes(){
		LoSet.setUp()
		LoGet.setUp()
	},
})