from ...utils.anytype import any_type


#---
#
#   Преобразует любой тип в строку
#
#---

class LoToStr:

    NODE_MAPPINGS = ("LoToStr", "Lo:ToStr")
    AUTHOR = "LoCode"
    CATEGORY = "locode/convert"
    DESCRIPTION = """
Converts any type to a string.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


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
    def execute(self, any_type: any_type):
        return (str(any_type),)
