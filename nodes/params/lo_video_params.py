import math

#---
#
#   Задать параметры видео глобально.
#
#---
class LoVideoParams:
    """Задать параметры видео.

    Правила:
      - Задает высоту, ширину, продолжительность, fps.
      - На выходе будут параматры видео + количество кадров.
      - Если какие-то параметры не заданы, то они будут взяты из предыдущих значений.
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
            },
            "optional": {
                "width": ("INT", {"default": 0}),
                "height": ("INT", {"default": 0}),
                "duration": ("FLOAT", {"default": 0.0}),
                "fps": ("FLOAT", {"default": 0.0}),
            },
        }

    RETURN_TYPES = ("INT", "INT", "FLOAT", "FLOAT", "INT", "STRING")
    RETURN_NAMES = ("width", "height", "duration", "fps", "frames", "text")
    FUNCTION = "compute"
    CATEGORY = "locode"

    # Классовые (статические) параметры, общие для всех экземпляров узла
    width: int = 0
    height: int = 0
    duration: float = 0
    fps: float = 0
    frames: int = 0


    def compute(self, width=0, height=0, duration=0.0, fps=0.0):
        cls = type(self) # получаем класс экземпляра узла

        # обновляем статические параметры
        cls.width = width if width > 0 else cls.width
        cls.height = height if height > 0 else cls.height
        cls.duration = duration if duration > 0 else cls.duration
        cls.fps = fps if fps > 0 else cls.fps

        # возвращаем параметры
        return get_params()




#---
#
#   Получить параметры видео из глобальных параметров.
#
#---
class LoVideoGetParams:
    """Получить параметры видео.

    Правила:
      - На выходе будет параметры видео.
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
        }

    RETURN_TYPES = ("INT", "INT", "FLOAT", "FLOAT", "INT", "STRING")
    RETURN_NAMES = ("width", "height", "duration", "fps", "frames", "text")
    FUNCTION = "compute"
    CATEGORY = "locode"

    def compute(self):
        return get_params_safe()



#---
#
#   Статические параметры
#
#---

# функция для безопасного получения параметров видео (без ошибок)
def get_params_safe():
    # возвращаем текущие значения, даже если они не установлены
    frames = 0
    if LoVideoParams.duration > 0 and LoVideoParams.fps > 0:
        frames = math.ceil(LoVideoParams.duration * LoVideoParams.fps / 4) * 4
    
    durationFinal = 0.0
    if LoVideoParams.fps > 0 and frames > 0:
        durationFinal = round(frames / LoVideoParams.fps, 2)
    
    text = f"size: {LoVideoParams.width} x {LoVideoParams.height}, duration: {durationFinal},\n fps: {LoVideoParams.fps}, frames: {frames}"
    print(f"LoVideoParams.text (safe): {text}")
    
    return (LoVideoParams.width, LoVideoParams.height, LoVideoParams.duration, LoVideoParams.fps, frames, text)


# функция для получения параметров видео
def get_params():

    # если какие-то параметры не заданы кидаем ошибку с указанием параметра, который не задан
    if LoVideoParams.width <= 0:
        raise ValueError("Width is not set")
    if LoVideoParams.height <= 0:
        raise ValueError("Height is not set")
    if LoVideoParams.duration <= 0:
        raise ValueError("Duration is not set")
    if LoVideoParams.fps <= 0:
        raise ValueError("FPS is not set")

    # считаем количество кадров (округляем до 4x)
    frames = 1 + math.ceil(LoVideoParams.duration * LoVideoParams.fps/4)*4

    # считаем окончательную продолжительность
    durationFinal = round(frames / LoVideoParams.fps, 2)

    text = f"size: {LoVideoParams.width} x {LoVideoParams.height}, duration: {durationFinal},\n fps: {LoVideoParams.fps}, frames: {frames}"
    print(f"LoVideoParams.text: {text}")

    # возвращаем параметры
    return (LoVideoParams.width, LoVideoParams.height, LoVideoParams.duration, LoVideoParams.fps, frames, text)

