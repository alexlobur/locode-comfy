import random

#---
#
#   Сгенерировать случайное число.
#
#---
class LoRandomNum:
    """Сгенерировать случайное число.
    Правила:
      - На вход принимаются минимальное и максимальное значения.
      - На выходе будет число типа INT и FLOAT.
    """

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

    @classmethod
    def IS_CHANGED(cls):
        # Сообщаем ComfyUI, что узел изменяется каждый прогон (чтобы не кэшировать результат)
        return random.random()

    def compute(self, min, max):
        result = min +random.random() * (max - min)
        return (int(round(result)), float(result))
