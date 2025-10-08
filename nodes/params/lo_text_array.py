from ...utils.anytype import any_type


#---
#
#   Массив текстов
#
#
#---
class LoTextArray:
    """Массив текстов.

    Правила:
      - На вход принимается индекс (INT).
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
                "index_seed": ("INT", {"default": 0, "step": 1}),
            },
            "hidden": {
                "text_array": ("*"),
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("STRING",)
    FUNCTION = "compute"
    CATEGORY = "locode"
    AUTHOR = "LoCode"
    DEPRECATED = True

    OUTPUT_NODE = True
    DESCRIPTION = """
        Выбирает текст из массива текстов по индексу `seed_index`.
        Если индекс выходит за пределы массива в любую сторону, то берется индекс по модулю.
    """


    def compute(self, index_seed, text_array=None):

        # Если text_array не передан или пустой, возвращаем пустую строку
        if not text_array:
            return ("",)

        # Получаем значения из массива
        values = text_array['__value__']

        print(f"index_seed: {index_seed}, text_array: {text_array}, values: {values}")

        # Проверяем, что есть хотя бы один непустой текст
        if len(values) == 0:
            return ("",)

        # Возвращаем текст по индексу, вычисленному по модулю
        return (values[index_seed % len(values)],)
