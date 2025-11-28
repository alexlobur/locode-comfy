import os

#---
#
#   Читает содержимое директории
#
#---

class LoReadDir:

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
                "path": ("STRING", {"default": "", "tooltip": "Path to the directory to read" }),
            },
        }

    RETURN_TYPES = ( "LIST", "LIST", "LIST" )
    RETURN_NAMES = ("all", "files", "dirs")
    FUNCTION = "execute"

    #
    #   Вычисляем значение
    #
    def execute(self, path: str):

        # читаем содержимое директории
        all = os.listdir(path)
        files = [f for f in all if os.path.isfile(os.path.join(path, f))]
        dirs = [d for d in all if os.path.isdir(os.path.join(path, d))]
        return (all, files, dirs)
