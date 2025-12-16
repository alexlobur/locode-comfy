// Конфиги узлов
export const _CFG = {

    extName:        "locode.GetSetProps",
    applyDelay:     100, // задержка применения изменений
    onCreateGetterOffset: [30, 0],  // Сдвиг при создании геттера относительно сеттера [x, y]
    maxFindLinkedSettersDepth: 10,  // максимальная глубина поиска связанных сеттеров

    setNode: {
        type:           "LoSetProps",
        // title:          "Set:",
        inputPrefix:    "in",
        outputProps: {
            color_on:   "#FFF",
            color_off:  "#000",
            name:       "props",
        },
        minWidth:       140,
        menu: {
            title: "Lo:SetProps",
            submenu: {
                freezeInputs: "Freeze Inputs",
                unfreezeInputs: "Unfreeze Inputs",
                createGetter: "Create Getter",
            }
        }
    },

    getNode: {
        type:           "LoGetProps",
        // title:          "Get:",
        outputPrefix:   "out",
        inputProps: {
            color_on:   "#FFF",
            color_off:  "#000",
            label:      "props"
        },
        minWidth:       140
    },
}
