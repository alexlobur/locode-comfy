import os
import time
from ...utils.anytype import any_type


#---
#
#   Создает директорию если не существует
#
#---

class LoMkDir:

    NODE_MAPPINGS = ("LoMkDir", "MkDir")
    CATEGORY = "locode/system"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Creates a directory if it doesn't exist.
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
                "path": ("STRING", {"default": "", "tooltip": "Path to the directory to create" }),
            },
            "optional": {
                "pass_any": (any_type,),
            }
        }

    RETURN_TYPES = ( any_type, "STRING", "BOOLEAN", )
    RETURN_NAMES = ( "pass_any", "path", "created", )
    FUNCTION = "execute"


    #
    #   Вычисляем значение
    #
    def execute(self, path: str, pass_any=None):

        # если путь не указан, выбрасываем ошибку
        if not path.strip():
            raise ValueError("Path is required")

        # приводим путь к абсолютному пути
        path = os.path.abspath(path)

        # создаем директорию
        try:
            os.makedirs(path, exist_ok=True)
            print(f"Directory created: {path}")
            return (pass_any, path, True,)
        except Exception as e:
            print(f"Error creating directory: {path}\n{e}")
            return (pass_any, path, False,)
