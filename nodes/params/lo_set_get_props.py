from ...utils.anytype import any_type, ByPassTypeTuple


#---
#
#   Формирует tuple из входных параметров
#
#---
class LoSetProps:

    NODE_MAPPINGS = ("LoSetProps", "Lo:SetProps") # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    CATEGORY = "locode/params"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Create params for LoGet
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {}


    RETURN_TYPES = ("LO_PROPS", )
    RETURN_NAMES = ("props", )
    FUNCTION = "execute"


    def execute(self, **kwargs):
        result = tuple(kwargs.values())
        return (result, )



#---
#
#   Формирует выходные параметры из tuple
#
#---
class LoGetProps:

    NODE_MAPPINGS = ("LoGetProps", "Lo:GetProps") # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    CATEGORY = "locode/params"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Get props from LoSet
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "props": ("LO_PROPS",),
            },
        }


    RETURN_TYPES = ByPassTypeTuple((any_type, ))
    FUNCTION = "execute"


    def execute(self, props: tuple):
        return props

