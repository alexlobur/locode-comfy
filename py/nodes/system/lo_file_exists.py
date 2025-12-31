import os
import time
from ...utils.utils import comfyui_abspath
from ...utils.anytype import any_type


#---
#
#   Проверка наличия директории или файла
#
#---

class LoFileExists:

    NODE_MAPPINGS = ("LoFileExists", "FileExists")
    CATEGORY = "locode/system"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Checks if a file or directory exists.
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

    RETURN_TYPES = ( "BOOLEAN", "BOOLEAN", )
    RETURN_NAMES = ("exists", "is_dir", )
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
        print(f"Checking if file or directory exists: {path}")

        exists = os.path.exists(path) 
        return (exists, exists & os.path.isdir(path))

