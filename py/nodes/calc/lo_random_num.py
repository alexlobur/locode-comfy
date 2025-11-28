import random


#---
#
#   Сгенерировать случайное число.
#
#---
class LoRandomNum:

    NODE_MAPPINGS = ("LoRandomNum", "Lo:RandomNum")
    AUTHOR = "LoCode"
    CATEGORY = "locode/calc"
    DESCRIPTION = """
Generate random Int and Float value
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        # Сообщаем ComfyUI, что узел изменяется каждый прогон (чтобы не кэшировать результат)
        return True

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "min": ("FLOAT",),
                "max": ("FLOAT",),
            },
        }

    RETURN_TYPES = ("INT", "FLOAT")
    RETURN_NAMES = ("int", "float")
    FUNCTION = "execute"
    CATEGORY = "locode/calc"


    def execute(self, min, max):
        result = min +random.random() * (max - min)
        return (int(round(result)), float(result))
