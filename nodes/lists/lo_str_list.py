#---
#
#   Формирует список строк из строки
#
#---
class LoStrList:

    NODE_MAPPINGS = ("LoStrList", "Lo:StrList")
    CATEGORY = "locode/lists"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Converts a String into a list of Strings.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "string": ("STRING", {"default": "1\n2\n3\n", "multiline": True }),
                "delimiter": ("STRING", {"default": "\\n" }),
                "trim": ("BOOLEAN", {"default": False }),
            },
        }

    RETURN_TYPES = ( "LIST", )
    RETURN_NAMES = ("list",)
    FUNCTION = "execute"


    #
    #   Вычисляем значение
    #
    def execute(self, string: str, delimiter: str, trim: bool):

        # Заменяем символы \n и \t на символы новой строки и табуляции
        delimiter = delimiter.replace("\\n", "\n").replace("\\t", "\t")

        # Разделяем строку на строки
        strings = string.split(delimiter)

        # Убираем пустые строки
        # strings = [string for string in strings if string.strip()]

        # очистка крайних пробелов
        if trim:
            strings = [string.strip() for string in strings]

        # Возвращаем
        return (strings, )
