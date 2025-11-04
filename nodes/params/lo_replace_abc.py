from ...utils.anytype import any_type

#---
#
#   Замена значений в тексте
#
#---
class LoReplaceAbc:

    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "string": ("STRING", {"default": "{a}, {b}, {c}", "multiline": True }),
            },
            "optional": {
                "a": (any_type,),
                "b": (any_type,),
                "c": (any_type,),
                "d": (any_type,),
                "e": (any_type,),
                "f": (any_type,),
                "g": (any_type,),
                "h": (any_type,),
            },
        }

    RETURN_TYPES = ( "STRING", )
    RETURN_NAMES = ("STRING",)
    FUNCTION = "execute"

    CATEGORY = "locode/params"
    AUTHOR = "LoCode"
    DESCRIPTION ="""
Replace a values in a string. Set value in curly bracers: `Hello, {a}!`
"""

    #
    #   Вычисляем значение
    #
    def execute(self, string: str, a: any_type = None, b: any_type = None, c: any_type = None, 
                d: any_type = None, e: any_type = None, f: any_type = None, 
                g: any_type = None, h: any_type = None):
        # Преобразуем все значения в строки
        str_a = str(a) if a is not None else ""
        str_b = str(b) if b is not None else ""
        str_c = str(c) if c is not None else ""
        str_d = str(d) if d is not None else ""
        str_e = str(e) if e is not None else ""
        str_f = str(f) if f is not None else ""
        str_g = str(g) if g is not None else ""
        str_h = str(h) if h is not None else ""
        
        # Заменяем плейсхолдеры в строке
        result = string.replace("{a}", str_a).replace("{b}", str_b).replace("{c}", str_c)\
                      .replace("{d}", str_d).replace("{e}", str_e).replace("{f}", str_f)\
                      .replace("{g}", str_g).replace("{h}", str_h)
        
        # Возвращаем результат
        return (result,)
