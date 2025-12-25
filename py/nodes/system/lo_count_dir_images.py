import os
import time
from ...utils.utils import comfyui_abspath


#---
#
#   Подсчитывает количество изображений в директории
#
#---

class LoCountDirImages:

    NODE_MAPPINGS = ("LoCountDirImages", "CountDirImages")
    CATEGORY = "locode/system"
    AUTHOR = "LoCode"
    DESCRIPTION = """
    Counts the number of images (png, jpg, jpeg, webp) in a directory.
    If the directory does not exist, or error occurs, returns -1.
    If the path is relative, it will be converted to an absolute path starting from the ComfyUI folder.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return time.time()


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "path": ("STRING", {"default": "", "tooltip": "Path to the file or directory to check" }),
            },
        }

    RETURN_TYPES = ("INT", )
    RETURN_NAMES = ("count",)
    FUNCTION = "execute"


    #
    #   Вычисляем значение
    #
    def execute(self, path: str):

        # если путь не указан, выбрасываем ошибку
        if not path.strip():
            raise ValueError("Path is required")

        # приводим путь к абсолютному пути
        path = comfyui_abspath(path)

        try:
            images = [f for f in os.listdir(path) if f.endswith(('.png', '.jpg', '.jpeg', '.webp'))]
            len_images = len(images)
            print(f"Found {len_images} images in directory: {path}")
            return (len_images,)
        except Exception as e:
            print(f"Error counting images: {e}")
            return (-1,)
    