import { LO_NODES_DEFAULTS } from "../config.js";


// Конфиги узлов
export const _CFG = {
    extName:        "locode.GetSet",
	category:		"locode/test",
    setNode: {
        type:           "Lo:Set",
        title:          "Set:",
        inputPrefix:    "in",
        nodesDefaults: { ...LO_NODES_DEFAULTS["LoSet"] }
    },
    getNode: {
        type:           "Lo:Get",
        title:          "Get:",
        outputPrefix:   "out",
        nodesDefaults: { ...LO_NODES_DEFAULTS["LoGet"] }
    },
    messages: {
        namespaceEmpty: "Namespace should not be empty",
        namespaceExist: "Namespace \"{name}\" already exists",
        noRefer:        "Setter with namespace \"{name}\" not found",
    },
    menu: {
        gotoRefer: "Lo:GetNode [{id}] > Goto Setter"
    }
}
