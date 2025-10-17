import random

#---
#
#   Сгенерировать случайное логическое значение.
#
#---
class LoRandomBool:
    """Сгенерировать случайное логическое значение.
    Правила:
      - На вход принимается вероятность появления true.
      - На выходе будет число типа BOOLEAN.
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "true_weight": ("FLOAT", {"default": 0.5, "min": 0.0, "max": 1.0}),
            },
        }

    RETURN_TYPES = ("BOOLEAN",)
    RETURN_NAMES = ("boolean",)
    FUNCTION = "compute"
    CATEGORY = "locode/calc"

    @classmethod
    def IS_CHANGED(cls):
        # Сообщаем ComfyUI, что узел изменяется каждый прогон (чтобы не кэшировать результат)
        return random.random()

    def compute(self, true_weight):
        result = random.random() < true_weight
        return (result,)
