from .nodes.calc.lo_eval import LoEval
from .nodes.calc.lo_evals import LoEvals
from .nodes.calc.lo_compare_num import LoCompareNum
from .nodes.calc.lo_random_num import LoRandomNum
from .nodes.calc.lo_random_bool import LoRandomBool
from .nodes.calc.lo_is_empty import LoIsEmpty

from .nodes.convert.lo_not_bool import LoNotBool
from .nodes.convert.lo_to_int import LoToInt
from .nodes.convert.lo_to_bool import LoToBool
from .nodes.convert.lo_to_float import LoToFloat
from .nodes.convert.lo_to_str import LoToStr

from .nodes.lists.lo_from_list import LoFromList
from .nodes.lists.lo_str_list import LoStrList
from .nodes.lists.lo_list_join import LoListJoin
from .nodes.lists.lo_num_list import LoNumList
from .nodes.lists.lo_list_len import LoListLen
from .nodes.lists.lo_set_list import LoSetList

from .nodes.replacers.lo_replace_vars import LoReplaceVars
from .nodes.replacers.lo_replacers import Replacers
from .nodes.replacers.lo_replacers_apply import ReplacersApply

from .nodes.utils.lo_log import LoLog
from .nodes.utils.lo_beep import LoBeep
from .nodes.utils.lo_switcher import LoSwitcher
from .nodes.utils.lo_counter import LoCounter

from .nodes.params.lo_set_get_props import LoSetProps, LoGetProps
from .nodes.params.lo_texts import LoTexts
from .nodes.params.lo_video_props import LoSetVideoProps, LoGetVideoProps

from .nodes.system.lo_mkdir import LoMkDir
from .nodes.system.lo_readdir import LoReadDir
from .nodes.system.lo_file_exists import LoFileExists
from .nodes.system.lo_count_dir_images import LoCountDirImages
from .nodes.system.lo_rmdir import LoRmDir



# Регистрируем узлы
NODE_CLASS_MAPPINGS = {}

# Регистрируем отображаемые имена узлов
NODE_DISPLAY_NAME_MAPPINGS = {}


# Автоматическая регистрация классов с NODE_MAPPINGS
classes = [
    # lists
    LoSetList, LoListLen, LoListJoin, LoStrList, LoNumList, LoFromList,
    # replacers
    Replacers, ReplacersApply, LoReplaceVars,
    # calc
    LoEval, LoEvals, LoCompareNum, LoIsEmpty, LoRandomNum, LoRandomBool,
    # convert
    LoNotBool, LoToInt, LoToFloat, LoToStr, LoToBool,
    # utils
    LoLog, LoBeep, LoSwitcher, LoCounter,

    # system
    LoMkDir, LoReadDir, LoRmDir, LoFileExists, LoCountDirImages,

    # params
    LoSetProps, LoGetProps, LoSetVideoProps, LoGetVideoProps, LoTexts,
]


for cls in classes:
    mapping = getattr(cls, "NODE_MAPPINGS", None)
    node_id, display_name = mapping
    NODE_CLASS_MAPPINGS[node_id] = cls
    NODE_DISPLAY_NAME_MAPPINGS[node_id] = display_name


# Регистрируем JS и CSS файлы
WEB_DIRECTORY = "./web"
__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]


# TODO: 
# - Evals - дать описаение...
# - ReplaceVars -> Replace ?
