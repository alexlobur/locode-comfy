from ...utils.anytype import any_type


#---
#
#   Проверка данных на None
#
#---
class LoIsNone:

    NODE_MAPPINGS = ("LoIsNone", "Lo:IsNone")
    AUTHOR = "LoCode"
    CATEGORY = "locode/calc"
    DESCRIPTION = """
Check value of any type for None.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "optional": {
                "any": ( any_type, ),
            },
        }

    RETURN_TYPES = ( any_type, "BOOLEAN", )
    RETURN_NAMES = ( "any", "bool",)
    FUNCTION = "execute"

    def execute(self, any=None):
        is_none = any is None
        return (any, is_none,)
    