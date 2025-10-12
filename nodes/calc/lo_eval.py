from ...utils.anytype import any_type

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
                "expression": ("STRING", {"default": "a + b" }),
            },
            "optional": {
                "a" : (any_type, ),
                "b" : (any_type, ),
                "c" : (any_type, ),
            },
        }

    RETURN_TYPES = ("INT", "FLOAT")
    RETURN_NAMES = ("int", "float")
    FUNCTION = "compute"
    CATEGORY = "locode"
    DESCRIPTION = """
    Evaluates an expression with variables.
    Outputs:
    - `int`: Integer result.
    - `float`: Float result.
    """

    def compute(self, expression, a=None, b=None, c=None):
        variables = {
            "a": a,
            "b": b,
            "c": c,
        }
        # Ограничим доступ к builtins и передадим переменные как locals
        safe_globals = {"__builtins__": {}}
        result = eval(expression, safe_globals, variables)
        return (int(round(float(result))), float(result))

