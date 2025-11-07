import os
import shutil
from ...utils.anytype import any_type


#---
#
#   Удаляет директорию
#
#---

class LoRmDir:
    """
    Удаляет директорию.

    Правила:
      - На вход принимаются:
        - путь к директории (STRING). Путь может быть относительным.
    """


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


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

    RETURN_TYPES = ( any_type, )
    RETURN_NAMES = ("pass_any",)
    FUNCTION = "execute"

    CATEGORY = "locode/system"
    AUTHOR = "LoCode"
    DESCRIPTION = """
    Removes a directory.
"""


    #
    #   Запуск функции
    #
    def execute(self, path: str, pass_any):
        print(f"[LoRmDir] Removing directory: {path}")
        try:
            # удаляем директорию (даже если она не пустая)
            if os.path.exists(path):
                shutil.rmtree(path)
            return (pass_any,)
        except Exception as e:
            print(f"[LoRmDir] Error removing directory: {e}")
            return (pass_any,)
