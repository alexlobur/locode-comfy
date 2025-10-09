#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Скрипт для создания симлинков папок
Запрашивает у пользователя исходную папку и целевую папку для создания симлинков
"""

import os
import sys
import shutil
from pathlib import Path
from typing import List, Tuple


def get_user_input(prompt: str, default: str = None) -> str:
    """Получить ввод от пользователя с возможностью значения по умолчанию"""
    if default:
        user_input = input(f"{prompt} [{default}]: ").strip()
        return user_input if user_input else default
    else:
        while True:
            user_input = input(f"{prompt}: ").strip()
            if user_input:
                return user_input
            print("Ошибка: Путь не может быть пустым!")


def validate_directory(path: str, create_if_not_exists: bool = False) -> bool:
    """Проверить существование директории и предложить создать при необходимости"""
    if os.path.exists(path):
        if os.path.isdir(path):
            return True
        else:
            print(f"Ошибка: '{path}' существует, но это не папка!")
            return False
    
    if create_if_not_exists:
        try:
            os.makedirs(path, exist_ok=True)
            print(f"Папка '{path}' создана успешно.")
            return True
        except Exception as e:
            print(f"Ошибка при создании папки '{path}': {e}")
            return False
    else:
        print(f"Ошибка: Папка '{path}' не существует!")
        return False


def scan_folders(source_path: str) -> List[str]:
    """Сканировать папку и получить список всех подпапок"""
    folders = []
    try:
        for item in os.listdir(source_path):
            item_path = os.path.join(source_path, item)
            if os.path.isdir(item_path):
                folders.append(item_path)
    except Exception as e:
        print(f"Ошибка при сканировании папки '{source_path}': {e}")
    
    return sorted(folders)


def create_symlink(source_path: str, target_path: str) -> bool:
    """Создать симлинк"""
    try:
        # Проверяем, существует ли уже симлинк или папка
        if os.path.exists(target_path):
            print(f"    ПРЕДУПРЕЖДЕНИЕ: '{target_path}' уже существует!")
            overwrite = input("  Перезаписать? (y/n): ").strip().lower()
            if overwrite in ['y', 'yes', 'да', 'д']:
                if os.path.isdir(target_path):
                    shutil.rmtree(target_path)
                else:
                    os.remove(target_path)
            else:
                print("  Пропущено.")
                return False
        
        # Создаем симлинк
        os.symlink(source_path, target_path)
        return True
        
    except OSError as e:
        if e.errno == 1314:  # ERROR_PRIVILEGE_NOT_HELD
            print(f"\033[91m    ОШИБКА: Недостаточно прав для создания симлинка!\033[0m")
            print(f"  Запустите скрипт от имени администратора.")
        else:
            print(f"\033[91m    ОШИБКА: Не удалось создать симлинк: {e}\033[0m")
        return False
    except Exception as e:
        print(f"\033[91m    ОШИБКА: Неожиданная ошибка: {e}\033[0m")
        return False


def main():
    """Основная функция"""

    # очищаем экран
    os.system('cls' if os.name == 'nt' else 'clear')

    # выводим заголовок
    print("=" * 50)
    print("    Создание симлинков для папок")
    print("=" * 50)
    print()

   
    # Запрашиваем исходную папку
    print("\033[34mШаг 1: Выбор исходной папки\033[0m")
    print("Введите путь к папке, содержащей папки для создания симлинков")
    source_path = get_user_input("Исходная папка")
    
    if not validate_directory(source_path):
        print("Программа завершена.")
        return
    
    # Сканируем папки в исходной директории
    print(f"\nСканирование папки: {source_path}")
    folders = scan_folders(source_path)
    
    if not folders:
        print("В указанной папке не найдено подпапок!")
        return
    
    print(f"Найдено папок {len(folders)}:")
    for i, folder in enumerate(folders, 1):
        folder_name = os.path.basename(folder)
        print(f"  {i}. {folder_name} -> {folder}")
    
    # Запрашиваем целевую папку
    print(f"\n\033[34mШаг 2: Выбор целевой папки\033[0m")
    print("Путь к корневой папке, в которой будут созданы симлинки")
    target_path = get_user_input("Целевая папка")
    
    if not validate_directory(target_path, create_if_not_exists=True):
        print("Программа завершена.")
        return

    # запрашиваем подпапку в целевой папке
    print(f"\n\033[34mШаг 3: Выбор подпапки в целевой папке\033[0m")
    print(f"К каждой папке будет добавляться указанная подпапка")

    while True:
        namespace = get_user_input("Подпапка в целевой папке", "")
        if namespace.strip() == "":
            print("\033[91m  ОШИБКА: Подпапка не может быть пустой.\033[0m")
        else:
            break

    # Подтверждение
    print(f"\n\033[34mПодтверждение:\033[0m")
    print(f"Исходная папка: {source_path}")
    print(f"Целевая папка: {target_path}")
    print(f"Подпапка в целевой папке: {namespace}")
    print(f"Количество папок для обработки: {len(folders)}")

    confirm = input("\nПродолжить? (y/n): ").strip().lower()
    if confirm not in ['y', 'yes', 'да', 'д']:
        print("Операция отменена.")
        return
    
    # Создаем симлинки
    print(f"\nСоздание симлинков...")
    print("-" * 50)
    
    success_count = 0
    error_count = 0
    
    for folder in folders:
        folder_name = os.path.basename(folder)
        symlink_path = os.path.join(target_path, folder_name, namespace)
        
        print(f"\033[32m  Обработка: {folder_name}\033[0m")
        print(f"    Исходный путь: {folder}")
        print(f"    Симлинк: {symlink_path}")

        if create_symlink(folder, symlink_path):
            print(f"\033[32m    УСПЕХ: Симлинк создан!\033[0m")
            success_count += 1
        else:
            error_count += 1
        
        print()
    
    # Итоговая статистика
    print("=" * 50)
    print("    Результат выполнения")
    print("=" * 50)
    print(f"\033[32m  Успешно создано симлинков: {success_count}\033[0m")
    print(f"\033[91m  Ошибок: {error_count}\033[0m")
    
    if error_count > 0:
        print("\nВНИМАНИЕ: Некоторые симлинки не были созданы.")
        print("Убедитесь, что у вас есть права администратора.")
    
    print("\nНажмите Enter для выхода...")
    input()



#---
#
#   Основная функция
#
#---
if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nОперация прервана пользователем.")
    except Exception as e:
        print(f"\nНеожиданная ошибка: {e}")
        print("Программа завершена.")
