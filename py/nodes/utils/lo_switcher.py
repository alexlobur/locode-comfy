from ...utils.anytype import any_type


class LoSwitcher:
  """The dynamic Any Switch. """

  # NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
  NODE_MAPPINGS = ("LoSwitcher", "Lo:Switcher")

  @classmethod
  def INPUT_TYPES(cls):  # pylint: disable = invalid-name, missing-function-docstring
    return {
      "required": {
          "index_seed": ("INT", {"default": 0, "step": 1}),
      },
      # "optional": FlexibleOptionalInputType(any_type),
    }

  RETURN_TYPES = (any_type,)
  RETURN_NAMES = ('*',)
  FUNCTION = "execute"

  CATEGORY = "locode/utils"
  AUTHOR = "LoCode"
  DESCRIPTION = """
Selects a value from a list of values based on the index_seed.
The index_seed is wrapped using modulo. So if index_seed=10 and list has 7 items, then the result index will be 10 % 7 = 3.
"""


  def execute(self, index_seed, **kwargs):

    # формируем список из не пустых значений
    values = []
    for key, value in kwargs.items():
      if key.startswith('any') and value is not None:
        values.append(value)

    # считаем количество значений в списке
    values_count = len(values)

    # проверяем, что есть хотя бы одно значение
    if values_count == 0:
      raise ValueError("No values provided")

    # возвращаем значение из списка по индексу
    return (values[index_seed % values_count],)

