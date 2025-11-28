#---
#
#   Двух-позиционный счетчик
#
#---
class LoCounter:

    NODE_MAPPINGS = ("LoCounter", "Lo:Counter") # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    AUTHOR = "LoCode"
    CATEGORY = "locode/utils"
    DESCRIPTION = """
Two-position counter.
When minor becomes greater than max_minor, it resets to zero, and major is incremented.
"""

    # ---


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "major": ("INT", {"default": 0}),
                "minor": ("INT", {"default": 0}),
                "max_minor": ("INT", {"min": 0, "default": 5}),
            },
        }

    RETURN_TYPES = ( "INT", "INT", "INT", )
    RETURN_NAMES = ("major", "minor", "max_minor", )
    FUNCTION = "execute"


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    def execute(self, major: int, minor: int, max_minor: int):
        # проверка, выходит ли за границы minor, если вдруг max_minor задано другим нодом
        if minor > max_minor:
            minor = max_minor
        return ( major, minor, max_minor )

