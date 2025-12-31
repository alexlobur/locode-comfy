from ...utils.anytype import any_type


#---
#
#   Преобразует любой тип в строку
#
#---

class LoToStr:

    NODE_MAPPINGS = ("LoToStr", "ToStr")
    AUTHOR = "LoCode"
    CATEGORY = "locode/convert"
    DESCRIPTION = """
Converts any type to a string.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "any": (any_type, ),
            },
        }


    RETURN_TYPES = ( "STRING", )
    RETURN_NAMES = ("string", )
    FUNCTION = "execute"

    #
    #   Вычисляем значение
    #
    def execute(self, any: any_type):
        return (str(any),)
