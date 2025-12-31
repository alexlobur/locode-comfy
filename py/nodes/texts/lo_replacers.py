import json
from ...utils.anytype import any_type


#---
#
#   Replacers
#
#---
class Replacers:

    NODE_MAPPINGS = ("LoReplacers", "Replacers") # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    CATEGORY = "locode/texts"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Builds a list of `replacers` to replace text in a string.
Can be used immediately or in combination with the `ReplacersApply` node.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "optional": {
                "string": (any_type, {
                    "tooltip": "Any value that can be converted to `STRING`"
                }),
            },
            "hidden": {
                "replacers": ("STRING", ),
            }
        }

    RETURN_TYPES = ("STRING", "LIST")
    RETURN_NAMES = ("string", "replacers")
    FUNCTION = "execute"


    #
    #   Вычисляем значение
    #
    def execute(self, string: str="", replacers: str=""):
        data = json.loads(replacers) if isinstance(replacers, str) else (replacers or [])

        # замена в строке
        if string.lstrip()!="":
            for replacer in data:
                if len(replacer) >= 2 and replacer[0]:
                    string = string.replace(replacer[0], replacer[1])

        # вывод
        return (string, data)