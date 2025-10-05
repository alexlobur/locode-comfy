#---
#
#   Вычислить результат выражения с переменными.
#
#---
class LoEval:
    """Вычислить результат выражения с переменными.
    Правила:
      - На вход принимаются любые типы данных.
      - На выходе будет число типа INT и FLOAT.
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "expression": ("STRING",),
            },
            "optional": {
                "a" : ("*"),
                "b" : ("*"),
                "c" : ("*"),
            },
        }

    RETURN_TYPES = ("INT", "FLOAT")
    RETURN_NAMES = ("int", "float")
    FUNCTION = "compute"
    CATEGORY = "locode"

    def compute(self, expression, a, b, c):
        variables = {
            "a": a,
            "b": b,
            "c": c,
        }
        result = eval(expression, variables)
        return (int(round(result)), float(result))

