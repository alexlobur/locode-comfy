import time
import random


#---
#
#   Сгенерировать случайное логическое значение.
#
#---
class LoRandomBool:

    NODE_MAPPINGS = ("LoRandomBool", "RandomBool")
    AUTHOR = "LoCode"
    CATEGORY = "locode/calc"
    DESCRIPTION = """
Generate random Bool value with probability `true_weight`
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return time.time()


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "true_weight": ("FLOAT", {"default": 0.5, "min": 0.0, "max": 1.0}),
            },
        }

    RETURN_TYPES = ("BOOLEAN",)
    RETURN_NAMES = ("bool",)
    FUNCTION = "execute"


    def execute(self, true_weight):
        return (random.random() < true_weight,)
