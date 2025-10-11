from ...utils.anytype import any_type


#---
#
#   Получить значение из списка
#
#
#---
class LoGetFromList:
    """
    Получить значение из списка.

    Правила:
      - На вход принимаются:
        - индекс (INT).
        - список значений (LIST).
        - использовать остаток числа % (BOOLEAN).
      - На выходе:
        - значение из списка.
    """


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "index": ("INT", {"default": 0, "step": 1 }),
                "any_list": ("LIST", {"default": [] }),
                "modulo_index": ("BOOLEAN", {"default": False }),
            },
        }

    RETURN_TYPES = ( any_type, )
    RETURN_NAMES = ("any",)
    FUNCTION = "execute"

    CATEGORY = "locode"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Selects value from a list by the `index`.
If the index is out of bounds in either direction, the index is wrapped using modulo.
So if index=10 and list has 7 items, then the result index will be 10 % 7 = 3.
Outputs:
- `VALUE`: Value from the list.
"""


    #
    #   Вычисляем значение
    #
    def execute(self, index: int, list: list, type: str, modulo_index: bool):
        """
        Вычисляем значение.
        Args:
            - `index` (int): Индекс значения
            - `list` (list): Список значений
            - `type` (str): Тип значения
            - `modulo_index` (bool): Использовать модуль
        """

        # Если список пустой, возвращаем пустое значение
        if len(list) == 0:
            raise ValueError("List is empty")

        # Подгоняем индекс к диапазону значений
        index_final = index % len(list)

        # Вычисляем значения
        return (self.get_value_of_type(list[index_final], type),)


    #
    #   Подгоняем индекс к диапазону значений
    #
    def get_value_of_type(self, value: any, type: str) -> any:
        if type == "INT":
            return int(value)
        elif type == "FLOAT":
            return float(value)
        elif type == "STRING":
            return str(value)
        else:
            return value
