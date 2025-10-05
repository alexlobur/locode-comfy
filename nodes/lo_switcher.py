from ..utils.utils import any_type


#---
#
#   Переключатель значения в зависимости от счетчика
#
#---
class LoSwitcher:
    """Переключатель значения в зависимости от счетчика.

    Правила:
      - На вход принимается счетчик (INT) и список значений (любой тип).
      - Если счетчик введен ка значение, то он увеличивается автоматически для следующей итерации.
      - В списке могут быть пустые значения.
      - На выходе будет значение в зависимости от модуля счетчика и количества значений в списке.
    """


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "counter": ("INT", {"default": 0, "step": 1}),
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
            },
        }

    RETURN_TYPES = (any_type,)
    RETURN_NAMES = ("result",)
    FUNCTION = "compute"
    CATEGORY = "locode"
    OUTPUT_NODE = True


    def compute(self, counter, any0=None, any1=None, any2=None, any3=None, any4=None, any5=None, any6=None, any7=None, any8=None, any9=None):

        # формируем список из не пустых значений
        raw_values = [any0, any1, any2, any3, any4, any5, any6, any7, any8, any9]
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
        return (values[counter % values_count],)
