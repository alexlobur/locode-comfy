from ...utils.anytype import any_type


#---
#
#   ReplacersUpply
#
#---
class ReplacersApply:

    NODE_MAPPINGS = ("LoReplacersApply", "ReplacersApply") # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    CATEGORY = "locode/replacers"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Applying Replacers from Lo:Replacers to a String
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "string":    (any_type,),
                "replacers": ("LIST",),
            },
        }

    RETURN_TYPES = ("STRING", )
    RETURN_NAMES = ("STRING", )
    FUNCTION = "execute"


    #
    #   Вычисляем значение
    #
    def execute(self, string: str, replacers: list):
        # замена в строке
        if string.lstrip()!="":
            for replacer in replacers:
                if len(replacer) >= 2 and replacer[0]:
                    string = string.replace(replacer[0], replacer[1])
        # вывод
        return (string, )
