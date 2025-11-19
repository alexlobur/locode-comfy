#---
#
#   Формирует список чисел из строки
#
#---
import math
import re


class LoNumList:

    NODE_MAPPINGS = ("LoNumList", "Lo:NumList")
    CATEGORY = "locode/lists"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Converts a string of numbers into a list of integers and floats.
The delimiter is a comma.
Outputs:
- `int`: List of integers.
- `float`: List of floats.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "string": ("STRING", {"default": "1, 2, 3", "multiline": False }),
            },
        }

    RETURN_TYPES = ( "LIST", "LIST" )
    RETURN_NAMES = ("int_list", "float_list")
    FUNCTION = "execute"


    #
    #   Вычисляем значение
    #
    def execute(self, string: str):

        # Разделяем строку на числа, убираем все что не число
        normalized = re.sub(r'[^0-9+\-.,]', '', string)

        # сжать повторяющиеся запятые и убрать запятые по краям
        normalized = re.sub(r',+', ',', normalized).strip(',')

        # Разделяем строку на числа
        numbers = normalized.split(",")

        # Преобразуем числа в целые и вещественные
        float_numbers = [float(number) for number in numbers]
        int_numbers = [math.floor(number) for number in float_numbers]

        # Возвращаем списки
        return (int_numbers, float_numbers)

