from ...utils.anytype import any_type


#---
#
#   Замена значений в тексте
#
#---
class LoReplaceAny:

    NODE_MAPPINGS = ("LoReplaceAny", "Lo:ReplaceAny") # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    CATEGORY = "locode/replacers"
    AUTHOR = "LoCode"
    DESCRIPTION ="""
Replace a value with any type in a string.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "replace":  ( any_type,),
                "find":     ("STRING", { "multiline": False }),
                "string":   ("STRING", {"multiline": True }),
            },
        }

    RETURN_TYPES = ( "STRING", )
    RETURN_NAMES = ("STRING",)
    FUNCTION = "execute"


    #
    #   Вычисляем значение
    #
    def execute(self, string: str, find: str, replace: any_type):
        # Если не задано - возврат строки
        if replace is None:
            return (string, )

        # Заменяем все вхождения find на replace
        result = string.replace(find, str(replace))

        # Возвращаем результат
        return (result,)
