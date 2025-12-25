import os


#---
#
#   Утилиты
#
#---

# Подгоняем значение к диапазону значений.
def fit_value(value: any, max: any, min: any) -> any:
    """
    Подгоняем значение к диапазону значений.
    Args:
        - `value` (any): Значение
        - `max` (any): Максимальное значение
        - `min` (any): Минимальное значение
    Returns:
        - `any`: Значение в диапазоне
    """
    return max if value > max else min if value < min else value


#
#  Приводим значение к диапазону значений.
#
def fit_val(value: any, min: any, max: any) -> any:
    """
    Приводим значение к диапазону значений.
    Args:
        - `value` (any): Значение
        - `min` (any): Минимальное значение
        - `max` (any): Максимальное значение
    Returns:
        - `any`: Значение в диапазоне
    """
    return max if value > max else min if value < min else value


#
# Абсолютный путь к папке ComfyUI.
#
def comfyui_abspath(path: str) -> str:
    return os.path.abspath(path)

