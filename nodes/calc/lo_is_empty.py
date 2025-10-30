from ...utils.anytype import any_type


#---
#
#   Проверка данных на пустоту
#
#---
class LoIsEmpty:

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "any": ( any_type, ),
            },
        }

    # Один выход (логическое значение)
    RETURN_TYPES = ("BOOLEAN",)
    RETURN_NAMES = ("BOOLEAN",)
    FUNCTION = "compare"
    CATEGORY = "locode/calc"
    # OUTPUT_NODE = True

    def compare(self, any):
        is_empty = any is None or (isinstance(any, str) and any.strip() == "")
        return (is_empty,)