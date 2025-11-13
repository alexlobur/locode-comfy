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
    FUNCTION = "execute"

    # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    NODE_MAPPINGS = ("LoEval", "Lo:Eval")

    CATEGORY = "locode/calc"
    DESCRIPTION = """
    Evaluates an expression with variables.
    Outputs:
    - `int`: Integer result.
    - `float`: Float result.
    """

    def execute(self, expression, a=None, b=None, c=None):
        variables = {
            "a": a,
            "b": b,
            "c": c,
        }
        # Ограничим доступ к builtins и передадим переменные как locals
        safe_globals = {"__builtins__": {}}

        result_float = float( eval(expression, safe_globals, variables) )
        result_int = int(round(result_float))

        # Печатаем результат
        print(f"LoEval: {expression} = {result_float} (INT: {result_int})")

        # Возвращаем результат как INT и FLOAT
        return (result_int, result_float)

