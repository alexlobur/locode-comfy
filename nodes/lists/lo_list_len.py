#---
#
#   Получить количество элементов в списке
#
#
#---
class LoListLen:

    NODE_MAPPINGS = ("LoListLen", "Lo:ListLen") # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    CATEGORY = "locode/lists"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Count items in list
"""

    # ---


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "any_list": ("LIST", {"default": [], "tooltip": "List of values" }),
            },
        }


    RETURN_TYPES = ( "INT", )
    RETURN_NAMES = ("count", )
    FUNCTION = "execute"


    #
    #   Вычисляем значение
    #
    def execute(self, any_list: list ):
        return (len(any_list), )


