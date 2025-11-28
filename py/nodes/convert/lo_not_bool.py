import random

#---
#
#   Инверсия BOOL
#
#---
class LoNotBool:

    NODE_MAPPINGS = ("LoNotBool", "Lo:NotBool")
    AUTHOR = "LoCode"
    CATEGORY = "locode/convert"
    DESCRIPTION = """
Returns inverted Bool value
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    DEPRECATED = True

    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "value": ("BOOLEAN", ),
            },
        }


    RETURN_TYPES = ("BOOLEAN",)
    RETURN_NAMES = ("bool",)
    FUNCTION = "execute"
    CATEGORY = "locode/calc"


    def execute(self, value: bool):
        return (not value,)

