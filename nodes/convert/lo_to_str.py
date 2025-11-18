from ...utils.anytype import any_type
import math

#---
#
#   Преобразует любой тип в строку
#
#---

class LoToStr:
    """
    Преобразует любой тип в строку.
    """

    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "any_type": (any_type, ),
            },
        }

    RETURN_TYPES = ( "STRING", )
    RETURN_NAMES = ("string", )
    FUNCTION = "execute"

    CATEGORY = "locode/params"
    AUTHOR = "LoCode"
    DESCRIPTION = """
    Converts any type to a string.
"""


    #
    #   Вычисляем значение
    #
    def execute(self, any_type: any_type):
        return (str(any_type),)
