import json
import random
import re
import itertools
from ...utils.anytype import any_type


#---
#
#   Dynamic Prompt
#
#---
class LoDynamicPrompt:

    NODE_MAPPINGS = ("LoDynamicPrompt", "DynamicPrompt") # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    CATEGORY = "locode/texts"
    AUTHOR = "LoCode"
    DESCRIPTION = """

Создает список промптов на основе входной строки и seed.
Работает по аналогии с A1111 Dynamic Prompts.

Распознает в тексте блоки вида:
- {text1|text2|text3} - случайный выбор из списка
- [text1|text2|text3] - список промптов

"""

    EXPERIMENTAL = True

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "optional": {
                "string": ("STRING", {"default": "", "multiline": True}),
                "rand_seed": ("INT", {"default": 0 }),
                "index_seed": ("INT", {"default": 0 }),
            }
        }

    RETURN_TYPES = ("STRING", "LIST", )
    RETURN_NAMES = ("prompt", "list_of_prompts", )
    FUNCTION = "execute"

    #
    #   Вычисляем значение
    #
    def execute(self, string: str="", index_seed: int=0, rand_seed: int=0):

        return (prompt, prompts)