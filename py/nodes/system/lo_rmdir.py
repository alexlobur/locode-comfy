import os
import time
import shutil
from ...utils.anytype import any_type
from ...utils.utils import comfyui_abspath


#---
#
#   Удаляет директорию
#
#---

class LoRmDir:

    NODE_MAPPINGS = ("LoRmDir", "RmDir")
    CATEGORY = "locode/system"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Removes a directory and all its contents.
If the path is relative, it will be converted to an absolute path starting from the ComfyUI folder.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    EXPERIMENTAL = True

    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return time.time()


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "path": ("STRING", {"default": "", "tooltip": "Path to the directory to remove" }),
            },
            "optional": {
                "pass_any": (any_type,),
            }
        }

    RETURN_TYPES = ( any_type, "STRING", "BOOLEAN", )
    RETURN_NAMES = ("pass_any", "path", "is_removed", )
    FUNCTION = "execute"


    #
    #   Запуск функции
    #
    def execute(self, path: str, pass_any=None):

        # если путь не указан, выбрасываем ошибку
        if not path.strip():
            raise ValueError("Path is required")

        # приводим путь к абсолютному пути
        path = comfyui_abspath(path)

        # проверяем, существует ли директория
        if not os.path.exists(path):
            print(f"Directory does not exist: {path}")
            return (pass_any, path, False,)

        # удаляем директорию (даже если она не пустая)
        try:
            shutil.rmtree(path)
            print(f"Directory removed: {path}")
            return (pass_any, path, True,)
        except Exception as e:
            print(f"Error removing directory: {e}")
            return (pass_any, path, False,)
