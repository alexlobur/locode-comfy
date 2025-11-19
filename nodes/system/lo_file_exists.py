#---
#
#   Проверка наличия директории или файла
#
#---

import os


class LoFileExists:

    NODE_MAPPINGS = ("LoReadDir", "Lo:ReadDir")
    CATEGORY = "locode/system"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Reads the contents of a directory.
Outputs:
- `all`: List of files and directories in the directory.
- `files`: List of files in the directory.
- `dirs`: List of directories in the directory.
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

    CATEGORY = "locode/system"
    AUTHOR = "LoCode"
    DESCRIPTION = """
    Checks if a file or directory exists.
    Outputs:
    - `exists`: True if the file or directory exists, False otherwise.
"""


    #
    #   Вычисляем значение
    #
    def execute(self, path: str):
        exists = os.path.exists(path) 
        return (exists, exists & os.path.isdir(path))

