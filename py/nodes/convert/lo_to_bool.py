from ...utils.anytype import any_type


#---
#
#   Преобразует любой тип в Bool
#
#---

class LoToBool:

    NODE_MAPPINGS = ("LoToBool", "ToBool")
    AUTHOR = "LoCode"
    CATEGORY = "locode/convert"
    DESCRIPTION = """
Converts any type to Boolean.

## Conversion Rules:
- **None** → `False`
- **Numbers**: `0` → `False`, any other number → `True`
- **Strings**:
  - "false", "0", "no", "off", "" (empty) → `False`
  - Any other non-empty string → `True`
- **Collections**
  - (lists, dicts, etc.): Empty → `False`
  - non-empty → `True`
- **Other types**:
  - Standard Python `bool()` conversion
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "optional": {
                "any": (any_type, { "tooltip": "Any type to convert to boolean" }),
            },
            "required": {
                "invert": ("BOOLEAN", { "default": False, "tooltip": "Invert the boolean value" }),
            },
        }


    RETURN_TYPES = ( "BOOLEAN", )
    RETURN_NAMES = ("bool", )
    FUNCTION = "execute"


    def execute(self, any = None, invert: bool = False):
        try:
            bool_value = get_bool(any)
            return (not bool_value,) if invert else (bool_value,)
        except Exception as e:
            raise ValueError(f"Error converting to boolean: {any}. Error: {str(e)}")


def get_bool(any) -> bool:
    if any is None:
        return False

    if isinstance(any, (int, float)):
        return bool(any)
    
    if isinstance(any, str):
        # Для строк проверяем специальные значения
        if any.lower().strip() in ("false", "0", "no", "off", ""):
            return False
        return bool(any)

    # Общий случай
    return bool(any)
