from ..utils.utils import any_type


#---
#
#   Массив текстов
#
#---
class LoTextArray:
    """Массив текстов.

    Правила:
      - На вход принимается счетчик (INT).
      - В списке могут быть пустые текста.
      - На выходе будет значение в зависимости от модуля счетчика и количества значений в списке.
    """


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "counter": ("INT", {"default": 0, "step": 1}),
                "text_array": ("*", {"forceInput": True}),
            },
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("STRING",)
    FUNCTION = "compute"
    CATEGORY = "locode"
    OUTPUT_NODE = True


    def compute(self, counter, text_array=None):
        # Если text_array не передан или пустой, возвращаем пустую строку
        if not text_array:
            return ("",)
        
        # Если text_array - это список, используем его
        if isinstance(text_array, list):
            values = [str(value) for value in text_array if value and str(value).strip() != '']
        else:
            # Если это одиночное значение, преобразуем в список
            values = [str(text_array)] if str(text_array).strip() != '' else []
        
        # Проверяем, что есть хотя бы один непустой текст
        if len(values) == 0:
            return ("",)
        
        # Возвращаем текст по индексу, вычисленному по модулю
        return (values[counter % len(values)],)
