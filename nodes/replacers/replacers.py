import json
from ...utils.anytype import any_type


#---
#
#   Replacers
#
#---
class Replacers:

    NODE_MAPPINGS = ("LoReplacers", "Lo:Replacers") # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    CATEGORY = "locode/replacers"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Builds a list of replacement pairs in the format [["find", "replace"], ...].
"""

    #----

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
                "replacers": ("STRING", ),
            }
        }

    RETURN_TYPES = ("STRING", "LIST")
    RETURN_NAMES = ("STRING", "replacers")
    FUNCTION = "execute"


    #
    #   Вычисляем значение
    #
    def execute(self, string: str="", replacers: str=""):
        data = json.loads(replacers) if isinstance(replacers, str) else (replacers or [])

        # замена в строке
        if string.lstrip()!="":
            for replacer in data:
                print(f"замена в строке: ${replacer}")
                if len(replacer) >= 2 and replacer[0]:
                    string = string.replace(replacer[0], replacer[1])

        # вывод
        return (string, data)