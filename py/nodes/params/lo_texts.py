import json
from ...utils.utils import fit_val


#---
#
#   Список текстов
#
#
#---
class LoTexts:

    NODE_MAPPINGS = ("LoTexts", "Lo:Texts")
    CATEGORY = "locode/params"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Selects text from an array of texts by the `index_seed`.
If the index is out of bounds in either direction, the index is wrapped using modulo.
Outputs:
- `ACTIVE_STRING`: Text of the active tab.
- `INDEX_STRING`: Text at the given index.
- `STRINGS_LIST`: All texts joined into a single string with the delimiter.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "index_seed": ("INT", {
                    "default": 0,
                    "step": 1,
                    "tooltip": """
If the index is out of bounds in either direction, the index is wrapped using modulo.
So if index_seed=10 and array has 7 items, then the result index will be 10 % 7 = 3.
                    """,
                    "placeholder": "index_seed"
                }),
            },
            "hidden": {
                "widget_data": ("STRING", ),
            }
        }


    RETURN_TYPES = ("STRING", "STRING", "LIST")
    RETURN_NAMES = ("ACTIVE_STRING", "INDEX_STRING", "LIST")
    FUNCTION = "execute"


    #
    #   Вычисляем значение
    #
    def execute(self, index_seed: int, widget_data: str) -> tuple[str, str, list[str]]:

        print(widget_data)

        # Разбираем JSON
        try:
            data = json.loads(widget_data) if isinstance(widget_data, str) else (widget_data or {})
        except Exception:
            # Некорректный JSON — возвращаем пустые значения
            print(f"{self.__class__} Bad JSON: ${widget_data}")
            return ("", "", [])

        tabs = data.get("tabs") or []
        active_index = data.get("activeIndex", 0)

        # Формируем список текстов из вкладок без disabled
        texts: list[str] = [(t.get("text") or "") for t in tabs if isinstance(t, dict) and not t.get("disabled")]        

        # Если список пуст — возвращаем пустые значения
        if len(texts) == 0:
            return ("", "", [])

        # Безопасные индексы
        active_index = fit_val(active_index, 0, len(texts) - 1)
        seed_index = index_seed % len(texts)

        # Возвращаем: текст активной вкладки, текст по index_seed, список текстов
        return (texts[active_index], texts[seed_index], texts)

