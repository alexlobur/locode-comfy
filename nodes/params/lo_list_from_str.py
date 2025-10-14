#---
#
#   Формирует список чисел из строки
#
#---
class LoNumListFromStr:
    """
    Формирует список чисел из строки.

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
                "string": ("STRING", {"default": "1, 2, 3", "multiline": True }),
            },
        }

    RETURN_TYPES = ( "INT", "FLOAT" )
    RETURN_NAMES = ("int", "float")
    FUNCTION = "execute"

    CATEGORY = "locode"
    AUTHOR = "LoCode"
    DESCRIPTION = """
    Converts a string of numbers into a list of integers and floats.
    The delimiter is a comma.
    Outputs:
    - `int`: List of integers.
    - `float`: List of floats.
"""


    #
    #   Вычисляем значение
    #
    def execute(self, string: str):

        # Разделяем строку на числа
        numbers = string.split(",")

        # Преобразуем числа в целые и вещественные
        int_numbers = [int(number) for number in numbers]
        float_numbers = [float(number) for number in numbers]

        # Возвращаем списки
        return (int_numbers, float_numbers)


#---
#
#   Формирует список строк из строки
#
#---
class LoListFromStr:
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

    RETURN_TYPES = ( "STRING", )
    RETURN_NAMES = ("string",)
    FUNCTION = "execute"

    CATEGORY = "locode"
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
