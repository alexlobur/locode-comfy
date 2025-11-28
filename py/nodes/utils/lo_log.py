import time
from ...utils.anytype import any_type
from ...utils import play_sound


#---
#
#   Вывести лог в консоль
#
#---
class LoLog:
    """
    Вывести любое значение в консоль.
    Выводит время прохождения узла.

    Правила:
      - На вход принимаются:
        - любое значение (ANY).
        - Имя узла в консоли (STRING).
        - Сброс точки отсчета времени после вывода (BOOLEAN).
        - Звук оповещения (STRING).
      - На выходе:
        - любое значение (ANY).
    """


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        sounds = list[str](play_sound.SOUNDS.keys())
        sounds.insert(0, "none")

        return {
            "required": {
                "any": (any_type,),
                "name": ("STRING",),
                "reset": ("BOOLEAN",),
                "sound": (sounds, {"default": "none"}),
            },
        }

    RETURN_TYPES = (any_type,)
    RETURN_NAMES = ("any",)

    FUNCTION = "execute"
    OUTPUT_NODE = True

    # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    NODE_MAPPINGS = ("LoLog", "Lo:Log")

    CATEGORY = "locode/utils"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Prints any value to the console.
"""

    first_time = None
    previous_time = None


    #
    #   Вычисляем значение
    #
    def execute(self, any: any, name: str, reset: bool, sound: str):
        cls = type(self)

        # Текущее время
        current_time = time.time()

        # Начало отсчета времени
        if cls.first_time is None: cls.first_time = current_time

        # Время прохождения
        past_time = time.strftime("%H:%M:%S", time.gmtime(current_time - cls.first_time))
        past_time_delta = "00:00:00" if cls.previous_time is None else time.strftime("%H:%M:%S", time.gmtime(current_time - cls.previous_time))

        # Звук оповещения
        play_sound.play(sound)

        # Сохраняем время прохождения текущего узла
        cls.previous_time = current_time

        # Сброс точки отсчета времени
        if reset: cls.first_time = None

        # Выводим в консоль
        print(f"    \033[34m{name} [{past_time_delta} / {past_time}]:\n{any}\033[0m")

        # Возвращаем значение
        return (any,)

