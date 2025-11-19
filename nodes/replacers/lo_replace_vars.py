from ...utils.anytype import *


class LoReplaceVars:

    NODE_MAPPINGS = ("LoReplaceVars", "Lo:ReplaceVars") # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    CATEGORY = "locode/replacers"
    AUTHOR = "LoCode"
    DESCRIPTION ="""
Replace a values in a string. Set value in curly bracers: `Hello, {var0}!`
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
            }
        }

    RETURN_TYPES = ( "STRING", )
    RETURN_NAMES = ("STRING",)
    FUNCTION = "execute"


    def execute(self, string: str, **kwargs):
        result = string

        # производим замену значений
        for key, value in kwargs.items():
            # Преобразуем значение в строку
            replace = str(value) if value is not None else ""
            result = result.replace("{"+key+"}", replace)

        # Возвращаем результат
        return (result,)

