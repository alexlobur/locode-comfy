from .py.nodes.calc.lo_eval import LoEval
from .py.nodes.calc.lo_evals import LoEvals
from .py.nodes.calc.lo_compare_num import LoCompareNum
from .py.nodes.calc.lo_random_num import LoRandomNum
from .py.nodes.calc.lo_random_bool import LoRandomBool
from .py.nodes.calc.lo_is_empty import LoIsEmpty
from .py.nodes.calc.lo_is_none import LoIsNone

from .py.nodes.convert.lo_not_bool import LoNotBool
from .py.nodes.convert.lo_to_int import LoToInt
from .py.nodes.convert.lo_to_bool import LoToBool
from .py.nodes.convert.lo_to_float import LoToFloat
from .py.nodes.convert.lo_to_str import LoToStr

from .py.nodes.lists.lo_from_list import LoFromList
from .py.nodes.lists.lo_str_list import LoStrList
from .py.nodes.lists.lo_list_join import LoListJoin
from .py.nodes.lists.lo_lists_merge import LoListsMerge
from .py.nodes.lists.lo_num_list import LoNumList
from .py.nodes.lists.lo_list_len import LoListLen
from .py.nodes.lists.lo_set_list import LoSetList

from .py.nodes.replacers.lo_replace_vars import LoReplaceVars
from .py.nodes.replacers.lo_replacers import Replacers
from .py.nodes.replacers.lo_replacers_apply import ReplacersApply

from .py.nodes.utils.lo_log import LoLog
from .py.nodes.utils.lo_beep import LoBeep
from .py.nodes.utils.lo_switcher import LoSwitcher
from .py.nodes.utils.lo_counter import LoCounter

from .py.nodes.params.lo_set_get_props import LoSetProps, LoGetProps
from .py.nodes.params.lo_texts import LoTexts
from .py.nodes.params.lo_video_props import LoSetVideoProps, LoGetVideoProps

from .py.nodes.system.lo_mkdir import LoMkDir
from .py.nodes.system.lo_readdir import LoReadDir
from .py.nodes.system.lo_file_exists import LoFileExists
from .py.nodes.system.lo_count_dir_images import LoCountDirImages
from .py.nodes.system.lo_rmdir import LoRmDir



# Регистрируем узлы
NODE_CLASS_MAPPINGS = {}

# Регистрируем отображаемые имена узлов
NODE_DISPLAY_NAME_MAPPINGS = {}


# Автоматическая регистрация классов с NODE_MAPPINGS
classes = [
    # lists
    LoSetList, LoListLen, LoListJoin, LoStrList, LoNumList, LoFromList, LoListsMerge,
    # replacers
    Replacers, ReplacersApply, LoReplaceVars,
    # calc
    LoEval, LoEvals, LoCompareNum, LoIsEmpty, LoIsNone, LoRandomNum, LoRandomBool,
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
