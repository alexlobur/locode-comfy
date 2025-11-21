import {app} from "../../../scripts/app.js"
import coreInit from "./.core/core_init.js"
import {showDeprecatedBanner} from "./.core/ui/deprecated_banner/deprecated_banner.js"
import Logger from "./.core/utils/Logger.js"


// Инициализиция ядра
coreInit()

const COLORS_DEF = {
    basic:      { color: "hsl(220, 12%, 25%)", bgcolor: "hsl(220, 12%, 22%)" },
    dark:       { color: "hsl(220, 12%, 20%)", bgcolor: "hsl(220, 12%, 16%)" },
    blue:       { color: "hsl(225, 24%, 32%)", bgcolor: "hsl(225, 24%, 27%)" },
    magenta:    { color: "hsl(300, 25%, 27%)", bgcolor: "hsl(300, 25%, 22%)" },
    system:     { color: "hsl(320, 40%, 20%)", bgcolor: "hsl(320, 40%, 16%)" },
}

const NODES_DEFAULTS = {

    // misc
    "LoTexts"           : COLORS_DEF.blue,
    "LoGetVideoProps"   : COLORS_DEF.magenta,
    "LoSetVideoProps"   : COLORS_DEF.magenta,

    // calc
    "LoEvals"       : COLORS_DEF.basic,
    "LoCompareNum"  : COLORS_DEF.basic,
    "LoRandomNum"   : COLORS_DEF.basic,
    "LoRandomBool"  : COLORS_DEF.basic,
    "LoNotBool"     : COLORS_DEF.basic,
    "LoIsEmpty"     : COLORS_DEF.basic,

    // utils
    "LoSwitcher"    : COLORS_DEF.basic,
    "LoCounter"     : COLORS_DEF.basic,
    "LoLog"         : { ...COLORS_DEF.dark, shape: 1 },
    "LoBeep"        : { ...COLORS_DEF.dark, shape: 1 },

    // convert
    "LoToInt"       : COLORS_DEF.basic,
    "LoToStr"       : COLORS_DEF.basic,
    "LoToFloat"     : COLORS_DEF.basic,
    "LoToBool"      : COLORS_DEF.basic,

    // replacers
    "LoReplaceVars"     : COLORS_DEF.basic,
    "LoReplacers"       : COLORS_DEF.basic,
    "LoReplacersApply"  : COLORS_DEF.basic,
    "LoReplaceAny"      : COLORS_DEF.basic,

    // lists
    "LoSetList"     : COLORS_DEF.basic,
    "LoFromList"    : COLORS_DEF.basic,
    "LoStrList"     : COLORS_DEF.basic,
    "LoNumList"     : COLORS_DEF.basic,
    "LoListLen"     : COLORS_DEF.basic,
    "LoListJoin"    : COLORS_DEF.basic,

    // system
    "LoMkDir"           : COLORS_DEF.system,
    "LoRmDir"           : COLORS_DEF.system,
    "LoReadDir"         : COLORS_DEF.system,
    "LoFileExists"      : COLORS_DEF.system,
    "LoCountDirImages"  : COLORS_DEF.system,

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
        //
        // Создание узла и инициализация виджета
        const onNodeCreated = nodeType.prototype.onNodeCreated
        nodeType.prototype.onNodeCreated = function(){
            // Переопределение начальных значений
            for (const key in nodeDefaults){
                this[key] = nodeDefaults[key]
            }
            // Тут apply делаем после переопределений
            return onNodeCreated?.apply(this, arguments)
        }
    }
})


//---
//  Список DEPRECATED типов
//
const DEPRECATED_TYPES = new Set()
app.registerExtension({
    name: "locode.deprecated",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if(nodeData.deprecated) DEPRECATED_TYPES.add(nodeType.comfyClass)
    },
})


// Цепляемся к loadGraphData чтобы отследить загрузку узлов
const _loadGraphData = app.loadGraphData
app.loadGraphData = function (){
    if(DEPRECATED_TYPES.size>0){
        setTimeout(()=>{
            Logger.debug("DEPRECATED_TYPES", DEPRECATED_TYPES)
            showDeprecatedBanner(DEPRECATED_TYPES)
        }, 100)
    }
    return _loadGraphData.apply(this, arguments)
}
