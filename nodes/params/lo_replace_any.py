from ...utils.anytype import any_type


#---
#
#   Замена значений в тексте
#
#---
class LoReplaceAny:

    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "string":   ("STRING", {"multiline": True }),
                "find":     ("STRING", {"default": "{a}, {b}, {c}", "multiline": True }),
                "replace":  ( any_type,),
            },
        }

    RETURN_TYPES = ( "STRING", )
    RETURN_NAMES = ("STRING",)
    FUNCTION = "execute"

    CATEGORY = "locode/params"
    AUTHOR = "LoCode"
    DESCRIPTION ="""
Replace a value with any in a string.
"""


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
