from ...utils.anytype import any_type
import math

#---
#
#   Преобразует любой тип в целое число
#
#---

class LoToInt:

    NODE_MAPPINGS = ("LoToInt", "ToInt")
    AUTHOR = "LoCode"
    CATEGORY = "locode/convert"
    DESCRIPTION = """
Converts any type to an Integer.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "any": (any_type, ),
                "method": (["floor", "ceil", "round"], {"default": "floor"}),
            },
        }


    RETURN_TYPES = ( "INT", )
    RETURN_NAMES = ("int", )
    FUNCTION = "execute"


    #
    #   Вычисляем значение
    #
    def execute(self, any_type: any_type, method: str):

        try:
            # преобразуем любой тип в число
            number = float(any_type)
        except ValueError:
            raise ValueError(f"Invalid any_type: {any_type}. Must be a number.")

        if method == "floor":
            return (int(math.floor(number)),)
        elif method == "ceil":
            return (int(math.ceil(number)),)
        elif method == "round":
            return (int(round(number)),)
        else:
            raise ValueError(f"Invalid method: {method}. Must be 'floor', 'ceil' or 'round'.")
