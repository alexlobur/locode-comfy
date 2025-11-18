import random

#---
#
#   Сгенерировать случайное число.
#
#---
class LoRandomNum:

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
    FUNCTION = "compute"
    CATEGORY = "locode/calc"


    def compute(self, min, max):
        result = min +random.random() * (max - min)
        return (int(round(result)), float(result))
