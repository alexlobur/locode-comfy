from ...utils.anytype import any_type


#---
#
#   Переключатель значения в зависимости от счетчика
#
#---
class LoSwitcher:
    """Переключатель значения в зависимости от счетчика.

    Правила:
      - На вход принимается индекс (INT) и список значений (любой тип).
      - В списке могут быть пустые значения.
      - На выходе будет значение в зависимости от модуля индекса и количества значений в списке.
    """


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "index_seed": ("INT", {"default": 0, "step": 1}),
            },
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

    RETURN_TYPES = (any_type,)
    RETURN_NAMES = ("result",)
    FUNCTION = "compute"
    CATEGORY = "locode/helpers"
    DESCRIPTION = """
Selects a value from a list of values based on the index_seed.
The index_seed is wrapped using modulo. So if index_seed=10 and list has 7 items, then the result index will be 10 % 7 = 3.
"""


    def compute(self, index_seed, any0=None, any1=None, any2=None, any3=None, any4=None, any5=None, any6=None, any7=None, any8=None, any9=None, any10=None, any11=None, any12=None, any13=None, any14=None, any15=None):

        # формируем список из не пустых значений
        raw_values = [any0, any1, any2, any3, any4, any5, any6, any7, any8, any9, any10, any11, any12, any13, any14, any15]
        values = []
        for value in raw_values:
            if value is not None:
                values.append(value)

        # считаем количество значений в списке
        values_count = len(values)

        # проверяем, что есть хотя бы одно значение
        if values_count == 0:
            raise ValueError("No values provided")

        # возвращаем значение из списка по индексу
        return (values[index_seed % values_count],)
