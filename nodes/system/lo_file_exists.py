#---
#
#   Проверка наличия директории или файла
#
#---

import os


class LoFileExists:

    NODE_MAPPINGS = ("LoFileExists", "Lo:FileExists")
    CATEGORY = "locode/system"
    AUTHOR = "LoCode"
    DESCRIPTION = """
    Checks if a file or directory exists.
    Outputs:
    - `exists`: True if the file or directory exists, False otherwise.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


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

    RETURN_TYPES = ( "BOOLEAN", "BOOLEAN" )
    RETURN_NAMES = ("exists", "is_dir")
    FUNCTION = "execute"

    #
    #   Вычисляем значение
    #
    def execute(self, path: str):
        exists = os.path.exists(path) 
        return (exists, exists & os.path.isdir(path))

