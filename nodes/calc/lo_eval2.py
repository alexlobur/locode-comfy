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
                "expression": ("STRING", {"default": "x0 + x1", "multiline" : True }),
            }
        }

    RETURN_TYPES = ("INT", "FLOAT", "BOOLEAN")
    RETURN_NAMES = ("INT", "FLOAT", "BOOL")
    FUNCTION = "execute"


    def execute(self, expression: str, **kwargs):
        try:

            # Преобразуем переменные в числа где возможно
            variables = {}
            for k, v in kwargs.items():
                if k != 'expression' and not k.startswith('_'):
                    variables[k] = self._prepare_number(v)

            # Безопасный eval с ограниченным контекстом
            safe_globals = {"__builtins__": {}}
            safe_locals = variables
            expression = expression.replace("\n", " ")

            # Eval
            result = eval(expression, safe_globals, safe_locals)
            result_float = float(result)
            result_int = int(round(result_float))
            result_bool = bool(result)

            # Печатаем результат
            print(f"LoEval2: {expression} = {result}")
            return (result_int, result_float, result_bool)

        except Exception as e:
            error_msg = f"LoEval2 Error: {str(e)}"
            print(error_msg)
            raise e


    def _prepare_number(self, value):
        """Преобразует значение в число если возможно, иначе возвращает как есть"""
        if isinstance(value, (int, float)):
            return value
        elif isinstance(value, bool):
            return 1 if value else 0
        else:
            # Для других типов пробуем преобразовать в строку и затем в число
            return float(str(value))
