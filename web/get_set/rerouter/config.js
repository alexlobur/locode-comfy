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
        "Compact",
        "System",
        "Adaptive",
    ],

    // параметры узла
    node: {
        type:               "ReRoutes [lo]",
        title:              "ReRoutes [lo]",

        // минимальный размер узла
        minSize:            [LiteGraph.NODE_SLOT_HEIGHT * 1, LiteGraph.NODE_SLOT_HEIGHT * 1],

        // параметры прототипа
        prototype: {
            category:           "locode/reroutes",
            title_mode:         LiteGraph.NO_TITLE,
            isVirtualNode:      true,
            serialize_widgets:  true,
            collapsible:        false,
        },

        // начальные значения узла
        defaults: {
            ...LO_NODES_DEFAULTS["Reroutes"],
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
        padHorizontal:          LiteGraph.NODE_SLOT_HEIGHT * 0.25, //333,
        padHorizontalSystem:    LiteGraph.NODE_SLOT_HEIGHT * 0.44,
        // минимальный вертикальный отступ для слота
        padVertical:        LiteGraph.NODE_SLOT_HEIGHT * 0.6666,
        padVerticalSystem:  LiteGraph.NODE_SLOT_HEIGHT * 0.70,
        // расстояние между слотами
        spacing:            LiteGraph.NODE_SLOT_HEIGHT * 0.6666,
        spacingSystem:      LiteGraph.NODE_SLOT_HEIGHT,
        // горизонтальный отступ для текста слота
        textPadding:        LiteGraph.NODE_SLOT_HEIGHT * 0.6,
        textPaddingSystem:  LiteGraph.NODE_SLOT_HEIGHT * 0.9,
        textFont:           "9px Arial",
        textFontSystem:     "12px Arial",
        textColor:          "rgba(255, 255, 255, 0.5)",

        // расстояние между слотами при котором узел считается свернутым
        collapseOnSpacing:  8

    }

}
