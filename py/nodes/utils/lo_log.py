import time
from ...utils.anytype import any_type
from ...utils import play_sound


#---
#
#   Вывести лог в консоль
#
#---
class LoLog:

    # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    NODE_MAPPINGS = ("LoLog", "Log")
    CATEGORY = "locode/utils"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Outputs `any` value to the console.
Outputs to the console the elapsed time since the last call to a node of this type.
Optional: Plays a `sound` alert when a node completes.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return time.time()


    @classmethod
    def INPUT_TYPES(cls):
        soundNames = list[str](play_sound.get_beep_sounds().keys())
        soundNames.insert(0, "none")

        return {
            "required": {
                "any": (any_type, {"tooltip": "The value to log"}),
                "name": ("STRING", {"default": "Log", "tooltip": "The name of the log"}),
                "start_time": ("BOOLEAN", {"default": False, "tooltip": "If True, the time will be reset"}),
                "sound": (soundNames, {"default": soundNames[0], "tooltip": "The sound to play when the node completes"}),
            },
        }

    RETURN_TYPES = (any_type,)
    RETURN_NAMES = ("any",)

    FUNCTION = "execute"
    OUTPUT_NODE = True


    CATEGORY = "locode/utils"
    AUTHOR = "LoCode"
    DESCRIPTION = """
"""

    first_time = None
    previous_time = None


    #
    #   Вычисляем значение
    #
    def execute(self, any: any_type, name: str, start_time: bool, sound: str):
        cls = type(self)

        # Текущее время
        current_time = time.time()

        # Сброс точки отсчета времени
        if start_time or cls.first_time is None:
            cls.first_time = current_time
            cls.previous_time = current_time

        # Время прохождения
        past_time = time.strftime("%H:%M:%S", time.gmtime(current_time - cls.first_time))
        past_time_delta = time.strftime("%H:%M:%S", time.gmtime(current_time - cls.previous_time))

        # Звук оповещения
        play_sound.play_beep(sound)

        # Сохраняем время прохождения текущего узла
        cls.previous_time = current_time

        # Выводим в консоль
        print(f"\033[34m{name} [{past_time_delta} / {past_time}]:\n{any}\033[0m")

        # Возвращаем значение
        return (any,)

