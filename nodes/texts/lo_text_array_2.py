from ...utils.utils import fit_value


#---
#
#   Массив текстов
#
#
#---
class LoTextArray2:
    """
    Массив текстов с закладками.

    Правила:
      - На вход принимаются:
        - индекс (INT).
        - разделитель строк (STRING).
        - данные из виджета (DICT).
      - На выходе:
        - текст в зависимости от индекса.
        - текст активной вкладки.
        - весь текст, объединенный в одну строку с разделителем.
    """


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "index_seed": ("INT", {"default": 0, "step": 1 }),
                "concatenate_delimiter": ("STRING", {"default": "\\n" }),
            },
            "hidden": {
                "widget_data": ("*"),
            }
        }

    RETURN_TYPES = ("STRING", "STRING", "STRING", "LIST")
    RETURN_NAMES = ("INDEX_STRING", "ACTIVE_TAB_STRING", "CONCATENATE", "LIST")
    FUNCTION = "execute"

    CATEGORY = "locode/params"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Selects text from an array of texts by the `seed_index`.
If the index is out of bounds in either direction, the index is wrapped using modulo.
So if index_seed=10 and array has 7 items, then the result index will be 10 % 7 = 3.
Delimiter can be any string. You can use `\\n` for new lines and `\\t` for tabs.
Outputs:
- `INDEX_STRING`: Text at the given index.
- `TAB_STRING`: Text of the active tab.
- `CONCATENATE`: All texts joined into a single string with the delimiter.
"""


    #
    #   Вычисляем значение
    #
    def execute(self, index_seed: int, concatenate_delimiter: str, widget_data: dict) -> tuple[str, str, str]:
        """
        Вычисляем значение.

        Args:
            - `index_seed` (int): Индекс текста
            - `delimiter` (str): Разделитель строк
            - `widget_data` (dict): Данные из виджета в формате { "texts": [...], "activeTab": int }
        """

        # Получаем данные из виджета
        texts = widget_data.get("texts")
        active_tab = widget_data.get("activeTab")

        # Если массив пустой, возвращаем пустые строки
        if len(texts) == 0:
            return ('', '', '')

        # Безопасные границы для активной вкладки
        active_tab = fit_value(active_tab, len(texts) - 1, 0)

        # Заменяем символы \n и \t на символы новой строки и табуляции
        delimiter = concatenate_delimiter.replace("\\n", "\n").replace("\\t", "\t")

        # Вычисляем значения
        selected_by_index = texts[index_seed % len(texts)]
        active_string = texts[active_tab]
        concatenated = delimiter.join(texts)

        return (selected_by_index, active_string, concatenated, texts)
