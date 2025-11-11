class LoComment:
  """The dynamic Any Switch. """

  CATEGORY = "locode/helpers"

  @classmethod
  def INPUT_TYPES(cls):  # pylint: disable = invalid-name, missing-function-docstring
    return {
    }

  RETURN_TYPES = ()
  RETURN_NAMES = ()
  FUNCTION = "execute"

  NODE_CLASS_MAPPING = "LoComment"
  NODE_DISPLAY_NAME = "Lo:Comment"

  def execute(self):
    return ()
