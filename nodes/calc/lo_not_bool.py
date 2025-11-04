import random

#---
#
#   Инверсия BOOL
#
#---
class LoNotBool:

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "value": ("BOOLEAN", ),
            },
        }

    RETURN_TYPES = ("BOOLEAN",)
    RETURN_NAMES = ("bool",)
    FUNCTION = "compute"
    CATEGORY = "locode/calc"

    @classmethod
    def IS_CHANGED(cls):
        # Сообщаем ComfyUI, что узел изменяется каждый прогон (чтобы не кэшировать результат)
        return True

    def compute(self, value: bool):
        return (not value,)

