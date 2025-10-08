import time
import pygame
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
                "pass_any": (any_type,),
                "name": ("STRING",),
                "reset_after": ("BOOLEAN",),
                "beep": ("BOOLEAN",),
            },
        }
    RETURN_TYPES = (any_type,)
    RETURN_NAMES = ("pass_any",)

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
    def execute(self, pass_any: any, name: str, reset_after: bool, beep: bool):
        cls = type(self)

        # Текущее время
        current_time = time.time()

        # Начало отсчета времени
        if cls.first_time is None: cls.first_time = current_time

        # Время прохождения
        past_time = time.strftime("%H:%M:%S", time.gmtime(current_time - cls.first_time))
        past_time_delta = "00:00:00" if cls.previous_time is None else time.strftime("%H:%M:%S", time.gmtime(current_time - cls.previous_time))

        # Звук оповещения
        if beep: self.beep()

        # Сохраняем время прохождения текущего узла
        cls.previous_time = current_time

        # Сброс точки отсчета времени
        if reset_after: cls.first_time = None

        # Выводим в консоль
        print(f"\033[34m{name} [{past_time_delta} / {past_time}]:\n{pass_any}")

        # Возвращаем значение
        return (pass_any,)


    def beep(self):
        pygame.mixer.init()
        pygame.mixer.music.load("../../res/beep.mp3")
        pygame.mixer.music.play()


# print("\033[31mКрасный\033[0m")
# print("\033[32mЗелёный\033[0m")
# print("\033[33mЖёлтый\033[0m")
# print("\033[1;34mСиний жирный\033[0m")        

