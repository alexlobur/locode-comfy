#---
#
#   Объединет два списка в один
#
#---
class LoListsMerge:

    NODE_MAPPINGS = ("LoListsMerge", "Lo:ListsMerge") # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    CATEGORY = "locode/lists"
    AUTHOR = "LoCode"
    DESCRIPTION = """
Merging lists in one list
"""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return True


    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "remove_dupes": ( "BOOLEAN", { "default": False, "tooltip" : "Remove duplacates" }),
            },
        }

    RETURN_TYPES = ( "LIST", "INT", )
    RETURN_NAMES = ("list", "length", )
    FUNCTION = "execute"


    #
    #   Вычисляем значение
    #
    def execute(self, remove_dupes: bool, **kwargs):

        # объединяем списки в один полученные в kwargs
        merged = []
        for value in kwargs.values():
            if isinstance(value, list):
                merged.extend(value)
            else:
                # если значение не список, то добавляем его в список
                merged.append(value)

        # удаляем дубликаты если remove_dupes = True
        if remove_dupes:
            seen = set()
            unique_merged = []
            for item in merged:
                if item not in seen:
                    seen.add(item)
                    unique_merged.append(item)
            merged = unique_merged

        # Возвращаем результат
        return (merged, len(merged), )
