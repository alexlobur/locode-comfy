import math
from random import randint


#---
#
#   Задать параметры видео.
#
#---
class LoSetVideoProps:

    NODE_MAPPINGS = ("LoSetVideoProps", "SetVideoProps")
    AUTHOR = "LoCode"
    CATEGORY = "locode/params"
    DESCRIPTION = """
Packs video parameters into a `LO_VIDEO_PROPS` object for the `GetVideoProps` node.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "width": ("INT", {"default": 1280, "tooltip": "Width of the video"}),
                "height": ("INT", {"default": 720, "tooltip": "Height of the video"}),
                "frames": ("INT", {"default": 81, "min": 1, "tooltip": "Number of frames"}),
                "fps": ("FLOAT", {"default": 16.0, "tooltip": "Frames per second"}),
            },
        }

    RETURN_TYPES = ("LO_VIDEO_PROPS", "INT", "INT", "INT", "FLOAT", "FLOAT")
    RETURN_NAMES = ("video_props", "width", "height", "frames", "fps", "duration")
    FUNCTION = "execute"


    # 
    # Вычисление параметров видео
    #
    def execute(self, width=0, height=0, frames=0, fps=0.0):
        video_props = LoVideoProps(width, height, frames, fps)
        # возвращаем параметры
        return video_props.get_params()



#---
#
#   Получить параметры видео из ссылки.
#
#---
class LoGetVideoProps:

    NODE_MAPPINGS = ("LoGetVideoProps", "GetVideoProps")
    AUTHOR = "LoCode"
    CATEGORY = "locode/params"
    DESCRIPTION = """
Unpacks video parameters from a `LO_VIDEO_PROPS` object.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "video_props": ("LO_VIDEO_PROPS", ),
            },
        }

    RETURN_TYPES = ("LO_VIDEO_PROPS", "INT", "INT", "INT", "FLOAT", "INT", )
    RETURN_NAMES = ("video_props", "width", "height", "frames", "fps", "duration", )
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
    def __init__(self, width, height, frames, fps):
        self.width = width
        self.height = height
        self.frames = frames
        self.fps = fps

        # если какие-то параметры не заданы кидаем ошибку с указанием параметра, который не задан
        if self.width <= 0:
            raise ValueError("Width is not set")
        if self.height <= 0:
            raise ValueError("Height is not set")
        if self.frames <= 1:
            raise ValueError("Frames is not set or less than 1")
        if self.fps <= 0:
            raise ValueError("FPS is not set")

        # считаем продолжительность
        self.duration = round(self.frames / self.fps, 2)


    # 
    # Функция для получения параметров видео
    #
    def get_params(self):
        # возвращаем параметры
        return (self, self.width, self.height, self.frames, self.fps, self.duration, )


    # В виде строки
    def __str__(self):
        return f"width: {self.width}, height: {self.height}, frames: {self.frames}, fps: {self.fps}, duration: {self.duration}"
