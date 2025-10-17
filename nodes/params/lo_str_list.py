#---
#
#   Формирует список строк из строки
#
#---
class LoStrList:
    """
    Формирует список строк из строки.

    Правила:
      - На вход принимаются:
        - строка (STRING).
      - На выходе:
        - список значений.
    """


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "string": ("STRING", {"default": "1\n 2\n 3\n" }),
                "delimiter": ("STRING", {"default": "\\n" }),
            },
        }

    RETURN_TYPES = ( "LIST", )
    RETURN_NAMES = ("list",)
    FUNCTION = "execute"

    CATEGORY = "locode/params"
    AUTHOR = "LoCode"
    DESCRIPTION = """
    Converts a string of strings into a list of strings.
    The delimiter is a newline.
    Outputs:
    - `string`: List of strings.
"""


    #
    #   Вычисляем значение
    #
    def execute(self, string: str, delimiter: str):

        # Заменяем символы \n и \t на символы новой строки и табуляции
        delimiter = delimiter.replace("\\n", "\n").replace("\\t", "\t")

        # Разделяем строку на строки
        strings = string.split(delimiter)

        # Убираем пустые строки
        strings = [string for string in strings if string.strip()]

        # Возвращаем
        return (strings, )
