import { LO_NODES_DEFAULTS, LO_NODES_MIN_WIDTH_OVERRIDES } from "../../config.js";


// Конфиги узлов
export const _CFG = {
	category:       "locode/reroutes",

    /**
     *  Устанавливать ли заголовок узла из пространства имен
     */
    setTitleFromNamespace: true,

    /**
     *  Сдвиг при создании геттера относительно сеттера [x, y]
     */
    onCreateGetterOffset: [30, 0],

    /**
     *  Задержка применения изменений
     */
    applyDelay: 100,

    /**
     *  Конфиг узла сеттера
     */
    setNode: {
        type:               "Set [lo]",
        title:              "Set [lo]",
        titleFromNamespace: "[{namespace}]",
        inputPrefix:        "in",
        widgetName:         "set",
        nodesDefaults: { ...LO_NODES_DEFAULTS["LoSet"] },
        minWidth:       LO_NODES_MIN_WIDTH_OVERRIDES["LoSet"],
        menu: {
            title: "Lo:Set",
            submenu: {
                freezeInputs: "Freeze Inputs",
                unfreezeInputs: "Unfreeze Inputs",
                createGetter: "Create Getter",
            }
        }
    },


    /**
     *  Конфиг узла геттера
     */
    getNode: {
        type:               "Get [lo]",
        title:              "Get [lo]",
        titleFromNamespace: "[{namespace}]",
        outputPrefix:       "out",
        widgetName:         "get",
        nodesDefaults: { ...LO_NODES_DEFAULTS["LoGet"] },
        minWidth:       LO_NODES_MIN_WIDTH_OVERRIDES["LoGet"],
        menu: {
            title: "Lo:Get",
            submenu: {
                gotoSetter: "Goto Setter #{id}",
            }
        }
    },

    /**
     *  Сообщения
     */
    messages: {
        namespaceEmpty: "Namespace should not be empty",
        namespaceExist: "Namespace \"{name}\" already exists",
        noSetter:       "Setter with namespace \"{name}\" not found",
        noLink:         "Link[{slot}] to setter with namespace \"{name}\" not found",
    },
}
