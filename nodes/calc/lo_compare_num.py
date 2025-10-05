#---
#
#   Сравнение двух чисел
#
#---
class LoCompareNum:
    """Сравнение двух чисел на выходе будет логическое значение.

    Правила:
      - На вход принимаются любые типы данных.
      - На выходе будет логическое значение.
    """

    EXPERIMENTAL = True

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "a": ("*", ),
                "b": ("*", ),
                "operation": (["a>b", "a<b", "a=b", "a!=b", "a>=b", "a<=b", "a % b = 0"], {"default": "a=b"})
            },
        }

    # Один выход (логическое значение)
    RETURN_TYPES = ("BOOLEAN",)
    RETURN_NAMES = ("result",)
    FUNCTION = "compare"
    CATEGORY = "locode"
    OUTPUT_NODE = True

    def compare(self, a, b, operation: str = "a=b"):
        result = compare(a, b, operation)
        return (result,)



#---
#
#    Сравнить два числа
#
#---
def compare(a, b, op: str = "a=b"):

    a_num = to_number(a)
    b_num = to_number(b)

    if op == "a>b":
        return a_num > b_num
    elif op == "a<b":
        return a_num < b_num
    elif op == "a=b":
        return a_num == b_num
    elif op == "a!=b":
        return a_num != b_num
    elif op == "a>=b":
        return a_num >= b_num
    elif op == "a<=b":
        return a_num <= b_num
    elif op == "a % b = 0":
        return a_num % b_num == 0
    else:
        raise ValueError("Unsupported operation: " + str(op))


#---
#
#   Преобразование в число
#
#---
def to_number(x):
    if isinstance(x, (int, float)):
        return float(x)
    # Попробуем распарсить строкоподобное
    try:
        return float(x)
    except Exception:
        raise ValueError("Ожидались числовые значения для операций кроме сложения строк")
