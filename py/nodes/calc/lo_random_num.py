import time
import random


#---
#
#   Сгенерировать случайное число.
#
#---
class LoRandomNum:

    NODE_MAPPINGS = ("LoRandomNum", "RandomNum")
    AUTHOR = "LoCode"
    CATEGORY = "locode/calc"
    DESCRIPTION = """
Generate random Int and Float value
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return time.time()


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "min": ("FLOAT", {"default": 0.0 }),
                "max": ("FLOAT", {"default": 1.0 }),
            },
        }

    RETURN_TYPES = ("INT", "FLOAT")
    RETURN_NAMES = ("int", "float")
    FUNCTION = "execute"
    CATEGORY = "locode/calc"


    def execute(self, min, max):
        result = min +random.random() * (max - min)
        return (int(round(result)), float(result))
