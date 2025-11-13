from ...utils.anytype import any_type
from ...utils import play_sound


#---
#
#   Вывести звук оповещения
#
#---
class LoBeep:
    """
    Воспроизводит звук оповещения.

    Правила:
      - На вход принимаются:
        - любое значение (ANY).
        - Звук оповещения (STRING).
      - На выходе:
        - любое значение (ANY).
    """


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        # Звуки оповещения
        sounds = list(play_sound.SOUNDS.keys())
        sounds.insert(0, "none")

        return {
            "required": {
                "any": (any_type,),
                "sound": (sounds, {"default": "none"}),
            },
        }


    RETURN_TYPES = (any_type,)
    RETURN_NAMES = ("any",)

    FUNCTION = "execute"
    OUTPUT_NODE = True

    # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    NODE_MAPPINGS = ("LoBeep", "Lo:Beep")

    CATEGORY = "locode/helpers"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Plays a sound notification.
"""


    #
    #   Вычисляем значение
    #
    def execute(self, any: any, sound: str):
        # Звук оповещения
        play_sound.play(sound)
        # Возвращаем значение
        return (any,)




