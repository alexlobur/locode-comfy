from ...utils.anytype import any_type


#---
#
#   Преобразует любой тип в вещественное число
#
#---
class LoToFloat:

    NODE_MAPPINGS = ("LoToFloat", "Lo:ToFloat")
    AUTHOR = "LoCode"
    CATEGORY = "locode/convert"
    DESCRIPTION = """
Converts any type to Float number.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - -


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


    RETURN_TYPES = ( "FLOAT", )
    RETURN_NAMES = ("float",)
    FUNCTION = "execute"


    #
    #   Вычисляем значение
    #
    def execute(self, any_type: any_type):
        return (float(any_type),)

