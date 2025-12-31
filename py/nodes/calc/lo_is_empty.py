from ...utils.anytype import any_type


#---
#
#   Проверка данных на пустоту
#
#---
class LoIsEmpty:

    NODE_MAPPINGS = ("LoIsEmpty", "IsEmpty")
    AUTHOR = "LoCode"
    CATEGORY = "locode/calc"
    DESCRIPTION = """
Check value of any type for Empty.

## Check Rules:
- **None** → `True`
- **Strings**:
  - "" → `True`
- **Collections**
  - (lists, dicts, sets, tuples): Empty → `True`

Use IsNone [lo] to precisely check for None.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "optional": {
                "any": ( any_type, ),
            },
        }

    RETURN_TYPES = ("BOOLEAN",)
    RETURN_NAMES = ("bool",)
    FUNCTION = "execute"

    def execute(self, any=None):
        try:
            return (check_empty(any),)
        except Exception as e:
            raise ValueError(f"Error checking empty: {any}. Error: {str(e)}")


def check_empty(any) -> bool:

    # Check for None
    if any is None:
        return True

    # Check for empty string
    if isinstance(any, str):
        return any.strip() == ""

    # Check for empty collection
    if isinstance(any, (list, dict, set, tuple)):
        return len(any) == 0

    return False

