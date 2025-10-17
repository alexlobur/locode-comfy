from ...utils.anytype import any_type
import math

#---
#
#   Преобразует любой тип в вещественное число
#
#---

class LoToFloat:
    """
    Преобразует любой тип в вещественное число.
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

    RETURN_TYPES = ( "FLOAT" )
    RETURN_NAMES = ("float",)
    FUNCTION = "execute"

    CATEGORY = "locode/params"
    AUTHOR = "LoCode"
    DESCRIPTION = """
    Converts any type to an integer.
    Outputs:
    - `int`: Integer value.
"""


    #
    #   Вычисляем значение
    #
    def execute(self, any_type: any_type):

        return (float(any_type),)

