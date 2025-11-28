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
#  Подгоняем значение к диапазону значений.
#
def fit_val(value: any, min: any, max: any) -> any:
    """
    Подгоняем значение к диапазону значений.
    Args:
        - `value` (any): Значение
        - `min` (any): Минимальное значение
        - `max` (any): Максимальное значение
    Returns:
        - `any`: Значение в диапазоне
    """
    return max if value > max else min if value < min else value
