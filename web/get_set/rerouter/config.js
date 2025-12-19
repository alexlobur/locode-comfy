import { LO_NODES_DEFAULTS } from "../../config.js"


// Конфиги узлов
export const _CFG = {

    /**
     *  Задержка применения изменений
     */
    applyDelay: 100,

    // параметры узла
    node: {
        type:               "ReRoutes [Lo]",
        title:              "ReRoutes",

        // параметры прототипа
        prototype: {
            category:           "locode/params",
            title_mode:         LiteGraph.NO_TITLE,
            isVirtualNode:      true,
            serialize_widgets:  true,
        },

        // начальные значения узла
        defaults:  {
            ...LO_NODES_DEFAULTS["LoReRouter"],
            isVirtualNode:      true,
            serialize_widgets:  true,
        },

        // меню узла
        menu: {
            title: "ReRoutes [Lo]",
            submenu: {
                freezeInputs:       "Freeze Inputs",
                unfreezeInputs:     "Unfreeze Inputs",
                continueeRoutes:    "Continue Routes",
            }
        }
    },

    // slots settings
    slots: {
        padHorizontal:  LiteGraph.NODE_SLOT_HEIGHT * 0.25, //333,
        padVertical:    LiteGraph.NODE_SLOT_HEIGHT * 0.75,
        spacing:        LiteGraph.NODE_SLOT_HEIGHT * 0.5,
        minWidth:       LiteGraph.NODE_SLOT_HEIGHT * 1,
        textPadding:    LiteGraph.NODE_SLOT_HEIGHT * 0.6,
    }

}
