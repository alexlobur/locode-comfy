from .nodes.params.lo_video_params import LoVideoParams, LoVideoGetParams
from .nodes.params.lo_text_array import LoTextArray
from .nodes.calc.lo_eval import LoEval
from .nodes.calc.lo_random_num import LoRandomNum
from .nodes.calc.lo_random_bool import LoRandomBool
from .nodes.calc.lo_compare_num import LoCompareNum
from .nodes.lo_switcher import LoSwitcher
from .nodes.lo_switcher2 import LoSwitcher2


# Загружаем JavaScript и CSS файлы
import os
import json

def load_js():
    js_list = []
    js_path = os.path.join(os.path.dirname(__file__), "widgets")
    if os.path.exists(js_path):
        for js_file in ["text_array_widget.js"]:
            js_file_path = os.path.join(js_path, js_file)
            if os.path.exists(js_file_path):
                js_list.append(f"./custom_nodes/locode/widgets/{js_file}")
    return js_list

def load_css():
    css_list = []
    css_path = os.path.join(os.path.dirname(__file__), "widgets")
    if os.path.exists(css_path):
        for css_file in ["text_array_widget.css"]:
            css_file_path = os.path.join(css_path, css_file)
            if os.path.exists(css_file_path):
                css_list.append(f"./custom_nodes/locode/widgets/{css_file}")
    return css_list


# Регистрируем JS и CSS файлы
WEB_DIRECTORY = os.path.join(os.path.dirname(__file__), "widgets")


# Регистрируем узлы
NODE_CLASS_MAPPINGS = {
    "LoEval": LoEval,
    "LoSwitcher": LoSwitcher,
    "LoSwitcher2": LoSwitcher2,
    "LoCompareNum": LoCompareNum,
    "LoVideoParams": LoVideoParams,
    "LoVideoGetParams": LoVideoGetParams,
    "LoRandomNum": LoRandomNum,
    "LoRandomBool": LoRandomBool,
    "LoTextArray": LoTextArray,
}


# Регистрируем отображаемые имена узлов
NODE_DISPLAY_NAME_MAPPINGS = {
    "LoEval": "Lo:Eval",
    "LoSwitcher": "Lo:Switcher",
    "LoSwitcher2": "Lo:Switcher2(Test)",
    "LoCompareNum": "Lo:CompareNum",
    "LoVideoParams": "Lo:VideoParams",
    "LoVideoGetParams": "Lo:VideoGetParams",
    "LoRandomNum": "Lo:RandomNum",
    "LoRandomBool": "Lo:RandomBool",
    "LoTextArray": "Lo:TextArray",
}
