from ...utils.anytype import any_type

#---
#
#   Вычислить результат выражения с переменными.
#
#---
class LoEvals:

    NODE_MAPPINGS = ("LoEvals", "Lo:Evals")
    AUTHOR = "LoCode"
    CATEGORY = "locode/calc"
    DESCRIPTION = """
Evaluates an expression with variables.
The variable name is taken from the input name (or label, if exists).
You can redefine the variable name (input label) using the context menu > "Rename Slot".
"""

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "expression": ("STRING", {"default": "x0 + x1", "multiline" : True }),
            },
            "hidden": {
                "labels_of_vars": ("DICT", )
            }
        }

    RETURN_TYPES = ("INT", "FLOAT", "BOOLEAN")
    RETURN_NAMES = ("int", "float", "bool")
    FUNCTION = "execute"


    def execute(self, expression: str, labels_of_vars: dict, **kwargs):
        # print(expression, labels_of_vars, kwargs.items())
        try:

            # Преобразуем переменные в числа где возможно
            variables = {}

            for key, value in kwargs.items():
                # if key != 'expression' and not key.startswith('_'):
                # получаем значение имени (если есть key в labels_of_vars, то будет взято из label)
                name = labels_of_vars.get(key, key)
                variables[name] = self._prepare_number(value)

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
