from ...utils.anytype import any_type


#---
#
#   Формирует список из входных данных
#
#---
class LoAnyList:
    """
    Формирует список из входных данных.

    Правила:
      - На вход принимаются:
        - любые типы данных (ANY_TYPE).
      - На выходе:
        - список значений любого типа (LIST).
    """


    DEPRECATED = True


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "optional": {
                "any0": (any_type,),
                "any1": (any_type,),
                "any2": (any_type,),
                "any3": (any_type,),
                "any4": (any_type,),
                "any5": (any_type,),
                "any6": (any_type,),
                "any7": (any_type,),
                "any8": (any_type,),
                "any9": (any_type,),
                "any10": (any_type,),
                "any11": (any_type,),
                "any12": (any_type,),
                "any13": (any_type,),
                "any14": (any_type,),
                "any15": (any_type,),
            },
        }

    RETURN_TYPES = ( "LIST", "INT" )
    RETURN_NAMES = ("list", "length")
    FUNCTION = "execute"

    CATEGORY = "locode/params"
    AUTHOR = "LoCode"
    DESCRIPTION = """
    Converts any types into a list.
    Outputs:
    - `list`: List of any types.
"""


    #
    #   Вычисляем значение
    #
    def execute(self, any0=None, any1=None, any2=None, any3=None, any4=None, any5=None, any6=None, any7=None, any8=None, any9=None, any10=None, any11=None, any12=None, any13=None, any14=None, any15=None):

        # Возвращаем список не пустых значений
        list = [any for any in [any0, any1, any2, any3, any4, any5, any6, any7, any8, any9, any10, any11, any12, any13, any14, any15] if any is not None]
        return (list, len(list))
    
