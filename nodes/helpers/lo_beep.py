from ...utils.anytype import any_type

#---
#
#   Звук оповещния при проходе узла
#
#---
class LoBeep:
    """Звук оповещния при проходе узла.

    Правила:
      - На вход не принимается ничего.
      - На выходе не возвращается ничего.
    """


    OUTPUT_NODE = True

    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "pass_any": ( any_type, ),
            },
        }

    RETURN_TYPES = (any_type,)
    RETURN_NAMES = ("pass_any",)
    FUNCTION = "execute"
    CATEGORY = "locode"
    OUTPUT_NODE = True

    def execute(self, pass_any=None):

        # звук оповещения

        # возвращаем значение
        return (any,)