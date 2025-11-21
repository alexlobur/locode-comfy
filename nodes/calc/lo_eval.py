from ...utils.anytype import any_type

#---
#
#   Вычислить результат выражения с переменными.
#
#---
class LoEval:

    NODE_MAPPINGS = ("LoEval", "Lo:Eval")
    AUTHOR = "LoCode"
    CATEGORY = "locode/calc"
    DESCRIPTION = """
Evaluates an expression with variables.
Outputs:
- `int`: Integer result.
- `float`: Float result.
    """

    DEPRECATED = True


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

