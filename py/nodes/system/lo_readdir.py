import os
import time
from ...utils.utils import comfyui_abspath


#---
#
#   Читает содержимое директории
#
#---


class LoReadDir:

    NODE_MAPPINGS = ("LoReadDir", "ReadDir")
    CATEGORY = "locode/system"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Reads the contents of a directory.
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
                "path": ("STRING", {"default": "", "tooltip": "Path to the directory to read" }),
                "skip_not_exist" : ("BOOLEAN", {"default": False, "tooltip": "Don't throw error if directory does not exist and return empty lists" }),
            },
        }

    RETURN_TYPES = ( "LIST", "LIST", "LIST", "STRING", )
    RETURN_NAMES = ("all", "files", "dirs", "path", )
    FUNCTION = "execute"

    #
    #   Вычисляем значение
    #
    def execute(self, path: str, skip_not_exist=False):

        # если путь не указан, выбрасываем ошибку
        if not path.strip():
            raise ValueError("Path is required")

        # приводим путь к абсолютному пути
        path = comfyui_abspath(path)

        # читаем содержимое директории
        try:
            all = os.listdir(path)
            files = [f for f in all if os.path.isfile(os.path.join(path, f))]
            dirs = [d for d in all if os.path.isdir(os.path.join(path, d))]

            print(f"Read directory: {path}")
            print(f"Found: {len(all)} items, {len(files)} files, {len(dirs)} directories")

            return (all, files, dirs, path,)

        except Exception as e:
            if skip_not_exist:
                print(f"Error reading directory: {e}")
                return ([], [], [], path,)
            else:
                raise e