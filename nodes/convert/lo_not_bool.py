import random

#---
#
#   Инверсия BOOL
#
#---
class LoNotBool:


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        # Сообщаем ComfyUI, что узел изменяется каждый прогон (чтобы не кэшировать результат)
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
    FUNCTION = "compute"
    CATEGORY = "locode/calc"

    def compute(self, value: bool):
        return (not value,)

