from ...utils.anytype import any_type

#---
#
#   Вычислить результат выражения с переменными.
#
#---
class LoEval2:

    NODE_MAPPINGS = ("LoEval2", "Lo:Eval2")
    AUTHOR = "LoCode"
    CATEGORY = "locode/calc"
    DESCRIPTION = """
Evaluates an expression with variables.
Outputs:
- `int`: Integer result.
- `float`: Float result.
    """


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "expression": ("STRING", {"default": "a + b" }),
            }
        }

    RETURN_TYPES = ("INT", "FLOAT")
    RETURN_NAMES = ("int", "float")
    FUNCTION = "execute"


    def execute(self, expression: str, **kwargs):

        # for key, value in kwargs.items():
        # variables = { "a": a, }
        variables = kwargs.items()

        # Ограничим доступ к builtins и передадим переменные как locals
        safe_globals = {"__builtins__": {}}

        result_float = float( eval(expression, safe_globals, variables) )
        result_int = int(round(result_float))

        # Печатаем результат
        print(f"LoEval2: {expression} = {result_float} (INT: {result_int})")

        # Возвращаем результат как INT и FLOAT
        return (result_int, result_float)

