import time
import ctypes
import os
from ...utils.anytype import any_type


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
        - Звук оповещения (BOOLEAN).
      - На выходе:
        - любое значение (ANY).
    """


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "any": (any_type,),
                "name": ("STRING",),
                "reset": ("BOOLEAN",),
                "sound": (["none", "bell", "beep"], {"default": "none"}),
            },
        }

    RETURN_TYPES = (any_type,)
    RETURN_NAMES = ("any",)

    FUNCTION = "execute"
    OUTPUT_NODE = True

    CATEGORY = "locode"
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
        self.beep(sound)

        # Сохраняем время прохождения текущего узла
        cls.previous_time = current_time

        # Сброс точки отсчета времени
        if reset: cls.first_time = None

        # Выводим в консоль
        print(f"\033[34m{name} [{past_time_delta} / {past_time}]:\n{any}\033[0m")

        # Возвращаем значение
        return (any,)


    #
    #   Воспроизводим звук оповещения
    #
    def beep(self, name: str):

        # имя файла
        filename = { "bell": "bell.mp3", "beep": "beep.mp3" }.get(name, None)

        # если такого звука нет, выходим
        if filename is None: return

        # базовая директория: корень пакета locode-comfy (два уровня вверх от этого файла)
        base_dir = os.path.abspath( os.path.dirname(__file__) + "/../../" )

        # если файл не найден, выводим сообщение и выходим
        if not os.path.exists(os.path.join(base_dir, "res", filename)): return

        # путь к файлу
        path = os.path.join(base_dir, "res", filename)
        if not os.path.exists(path): return

        # воспроизводим звук
        mci = ctypes.windll.winmm.mciSendStringW
        mci(f'open "{path}" type mpegvideo alias mymp3', None, 0, 0)
        mci('play mymp3 wait', None, 0, 0)
        mci('close mymp3', None, 0, 0)

