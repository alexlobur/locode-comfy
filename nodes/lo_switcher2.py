from ..utils.utils import *


def is_none(value):
  """Checks if a value is none. Pulled out in case we want to expand what 'None' means."""
  return value is None


class LoSwitcher2:
  """The dynamic Any Switch. """

  EXPERIMENTAL = True
  CATEGORY = "locode"

  @classmethod
  def INPUT_TYPES(cls):  # pylint: disable = invalid-name, missing-function-docstring
    return {
      "required": {},
      "optional": FlexibleOptionalInputType(any_type),
    }

  RETURN_TYPES = (any_type,)
  RETURN_NAMES = ('*',)
  FUNCTION = "switch"

  def switch(self, **kwargs):
    """Chooses the first non-empty item to output."""
    any_value = None
    for key, value in kwargs.items():
      if key.startswith('any_') and not is_none(value):
        any_value = value
        break
    return (any_value,)
