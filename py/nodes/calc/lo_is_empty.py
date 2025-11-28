from ...utils.anytype import any_type


#---
#
#   Проверка данных на пустоту
#
#---
class LoIsEmpty:

    NODE_MAPPINGS = ("LoIsEmpty", "Lo:IsEmpty")
    AUTHOR = "LoCode"
    CATEGORY = "locode/calc"
    DESCRIPTION = """
Check value of any type for Empty.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "any": ( any_type, ),
            },
        }

    RETURN_TYPES = ("BOOLEAN",)
    RETURN_NAMES = ("bool",)
    FUNCTION = "execute"

    def execute(self, any):
        is_empty = any is None or (isinstance(any, str) and any.strip() == "")
        return (is_empty,)