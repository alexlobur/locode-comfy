from ...utils.anytype import any_type
import math

#---
#
#   Преобразует любой тип в Bool
#
#---

class LoToBool:

    NODE_MAPPINGS = ("LoToBool", "Lo:ToBool")
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
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "any_type": (any_type, ),
            },
        }


    RETURN_TYPES = ( "BOOLEAN", )
    RETURN_NAMES = ("BOOL", )
    FUNCTION = "execute"


    def execute(self, any_type):
        try:
            if any_type is None:
                return (False,)

            if isinstance(any_type, (int, float)):
                return (bool(any_type),)
            
            if isinstance(any_type, str):
                # Для строк проверяем специальные значения
                if any_type.lower().strip() in ("false", "0", "no", "off", ""):
                    return (False,)
                return (bool(any_type),)

            # Общий случай
            return (bool(any_type),)
            
        except Exception as e:
            raise ValueError(f"Error converting to boolean: {any_type}. Error: {str(e)}")
