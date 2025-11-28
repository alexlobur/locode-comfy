from ...utils.anytype import *


class LoReplaceVars:

    NODE_MAPPINGS = ("LoReplaceVars", "Lo:ReplaceVars") # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    CATEGORY = "locode/replacers"
    AUTHOR = "LoCode"
    DESCRIPTION ="""
Replaces parameters in a string enclosed in curly braces, for example: `Hello, {var0}!`.
The parameter name is taken from the input name (or label, if exists).
You can redefine the parameter (input label) name using the context menu > "Rename Slot".
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "string": ("STRING", {"default": "Hello, {var0}!", "multiline": True }),
            },
            "hidden": {
                "labels_of_vars": ("DICT", )
            }
        }

    RETURN_TYPES = ( "STRING", )
    RETURN_NAMES = ("string", )
    FUNCTION = "execute"


    def execute(self, string: str, labels_of_vars: dict, **kwargs):
        result = string

        # производим замену значений
        for key, value in kwargs.items():
            # получаем значение имени (если есть key в labels_of_vars, то будет взято из label)
            name = labels_of_vars.get(key, key)

            # Преобразуем значение в строку
            replace = str(value) if value is not None else ""
            result = result.replace("{"+name+"}", replace)

        # Возвращаем результат
        return (result,)

