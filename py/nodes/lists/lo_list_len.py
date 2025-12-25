#---
#
#   Получить количество элементов в списке
#
#
#---
class LoListLen:

    NODE_MAPPINGS = ("LoListLen", "ListLen") # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    CATEGORY = "locode/lists"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Count items in list
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "list": ("LIST", {"default": [], "tooltip": "List of values" }),
            },
        }


    RETURN_TYPES = ( "INT", )
    RETURN_NAMES = ("count", )
    FUNCTION = "execute"


    #
    #   Вычисляем значение
    #
    def execute(self, list: list ):
        return (len(list), )


