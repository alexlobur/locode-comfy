from secrets import randbelow
from ...utils.anytype import any_type

#---
#
#   Тестовый узел
#
#---

class LoTest:
    """
    Тестовый узел.
    """

    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "pass_any": (any_type, ),
            },
        }

    EXPERIMENTAL = True

    RETURN_TYPES = ( any_type, "STRING" )
    RETURN_NAMES = ("any", "string")
    FUNCTION = "execute"

    CATEGORY = "locode/test"
    AUTHOR = "LoCode"
    DESCRIPTION = """
    Converts any type to an integer.
    Outputs:
    - `int`: Integer value.
"""


    #
    #   Вычисляем значение
    #
    def execute(self, pass_any: any_type):

        # DEBUG
        print(f"LoTest: {pass_any}")

        return (pass_any, str(pass_any) )

