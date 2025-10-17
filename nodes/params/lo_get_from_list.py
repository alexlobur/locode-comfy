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
            },
        }

    RETURN_TYPES = ( any_type, )
    RETURN_NAMES = ("any",)
    FUNCTION = "execute"

    CATEGORY = "locode/params"
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
    def execute(self, index: int, any_list: list):

        # Если список пустой, выбрасываем ошибку
        if len(any_list) == 0:
            raise ValueError("List is empty")

        # Подгоняем индекс к диапазону значений
        index_final = index % len(any_list)

        # значение из списка
        return (any_list[index_final], )

