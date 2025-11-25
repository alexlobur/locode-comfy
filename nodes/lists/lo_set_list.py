from ...utils.anytype import any_type


#---
#
#   Формирует список из входных данных
#
#---
class LoSetList:

    NODE_MAPPINGS = ("LoSetList", "Lo:SetList") # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    CATEGORY = "locode/lists"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Converts any types into a list of any types.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "hidden": {
                "inputs_prefix": "any"
            }
        }

    RETURN_TYPES = ("LIST", "INT")
    RETURN_NAMES = ("list", "length")
    FUNCTION = "execute"


    def execute(self, **kwargs):

        # Возвращаем результат
        result = list(kwargs.values())
        length = len(result)

        return (result, length, )

