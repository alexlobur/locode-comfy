import json
from ...utils.anytype import any_type


#---
#
#   Replacers
#
#---
class Replacers:

    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "optional": {
                "string": (any_type,),
            },
            "hidden": {
                "widget_data": ("STRING", ),
            }
        }

    RETURN_TYPES = ("STRING", "LIST")
    RETURN_NAMES = ("STRING", "replacers")
    FUNCTION = "execute"

    # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    NODE_MAPPINGS = ("LoReplacers", "Lo:Replacers")
    CATEGORY = "locode/params"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Builds a list of replacement pairs in the format [["find", "replace"], ...].
"""

    #
    #   Вычисляем значение
    #
    def execute(self, string: str, widget_data: str) -> tuple[str, list[str]]:

        print(f"widget_data: {widget_data}")

        # # Ожидается, что метод вернёт исходную строку и список пар замен
        # try:
        #     payload = json.loads(widget_data) if isinstance(widget_data, str) else (widget_data or {})
        # except Exception:
        #     # Если JSON не распарсился, возвращаем исходную строку и пустой список замен
        #     return (string or "", [])

        # raw_pairs = payload.get("replacers") or []

        # # Приводим пары к ожидаемому формату [[find, replace], ...]
        # normalized_pairs: list[list[str]] = []
        # for pair in raw_pairs:
        #     if not isinstance(pair, (list, tuple)) or len(pair) < 2:
        #         # Пропускаем некорректные элементы
        #         continue
        #     find_text = pair[0] if isinstance(pair[0], str) else str(pair[0])
        #     replace_text = pair[1] if isinstance(pair[1], str) else str(pair[1])
        #     normalized_pairs.append([find_text, replace_text])

        return (string or "", [])