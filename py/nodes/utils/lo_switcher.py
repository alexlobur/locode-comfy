from ...utils.anytype import any_type, FlexibleOptionalInputType


#---
#
#   Выбрать значение из списка по индексу
#
#---

class LoSwitcher:

    NODE_MAPPINGS = ("LoSwitcher", "Switcher") # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    AUTHOR = "LoCode"
    CATEGORY = "locode/utils"
    DESCRIPTION = """
Selects a value from a list of values based on the index_seed.
The index_seed is wrapped using modulo. So if index_seed=10 and list has 7 items, then the result index will be 10 % 7 = 3.
Supports lazy loading: asks ComfyUI to calculate only the required input.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def INPUT_TYPES(cls):
        lazy_opts = {"lazy": True}
        return {
            "required": {
                "index_seed": ("INT", {"default": 0, "step": 1, "tooltip": "The index to select the value from the list"}),
            },
            "optional": FlexibleOptionalInputType(any_type, options=lazy_opts),
        }

    RETURN_TYPES = (any_type,)
    RETURN_NAMES = ('*',)
    FUNCTION = "execute"


    def check_lazy_status(self, index_seed, **kwargs):
        input_names = list(kwargs.keys())
        if not input_names:
            return
        target = input_names[index_seed % len(input_names)]
        if kwargs.get(target) is None:
            return [target]


    def execute(self, index_seed, **kwargs):
        available = [(k, v) for k, v in kwargs.items() if v is not None]
        if not available:
            raise ValueError("No values provided")

        key, value = available[index_seed % len(available)]
        return (value,)

