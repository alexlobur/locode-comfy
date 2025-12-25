// Конфиги узлов
export const _CFG = {

    applyDelay:                 100,        // задержка применения изменений
    afterCreateDelay:           500,        // Задержка после создания узла
    onCreateGetterOffset:       [30, 0],    // Сдвиг при создании геттера относительно сеттера [x, y]
    maxFindLinkedSettersDepth:  10,         // максимальная глубина поиска связанных сеттеров

    setNode: {
        type:           "LoSetProps",
        inputPrefix:    "in",
        outputProps: {
            color_on:   "#FFF",
            color_off:  "#000",
            name:       "props",
        },
        minWidth:       140,
        menu: {
            title: "SetProps",
            submenu: {
                frozenInputs: [ "Freeze Inputs", "Unfreeze Inputs" ],
                createGetter: "Create Getter",
            }
        }
    },

    getNode: {
        type:           "LoGetProps",
        outputPrefix:   "out",
        propsSlot: {
            color_on:   "#FFF",
            color_off:  "#000",
            label:      "props"
        },
        minWidth:       140
    },
}
