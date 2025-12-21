import { LO_NODES_DEFAULTS } from "../../config.js"


// Конфиги узлов
export const _CFG = {

    // Задержка применения изменений
    applyDelay: 100,

    // Задержка после создания узла
    afterCreateDelay: 500,

    // Сдвиг при продолжении маршрутов
    onContinueRoutesOffset: [100, 0],

    // Режимы отображения узлов
    viewModes: [
        "System",
        "Standard",
        "Adaptive",
    ],

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
        defaults: {
            ...LO_NODES_DEFAULTS["LoReRouter"],
            isVirtualNode:      true,
            serialize_widgets:  true,
            size:               [50, 30],
        },

        // меню узла
        menu: {
            title: "ReRoutes [Lo]",
            submenu: {
                continueRoutes:         "Continue Routes",
                inputsFreezing:         [ "Freeze Inputs", "Unfreeze Inputs" ],
                slotsLabelsVisibility:  [ "Show Slots Labels", "Hide Slots Labels" ],
                viewMode: {
                    title: "View Mode",
                    options: ()=> _CFG.viewModes,
                }
            }
        }
    },

    // slots settings
    slots: {
        padHorizontal:  LiteGraph.NODE_SLOT_HEIGHT * 0.25, //333,
        padVertical:    LiteGraph.NODE_SLOT_HEIGHT * 0.6666,
        spacing:        LiteGraph.NODE_SLOT_HEIGHT * 0.6666,
        minWidth:       LiteGraph.NODE_SLOT_HEIGHT * 1,
        // горизонтальный отступ для текста слота
        textPadding:    LiteGraph.NODE_SLOT_HEIGHT * 0.6,
        textFont:       "9px Arial",
        textColor:      "rgba(255, 255, 255, 0.5)",
    }

}
