#---
#
#   Формирует строку из списка строк
#
#---
class LoStrListJoin:
    """
    Формирует строку из списка строк
    """


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "strings_list": ( "LIST", {
                    "tooltip" : "List of strings or any"
                }),
                "delimiter": ( "STRING", {
                    "default": "\\n",
                    "tooltip": "Delimiter can be any string. You can use `\\n` for new lines and `\\t` for tabs."
                }),
            },
        }

    RETURN_TYPES = ( "STRING", )
    RETURN_NAMES = ("string",)
    FUNCTION = "execute"

    CATEGORY = "locode/params"
    AUTHOR = "LoCode"
    DESCRIPTION = """
    Converts a list of strings into a string.
"""


    #
    #   Вычисляем значение
    #
    def execute(self, strings_list: list, delimiter: str):

        # Заменяем символы \n и \t на символы новой строки и табуляции
        delimiter = delimiter.replace("\\n", "\n").replace("\\t", "\t")

        # Преобразуем все элементы списка в строки
        string_list = [str(item) for item in strings_list]

        # Объединяем строки
        concatenated = delimiter.join(string_list)

        # Возвращаем
        return (concatenated, )
