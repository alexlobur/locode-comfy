from ...utils.anytype import any_type
import math

#---
#
#   Преобразует любой тип в целое число
#
#---

class LoToInt:
    """
    Преобразует любой тип в целое число.
    """

    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "any_type": (any_type, ),
                "method": (["floor", "ceil", "round"], {"default": "floor"}),
            },
        }

    RETURN_TYPES = ( "INT" )
    RETURN_NAMES = ("int",)
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
    def execute(self, any_type: any_type, method: str):

        if method == "floor":
            return (int(math.floor(any_type)),)
        elif method == "ceil":
            return (int(math.ceil(any_type)),)
        elif method == "round":
            return (int(round(any_type)),)
