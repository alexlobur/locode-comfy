from ...utils.anytype import any_type


#---
#
#   Преобразует любой тип в вещественное число
#
#---
class LoToFloat:

    NODE_MAPPINGS = ("LoToFloat", "ToFloat")
    AUTHOR = "LoCode"
    CATEGORY = "locode/convert"
    DESCRIPTION = """
Converts any type to `Float` number.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "any": (any_type, ),
            },
        }


    RETURN_TYPES = ( "FLOAT", )
    RETURN_NAMES = ("float",)
    FUNCTION = "execute"


    #
    #   Вычисляем значение
    #
    def execute(self, any: any_type):
        try:
            # преобразуем любой тип в число
            return (float(any), )
        except ValueError:
            raise ValueError(f"Invalid any: {any}. Must be a number like.")
