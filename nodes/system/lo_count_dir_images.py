#---
#
#   Подсчитывает количество изображений в директории
#
#---

import os


class LoCountDirImages:
    """
    Подсчитывает количество изображений в директории.

    Правила:
      - На вход принимаются:
        - путь к директории (STRING). Путь может быть относительным
      - На выходе:
        - количество изображений в директории.
    """


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "path": ("STRING", {"default": "", "tooltip": "Path to the file or directory to check" }),
            },
        }

    RETURN_TYPES = ( "INT", )
    RETURN_NAMES = ("count",)
    FUNCTION = "execute"

    CATEGORY = "locode/system"
    AUTHOR = "LoCode"
    DESCRIPTION = """
    Counts the number of images (png, jpg, jpeg, webp) in a directory.
    If the directory does not exist, or error occurs, returns -1.
    Outputs:
    - `count`: Number of images in the directory.
"""


    #
    #   Вычисляем значение
    #
    def execute(self, path: str):
        try:
            images = [f for f in os.listdir(path) if f.endswith(('.png', '.jpg', '.jpeg', '.webp'))]
            return (len(images),)
        except Exception as e:
            print(f"Error counting images: {e}")
            return (-1,)
    