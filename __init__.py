from .nodes.params.lo_video_props import LoSetVideoProps, LoGetVideoProps
from .nodes.helpers.lo_log import LoLog
from .nodes.params.lo_text_array_2 import LoTextArray2
from .nodes.calc.lo_eval import LoEval
from .nodes.calc.lo_random_num import LoRandomNum
from .nodes.calc.lo_random_bool import LoRandomBool
from .nodes.calc.lo_compare_num import LoCompareNum
from .nodes.lo_switcher import LoSwitcher
from .nodes.lo_switcher2 import LoSwitcher2
from .nodes.params.lo_list_from_str import LoListFromStr, LoNumListFromStr
from .nodes.params.lo_get_from_list import LoGetFromList


# Регистрируем узлы
NODE_CLASS_MAPPINGS = {
    "LoLog":             LoLog,
    "LoEval":            LoEval,
    "LoSwitcher":        LoSwitcher,
    "LoSwitcher2":       LoSwitcher2,
    "LoCompareNum":      LoCompareNum,
    "LoSetVideoProps":   LoSetVideoProps,
    "LoGetVideoProps":   LoGetVideoProps,
    "LoRandomNum":       LoRandomNum,
    "LoRandomBool":      LoRandomBool,
    "LoTextArray2":      LoTextArray2,
    "LoListFromStr":     LoListFromStr,
    "LoNumListFromStr":  LoNumListFromStr,
    "LoGetFromList":     LoGetFromList,
}


# Регистрируем отображаемые имена узлов
NODE_DISPLAY_NAME_MAPPINGS = {
    "LoLog":             "Lo:Log",
    "LoEval":            "Lo:Eval",
    "LoSwitcher":        "Lo:Switcher",
    "LoSwitcher2":       "Lo:Switcher2(Test)",
    "LoCompareNum":      "Lo:CompareNum",
    "LoSetVideoProps":   "Lo:SetVideoProps",
    "LoGetVideoProps":   "Lo:GetVideoProps",
    "LoRandomNum":       "Lo:RandomNum",
    "LoRandomBool":      "Lo:RandomBool",
    "LoTextArray2":      "Lo:TextArray2",
    "LoListFromStr":     "Lo:ListFromStr",
    "LoNumListFromStr":  "Lo:NumListFromStr",
    "LoGetFromList":     "Lo:GetFromList",
}


# Регистрируем JS и CSS файлы
WEB_DIRECTORY = "./web"
__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
