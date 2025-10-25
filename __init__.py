from .nodes.params.lo_video_props import LoSetVideoProps, LoGetVideoProps
from .nodes.helpers.lo_log import LoLog
from .nodes.params.lo_text_array_2 import LoTextArray2
from .nodes.calc.lo_eval import LoEval
from .nodes.calc.lo_random_num import LoRandomNum
from .nodes.calc.lo_random_bool import LoRandomBool
from .nodes.calc.lo_compare_num import LoCompareNum
from .nodes.helpers.lo_switcher import LoSwitcher
from .nodes.helpers.lo_switcher2 import LoSwitcher2
from .nodes.params.lo_get_from_list import LoGetFromList
from .nodes.params.lo_str_list import LoStrList
from .nodes.params.lo_num_list import LoNumList
from .nodes.params.lo_to_int import LoToInt
from .nodes.params.lo_to_float import LoToFloat
from .nodes.params.lo_to_str import LoToStr
from .nodes.test.lo_test import LoTest


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
    "LoStrList":         LoStrList,
    "LoNumList":         LoNumList,
    "LoGetFromList":     LoGetFromList,
    "LoToInt":           LoToInt,
    "LoToFloat":         LoToFloat,
    "LoToStr":           LoToStr,
    "LoTest":            LoTest,
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
    "LoStrList":         "Lo:StrList",
    "LoNumList":         "Lo:NumList",
    "LoGetFromList":     "Lo:GetFromList",
    "LoToInt":           "Lo:ToInt",
    "LoToFloat":         "Lo:ToFloat",
    "LoToStr":           "Lo:ToStr",
    "LoTest":            "Lo:Test",
}


# Регистрируем JS и CSS файлы
WEB_DIRECTORY = "./web"
__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
