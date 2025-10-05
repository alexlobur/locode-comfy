# locode custom nodes for ComfyUI

Установка:
- Поместите папку `locode` в директорию `ComfyUI/custom_nodes/`.
- Перезапустите ComfyUI или используйте Reload Custom Nodes.

Структура:
- `locode_nodes.py` — реестр узлов (импорты и маппинги)
- `nodes/` — модули с узлами (например, `math.py`)
- `utils/` — вспомогательные утилиты

Добавление узла:
- Скопируйте `nodes/template_node.py` как основу.
- Импортируйте класс в `locode_nodes.py` и добавьте в `NODE_CLASS_MAPPINGS` и `NODE_DISPLAY_NAME_MAPPINGS`.

Текущие узлы:
- `LoAdd` — сложение двух чисел.
- `LoMathOp` — операции add/sub/mul/div c выбором типов входов (FLOAT/INT).
