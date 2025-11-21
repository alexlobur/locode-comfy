import math
from random import randint


#---
#
#   Задать параметры видео.
#
#---
class LoSetVideoProps:

    NODE_MAPPINGS = ("LoSetVideoProps", "Lo:SetVideoProps")
    AUTHOR = "LoCode"
    CATEGORY = "locode/misc"
    DESCRIPTION = """
Set Video parameters
    """

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "width": ("INT", {"default": 1280}),
                "height": ("INT", {"default": 720}),
                "duration": ("FLOAT", {"default": 4.0}),
                "fps": ("FLOAT", {"default": 24.0}),
            },
        }

    RETURN_TYPES = ("INT", "INT", "FLOAT", "FLOAT", "INT", "LO_VIDEO_PROPS")
    RETURN_NAMES = ("width", "height", "duration", "fps", "frames", "video_props")
    FUNCTION = "execute"


    # 
    # Вычисление параметров видео
    #
    def execute(self, width=0, height=0, duration=0.0, fps=0.0):
        video_props = LoVideoProps(width, height, duration, fps)
        # возвращаем параметры
        return video_props.get_params()



#---
#
#   Получить параметры видео из ссылки.
#
#---
class LoGetVideoProps:

    NODE_MAPPINGS = ("LoGetVideoProps", "Lo:GetVideoProps")
    AUTHOR = "LoCode"
    CATEGORY = "locode/utils"
    DESCRIPTION = """
Get Video parameters
    """

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "video_props": ("LO_VIDEO_PROPS",),
            },
        }

    RETURN_TYPES = ("INT", "INT", "FLOAT", "FLOAT", "INT", "LO_VIDEO_PROPS")
    RETURN_NAMES = ("width", "height", "duration", "fps", "frames", "video_props")
    FUNCTION = "execute"

    # 
    # Функция для получения параметров видео
    # 
    def execute(self, video_props):
        return video_props.get_params()




#---
#
#   Параметры видео.
#
#---
class LoVideoProps:
    """Параметры видео.
    """
    def __init__(self, width, height, duration, fps):
        self.width = width
        self.height = height
        self.duration = duration
        self.fps = fps

        # если какие-то параметры не заданы кидаем ошибку с указанием параметра, который не задан
        if self.width <= 0:
            raise ValueError("Width is not set")
        if self.height <= 0:
            raise ValueError("Height is not set")
        if self.duration <= 0:
            raise ValueError("Duration is not set")
        if self.fps <= 0:
            raise ValueError("FPS is not set")

        # считаем количество кадров (округляем до 4x)
        self.frames = 1 + math.ceil(self.duration * self.fps/4)*4

        # считаем окончательную продолжительность
        self.durationFinal = round(self.frames / self.fps, 2)


    # 
    # Функция для получения параметров видео
    #
    def get_params(self):
        # возвращаем параметры
        return (self.width, self.height, self.duration, self.fps, self.frames, self)


    # В виде строки
    def __str__(self):
        return f"width: {self.width}, height: {self.height}, duration: {self.duration}, fps: {self.fps}, frames: {self.frames}, durationFinal: {self.durationFinal}"
