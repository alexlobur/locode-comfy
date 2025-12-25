import time
from ...utils.anytype import any_type
from ...utils import play_sound


#---
#
#   Вывести звук оповещения
#
#---
class LoBeep:

    # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    NODE_MAPPINGS = ("LoBeep", "Beep")
    CATEGORY = "locode/utils"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Plays a sound. To add your own sound, place it in the `res/beeps` folder.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return time.time()


    @classmethod
    def INPUT_TYPES(cls):
        # звуки оповещения
        soundNames = list(play_sound.get_beep_sounds().keys())

        # возвращаем типы входных данных
        return {
            "required": {
                "any": (any_type,),
                "sound": (soundNames, {"default": soundNames[0]}),
            },
        }


    RETURN_TYPES = (any_type,)
    RETURN_NAMES = ("any",)

    FUNCTION = "execute"
    OUTPUT_NODE = True


    #
    #   Вычисляем значение
    #
    def execute(self, any: any_type, sound: str):

        # воспроизводим звук
        play_sound.play_beep(sound)

        # Возвращаем значение
        return (any,)

