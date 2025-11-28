const LO_COLORS_DEF = {
    basic:      { color: "hsl(220, 12%, 25%)", bgcolor: "hsl(220, 12%, 22%)" },
    dark:       { color: "hsl(220, 12%, 20%)", bgcolor: "hsl(220, 12%, 16%)" },
    blue:       { color: "hsl(225, 24%, 32%)", bgcolor: "hsl(225, 24%, 27%)" },
    magenta:    { color: "hsl(300, 25%, 27%)", bgcolor: "hsl(300, 25%, 22%)" },
    system:     { color: "hsl(320, 40%, 20%)", bgcolor: "hsl(320, 40%, 16%)" },
    params:     { color: "hsl(320, 84.50%, 25%)", bgcolor: "hsl(320, 84%, 20%)" },
}

export const LO_NODES_DEFAULTS = {

    // misc
    "LoTexts"           : LO_COLORS_DEF.blue,
    "LoGetVideoProps"   : LO_COLORS_DEF.magenta,
    "LoSetVideoProps"   : LO_COLORS_DEF.magenta,

    // calc
    "LoEvals"       : LO_COLORS_DEF.basic,
    "LoCompareNum"  : LO_COLORS_DEF.basic,
    "LoRandomNum"   : LO_COLORS_DEF.basic,
    "LoRandomBool"  : LO_COLORS_DEF.basic,
    "LoNotBool"     : LO_COLORS_DEF.basic,
    "LoIsEmpty"     : LO_COLORS_DEF.basic,

    // utils
    "LoSwitcher"    : LO_COLORS_DEF.basic,
    "LoCounter"     : LO_COLORS_DEF.basic,
    "LoLog"         : { ...LO_COLORS_DEF.dark, shape: 1 },
    "LoBeep"        : { ...LO_COLORS_DEF.dark, shape: 1 },

    // convert
    "LoToInt"       : LO_COLORS_DEF.basic,
    "LoToStr"       : LO_COLORS_DEF.basic,
    "LoToFloat"     : LO_COLORS_DEF.basic,
    "LoToBool"      : LO_COLORS_DEF.basic,

    // replacers
    "LoReplaceVars"     : LO_COLORS_DEF.basic,
    "LoReplacers"       : LO_COLORS_DEF.basic,
    "LoReplacersApply"  : LO_COLORS_DEF.basic,
    "LoReplaceAny"      : LO_COLORS_DEF.basic,

    // lists
    "LoSetList"     : LO_COLORS_DEF.basic,
    "LoFromList"    : LO_COLORS_DEF.basic,
    "LoStrList"     : LO_COLORS_DEF.basic,
    "LoNumList"     : LO_COLORS_DEF.basic,
    "LoListLen"     : LO_COLORS_DEF.basic,
    "LoListJoin"    : LO_COLORS_DEF.basic,
    "LoListsMerge"  : LO_COLORS_DEF.basic,

    // system
    "LoMkDir"           : LO_COLORS_DEF.system,
    "LoRmDir"           : LO_COLORS_DEF.system,
    "LoReadDir"         : LO_COLORS_DEF.system,
    "LoFileExists"      : LO_COLORS_DEF.system,
    "LoCountDirImages"  : LO_COLORS_DEF.system,

    // props
    "LoSet"         : { ...LO_COLORS_DEF.params, shape: 1 },
    "LoGet"         : { ...LO_COLORS_DEF.params, shape: 1 },
    "LoSetProps"    : { ...LO_COLORS_DEF.params, shape: 1 },
    "LoGetProps"    : { ...LO_COLORS_DEF.params, shape: 1 },

}
