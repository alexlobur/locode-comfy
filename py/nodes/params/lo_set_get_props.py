from ...utils.anytype import any_type, ByPassTypeTuple


#---
#
#   Формирует tuple из входных параметров
#
#---
class LoSetProps:

    NODE_MAPPINGS = ("LoSetProps", "SetProps")
    CATEGORY = "locode/params"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Packs data into a single tuple for the `GetProps` node.
Can accept any number of input parameters. Data types will be automatically packed into a tuple.
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "hidden": {
                "props_types": "LIST",
            }
        }

    RETURN_TYPES = ("LO_PROPS", )
    RETURN_NAMES = ("props", )
    FUNCTION = "execute"


    def execute(self, props_types, **kwargs) -> tuple:
        props = tuple(kwargs.values())                # кортеж из значений входных параметров
        types_list = props_types.get('__value__', props_types)  # извлекаем список типов

        # формируем объект параметров
        result = LoProps(props, types_list)
        return (result, )



#---
#
#   Формирует выходные параметры из tuple
#
#---
class LoGetProps:

    NODE_MAPPINGS = ("LoGetProps", "GetProps") # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    CATEGORY = "locode/params"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Extracts a tuple of input parameters from the Lo:SetProps node.
Can accept a tuple from any Lo:SetProps node provided that the tuple contains similar data types.

RU:
Разбирает кортеж из узла Lo:SetProps на входные параметры.
Может принимать кортеж из любого узла Lo:SetProps, при условии, что кортеж будет содержать аналогичные типы данных.

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
            "hidden": {
                "props_types": "LIST",
            }
        }


    RETURN_TYPES = ByPassTypeTuple((any_type, ))
    FUNCTION = "execute"


    def execute(self, props: "LoProps", props_types) -> tuple:

        # список типов текущего узла
        getter_types: list[str] = props_types.get('__value__', props_types)
        setter_types: list[str] = props.props_types

        # проверяем, что типы данных соответствуют свойствам, если не соответствуют, то выбрасываем ошибку
        index = 0
        for setter_type, getter_type in zip(setter_types, getter_types):
            index += 1
            if getter_type.upper() in ("*", "ANY"):
                continue
            if setter_type.upper() not in ("*", "ANY", getter_type.upper()):
                raise ValueError(f"Type mismatch: setter[{index}]='{setter_type}' does not match getter[{index}]='{getter_type}'")

        # возвращаем tuple из props и значений props.props
        # return props.props
        return (props, ) + props.props
         


#---
#
#   Параметры данных
#
#---
class LoProps:
    def __init__(self, props: tuple, props_types: list[str]):
        self.props = props
        self.props_types = props_types

    def __str__(self):
        return f"props: {self.props}, props_types: {self.props_types}"

