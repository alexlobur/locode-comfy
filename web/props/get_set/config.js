import { LO_NODES_DEFAULTS } from "../../config.js";


// Конфиги узлов
export const _CFG = {
    extName:        "locode.GetSet",
	category:       "locode/test",

    /**
     *  Устанавливать ли заголовок узла из пространства имен
     */
    setTitleFromNamespace: true,

    /**
     *  Сдвиг при создании геттера относительно сеттера [x, y]
     */
    onCreateGetterOffset: [100, 0],

    /**
     *  Задержка применения изменений
     */
    applyDelay: 100,

    /**
     *  Конфиг узла сеттера
     */
    setNode: {
        type:               "Lo:Set",
        title:              "Set:",
        titleFromNamespace: "Set: {namespace}",
        inputPrefix:        "in",
        nodesDefaults: { ...LO_NODES_DEFAULTS["LoSet"] },
        minWidth:       150,
        frozenIndicator: {
            color:  "#FFFFFF66",
            font:   "36px sans-serif",
            text:   "*",
            offset: [-18, 32],
        },
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
        type:               "Lo:Get",
        title:              "Get:",
        titleFromNamespace: "Get: {namespace}",
        outputPrefix:       "out",
        nodesDefaults: { ...LO_NODES_DEFAULTS["LoGet"] },
        minWidth:       150,
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
        noRefer:        "Setter with namespace \"{name}\" not found",
    },
}
