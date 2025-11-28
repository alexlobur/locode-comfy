from ...utils.anytype import any_type


#---
#
#   Получить значение из списка
#
#
#---
class LoFromList:

    NODE_MAPPINGS = ("LoFromList", "Lo:FromList")
    CATEGORY = "locode/lists"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Returns value from a list by the `index`.
If modulo and the index is out of bounds in either direction, the index is wrapped using modulo.
So if index=10 and list has 7 items, then the result index will be 10 % 7 = 3.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "index": ("INT", {"default": 0, "step": 1, "tooltip": "Index of the element in list" }),
                "any_list": ("LIST", {"default": [], "tooltip": "List of values" }),
                "modulo": ("BOOLEAN", {"default": False, "tooltip": "If enabled, wraps index using modulo operation (index % list_length)" }),
                "none_on_error": ("BOOLEAN", {"default": False, "tooltip": "If enabled, returns None instead of raising an error" }),
            },
        }

    RETURN_TYPES = ( any_type, )
    RETURN_NAMES = ("any",)
    FUNCTION = "execute"


    #
    #   Вычисляем значение
    #
    def execute(self, index: int, any_list: list, modulo: bool, none_on_error: bool ):

        # Если список пустой
        if len(any_list) == 0:
            error_msg = "List is empty"
            if none_on_error:
                print(f"Lo:FromList error: {error_msg}")
                return (None,)
            else:
                raise ValueError(error_msg)

        # Обычный режим: проверяем границы
        if not modulo:
            if index < 0 or index >= len(any_list):
                error_msg = f"Index {index} is out of range [0, {len(any_list)})"
                if none_on_error:
                    print(f"Lo:FromList error: {error_msg}")
                    return (None,)
                else:
                    raise IndexError(error_msg)
            index_final = index

        # Режим с modulo: используем остаток от деления
        else:
            index_final = index % len(any_list)

        # Значение из списка
        return (any_list[index_final], )

