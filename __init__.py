from .nodes.calc.lo_eval import LoEval
from .nodes.calc.lo_random_num import LoRandomNum
from .nodes.calc.lo_random_bool import LoRandomBool
from .nodes.calc.lo_compare_num import LoCompareNum
from .nodes.calc.lo_is_empty import LoIsEmpty
from .nodes.calc.lo_not_bool import LoNotBool
from .nodes.calc.lo_counter import LoCounter

from .nodes.params.lo_video_props import LoSetVideoProps, LoGetVideoProps
from .nodes.params.lo_get_from_list import LoGetFromList
from .nodes.params.lo_from_list import LoFromList
from .nodes.params.lo_str_list import LoStrList
from .nodes.params.lo_str_list_join import LoStrListJoin
from .nodes.params.lo_num_list import LoNumList
from .nodes.params.lo_to_int import LoToInt
from .nodes.params.lo_to_float import LoToFloat
from .nodes.params.lo_any_list import LoAnyList
from .nodes.params.lo_to_str import LoToStr
from .nodes.params.lo_replace_abc import LoReplaceAbc
from .nodes.params.lo_replace_any import LoReplaceAny

from .nodes.texts.lo_text_array_2 import LoTextArray2
from .nodes.texts.lo_texts import LoTexts
from .nodes.texts.replacers import Replacers

from .nodes.helpers.lo_log import LoLog
from .nodes.helpers.lo_beep import LoBeep
from .nodes.helpers.lo_switcher import LoSwitcher
from .nodes.helpers.lo_switcher2 import LoSwitcher2

from .nodes.system.lo_mkdir import LoMkDir
from .nodes.system.lo_readdir import LoReadDir
from .nodes.system.lo_file_exists import LoFileExists
from .nodes.system.lo_count_dir_images import LoCountDirImages
from .nodes.system.lo_rmdir import LoRmDir


# Регистрируем узлы
NODE_CLASS_MAPPINGS = {
    "LoIsEmpty":         LoIsEmpty,
    "LoNotBool":         LoNotBool,
    "LoSwitcher":        LoSwitcher,
    "LoSwitcher2":       LoSwitcher2,
    "LoCompareNum":      LoCompareNum,
    "LoSetVideoProps":   LoSetVideoProps,
    "LoGetVideoProps":   LoGetVideoProps,
    "LoRandomNum":       LoRandomNum,
    "LoRandomBool":      LoRandomBool,
    "LoTextArray2":      LoTextArray2,
    "LoTexts":           LoTexts,
    "LoStrList":         LoStrList,
    "LoStrListJoin":     LoStrListJoin,
    "LoNumList":         LoNumList,
    "LoGetFromList":     LoGetFromList,
    "LoFromList":        LoFromList,
    "LoToInt":           LoToInt,
    "LoToFloat":         LoToFloat,
    "LoToStr":           LoToStr,
    "LoMkDir":           LoMkDir,
    "LoReadDir":         LoReadDir,
    "LoRmDir":           LoRmDir,
    "LoFileExists":      LoFileExists,
    "LoAnyList":         LoAnyList,
    "LoCountDirImages":  LoCountDirImages,
    "LoReplaceAbc":      LoReplaceAbc,
    "LoReplaceAny":      LoReplaceAny,
    "LoCounter":         LoCounter,
}


# Регистрируем отображаемые имена узлов
NODE_DISPLAY_NAME_MAPPINGS = {
    "LoIsEmpty":         "Lo:IsEmpty",
    "LoNotBool":         "Lo:NotBool",
    "LoSwitcher":        "Lo:Switcher",
    "LoSwitcher2":       "Lo:Switcher2(Test)",
    "LoCompareNum":      "Lo:CompareNum",
    "LoSetVideoProps":   "Lo:SetVideoProps",
    "LoGetVideoProps":   "Lo:GetVideoProps",
    "LoRandomNum":       "Lo:RandomNum",
    "LoRandomBool":      "Lo:RandomBool",
    "LoTextArray2":      "Lo:TextArray2",
    "LoTexts":           "Lo:Texts",
    "LoStrList":         "Lo:StrList",
    "LoStrListJoin":     "Lo:StrListJoin",
    "LoNumList":         "Lo:NumList",
    "LoGetFromList":     "Lo:GetFromList",
    "LoFromList":        "Lo:FromList",
    "LoToInt":           "Lo:ToInt",
    "LoToFloat":         "Lo:ToFloat",
    "LoToStr":           "Lo:ToStr",
    "LoMkDir":           "Lo:MkDir",
    "LoReadDir":         "Lo:ReadDir",
    "LoRmDir":           "Lo:RmDir",
    "LoFileExists":      "Lo:FileExists",
    "LoAnyList":         "Lo:AnyList",
    "LoCountDirImages":  "Lo:CountDirImages",
    "LoReplaceAbc":      "Lo:ReplaceAbc",
    "LoReplaceAny":      "Lo:ReplaceAny",
    "LoCounter":         "Lo:Counter",
}


# Автоматическая регистрация классов с NODE_MAPPINGS
classes = [ Replacers, LoTexts, LoLog, LoBeep, LoEval ]

for cls in classes:
    mapping = getattr(cls, "NODE_MAPPINGS", None)
    node_id, display_name = mapping
    NODE_CLASS_MAPPINGS[node_id] = cls
    NODE_DISPLAY_NAME_MAPPINGS[node_id] = display_name


# Регистрируем JS и CSS файлы
WEB_DIRECTORY = "./web"
__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
