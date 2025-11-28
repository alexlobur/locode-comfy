from ...utils.anytype import *

#---
#
#   Вычислить результат выражения с переменными.
#
#---
class LoTest:

    NODE_MAPPINGS = ("LoTest", "Lo:Test")
    AUTHOR = "LoCode"
    CATEGORY = "locode/test"
    DESCRIPTION = """
Test...
    """

    # DEPRECATED = True
    EXPERIMENTAL = True

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "test": ( any_type, ),
            },
            "hidden": {
                "test_hidden": "TEST"
            }
        }

    RETURN_TYPES = ( any_type, )
    RETURN_NAMES = ("test", )
    FUNCTION = "execute"


    def execute(self, test, test_hidden):
        print(test, test_hidden)
        return test
