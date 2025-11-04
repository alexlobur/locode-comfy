import os

#---
#
#   Создает директорию если не существует
#
#---

class LoMkDir:
    """
    Создает директорию если не существует.

    Правила:
      - На вход принимаются:
        - путь к директории (STRING). Путь может быть относительным
    """


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "path": ("STRING", {"default": "", "tooltip": "Path to the directory to create" }),
            },
        }

    RETURN_TYPES = ( "STRING", "BOOLEAN", )
    RETURN_NAMES = ( "path", "created", )
    FUNCTION = "execute"

    CATEGORY = "locode/system"
    AUTHOR = "LoCode"
    DESCRIPTION = """
    Creates a directory if it doesn't exist.
    Outputs:
    - `created`: True if the directory was created, False otherwise.
"""


    #
    #   Вычисляем значение
    #
    def execute(self, path: str):

        # создаем директорию
        try:
            os.makedirs(path, exist_ok=True)
            return (path, True,)
        except Exception as e:
            print(f"Error creating directory: {e}")
            return (path, False,)
