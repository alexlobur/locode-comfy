import {app} from "../../../scripts/app.js"
import coreInit from "./.core/core_init.js"
import Logger from "./.core/utils/Logger.js"

// Инициализиция ядра
coreInit()

const COLORS_DEF = {
    simple: { color: "hsl(220, 12%, 25%)", bgcolor: "hsl(220, 12%, 22%)" },
    deep: { color: "#1b263b", bgcolor: "#0d1b2a" },
    blue: { color: "#2f3544", bgcolor: "#3a435e" },
    beta: { color: "hsl(320, 49.50%, 25%)", bgcolor: "hsl(320, 50%, 22%)" },
}

const NODES_DEFAULTS = {
    "LoTexts"       : COLORS_DEF.blue,
    "LoSwitcher"    : COLORS_DEF.simple,
    // replacers
    "LoReplaceVars"     : COLORS_DEF.simple,
    "LoReplacers"       : COLORS_DEF.simple,
    "LoUseReplacers"    : COLORS_DEF.simple,
    "LoReplaceAny"      : COLORS_DEF.simple,
    // lists
    "LoSetList"     : COLORS_DEF.simple,
    "LoFromList"    : COLORS_DEF.simple,
    "LoStrList"     : COLORS_DEF.simple,
    "LoNumList"     : COLORS_DEF.simple,
    "LoListLen"     : COLORS_DEF.simple,
    "LoListJoin"    : COLORS_DEF.simple,

    // beta
    "LoCounter" : COLORS_DEF.beta,
    "LoRmDir"   : COLORS_DEF.beta,
}


//---
//  Начальные значения для всех узлов LoCode
//
app.registerExtension({
    name: "locode.init",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // Проверяем, что имя узла соответствует нужному типу
        if (!Object.keys(NODES_DEFAULTS).includes(nodeType.comfyClass)) return

        const nodeDefaults = NODES_DEFAULTS[nodeType.comfyClass]
        // Logger.debug(nodeType.comfyClass, nodeDefaults)

        //
        // Создание узла и инициализация виджета
        const onNodeCreated = nodeType.prototype.onNodeCreated
        nodeType.prototype.onNodeCreated = function(){

            // Переопределение начальных значений
            for (const key in nodeDefaults){
                this[key] = nodeDefaults[key]
            }

            return onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined
        }

    }

})

