#---
#
#   Формирует строку из списка
#
#---
class LoListJoin:

    NODE_MAPPINGS = ("LoListJoin", "ListJoin") # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    CATEGORY = "locode/lists"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Join list into a string with a delimiter, prefix and suffix.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "list": ( "LIST", {
                    "tooltip" : "List of strings or any types"
                }),
                "delimiter": ( "STRING", {
                    "default": "\\n",
                    "tooltip": "Delimiter can be any string. You can use `\\n` for new lines and `\\t` for tabs."
                }),
                "prefix": ( "STRING", {
                    "default": "",
                    "tooltip": "Prefix to add to the start of result string."
                }),
                "suffix": ( "STRING", {
                    "default": "",
                    "tooltip": "Suffix to add to the end of result string."
                }),
            },
        }

    RETURN_TYPES = ( "STRING", )
    RETURN_NAMES = ("string",)
    FUNCTION = "execute"


    #
    #   Вычисляем значение
    #
    def execute(self, list: list, prefix: str, suffix: str, delimiter: str):

        # Заменяем символы \n и \t на символы новой строки и табуляции
        delimiter = delimiter.replace("\\n", "\n").replace("\\t", "\t")

        # Преобразуем все элементы списка в строки
        string_list = [str(item) for item in list]

        # Объединяем строки
        concatenated = prefix + delimiter.join(string_list) + suffix

        # Возвращаем
        return (concatenated, )
