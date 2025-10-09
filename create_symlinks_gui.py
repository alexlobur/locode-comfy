#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Скрипт для создания симлинков папок с графическим интерфейсом
Запрашивает у пользователя исходную папку и целевую папку для создания симлинков
"""

import os
import sys
import shutil
import tkinter as tk
from tkinter import ttk, filedialog, messagebox, scrolledtext
from pathlib import Path
from typing import List, Tuple
import threading


class SymlinkCreatorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Создание симлинков для папок")
        self.root.geometry("480x640")
        self.root.resizable(True, True)
        
        # Переменные для хранения путей
        self.source_path = tk.StringVar()
        self.target_path = tk.StringVar()
        self.namespace = tk.StringVar()
        self.folders = []
        
        # Создаем интерфейс
        self.create_widgets()
        
        # Центрируем окно
        self.center_window()
    
    def center_window(self):
        """Центрировать окно на экране"""
        self.root.update_idletasks()
        width = self.root.winfo_width()
        height = self.root.winfo_height()
        x = (self.root.winfo_screenwidth() // 2) - (width // 2)
        y = (self.root.winfo_screenheight() // 2) - (height // 2)
        self.root.geometry(f'{width}x{height}+{x}+{y}')
    
    def create_widgets(self):
        """Создать элементы интерфейса"""
        # Главный фрейм
        main_frame = ttk.Frame(self.root, padding="24")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Настройка растягивания
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        
        # Заголовок
        title_label = ttk.Label( main_frame,
            text="Создание симлинков для папок", 
            font=("Arial", 16, "bold")
        )
        title_label.grid(row=0, column=0, columnspan=3, pady=(0, 20))
        
        # Шаг 1: Исходная папка
        ttk.Label(main_frame, text="Шаг 1: Исходные папки", font=("Arial", 12, "bold")).grid(
            row=1, column=0, columnspan=3, sticky=tk.W, pady=(0, 5))

        ttk.Label(main_frame, text="Путь к папке с исходными папками:").grid(
            row=2, column=0, columnspan=3, sticky=tk.W, pady=(0, 5))
        
        source_frame = ttk.Frame(main_frame)
        source_frame.grid(row=3, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 10))
        source_frame.columnconfigure(0, weight=1)
        
        self.source_entry = ttk.Entry(
            source_frame, textvariable=self.source_path, 
            # state="readonly"
        )
        self.source_entry.grid(row=0, column=0, sticky=(tk.W, tk.E), padx=(0, 5))
        
        ttk.Button(source_frame, text="Выбрать папку", 
                  command=self.select_source_folder).grid(row=0, column=1)
        
        # Шаг 2: Целевая папка
        ttk.Label(main_frame, text="Шаг 2: Целевая папка", 
                 font=("Arial", 12, "bold")).grid(row=4, column=0, columnspan=3, 
                                                 sticky=tk.W, pady=(10, 5))
        
        ttk.Label(main_frame, text="Корневая папка для создания симлинков:").grid(
            row=5, column=0, columnspan=3, sticky=tk.W, pady=(0, 5))
        
        target_frame = ttk.Frame(main_frame)
        target_frame.grid(row=6, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 10))
        target_frame.columnconfigure(0, weight=1)
        
        self.target_entry = ttk.Entry(target_frame, textvariable=self.target_path)
        self.target_entry.grid(row=0, column=0, sticky=(tk.W, tk.E), padx=(0, 5))
        
        ttk.Button(target_frame, text="Выбрать папку", 
                  command=self.select_target_folder).grid(row=0, column=1)
        
        # Шаг 3: Подпапка
        ttk.Label(main_frame, text="Имя подпапки:").grid(
            row=8, column=0, columnspan=1, sticky=tk.W, pady=(0, 5))

        self.namespace_entry = ttk.Entry(main_frame, textvariable=self.namespace)
        self.namespace_entry.grid(
            row=8, column=1, columnspan=2, sticky=(tk.W, tk.E),
            pady=(0, 5), padx=(5, 0)
        )
        
        # Кнопка сканирования
        self.scan_button = ttk.Button(main_frame, text="Сканировать папки", 
                                     command=self.scan_folders)
        self.scan_button.grid(row=10, column=0, columnspan=3, pady=(16, 10))
        
        # Список найденных папок
        ttk.Label(main_frame, text="Найденные папки:", 
                 font=("Arial", 10, "bold")).grid(row=11, column=0, columnspan=3, 
                                                 sticky=tk.W, pady=(0, 5))
        
        # Фрейм для списка папок
        list_frame = ttk.Frame(main_frame)
        list_frame.grid(row=12, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S), 
                       pady=(0, 10))
        list_frame.columnconfigure(0, weight=1)
        list_frame.rowconfigure(0, weight=1)
        
        # Список папок
        self.folders_listbox = tk.Listbox(list_frame, height=8)
        self.folders_listbox.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Скроллбар для списка
        scrollbar = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, 
                                 command=self.folders_listbox.yview)
        scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        self.folders_listbox.configure(yscrollcommand=scrollbar.set)
        
        # Настройка растягивания для списка
        main_frame.rowconfigure(12, weight=1)
        
        # Кнопки управления
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=13, column=0, columnspan=3, pady=(10, 0))
        
        self.create_button = ttk.Button(button_frame, text="Создать симлинки", 
                                       command=self.create_symlinks, state="disabled")
        self.create_button.pack(side=tk.LEFT, padx=(0, 10))
        
        ttk.Button(button_frame, text="Очистить", 
                  command=self.clear_all).pack(side=tk.LEFT, padx=(0, 10))
        
        ttk.Button(button_frame, text="Выход", 
                  command=self.root.quit).pack(side=tk.LEFT)
        
        # Область для вывода логов
        ttk.Label(main_frame, text="Лог выполнения:", 
                 font=("Arial", 10, "bold")).grid(row=14, column=0, columnspan=3, 
                                                 sticky=tk.W, pady=(10, 5))
        
        self.log_text = scrolledtext.ScrolledText(main_frame, height=8, state="disabled")
        self.log_text.grid(row=15, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S), 
                          pady=(0, 10))
        
        # Настройка растягивания для лога
        main_frame.rowconfigure(15, weight=1)
    
    def log_message(self, message, color="black"):
        """Добавить сообщение в лог"""
        self.log_text.configure(state="normal")
        self.log_text.insert(tk.END, message + "\n")
        self.log_text.configure(state="disabled")
        self.log_text.see(tk.END)
        self.root.update_idletasks()
    
    def select_source_folder(self):
        """Выбрать исходную папку"""
        folder = filedialog.askdirectory(title="Выберите исходную папку")
        if folder:
            self.source_path.set(folder)
            self.folders = []
            self.folders_listbox.delete(0, tk.END)
            self.create_button.configure(state="disabled")
            self.log_message(f"Выбрана исходная папка: {folder}")
    
    def select_target_folder(self):
        """Выбрать целевую папку"""
        folder = filedialog.askdirectory(title="Выберите целевую папку")
        if folder:
            self.target_path.set(folder)
            self.log_message(f"Выбрана целевая папка: {folder}")
    
    def validate_inputs(self):
        """Проверить корректность введенных данных"""
        if not self.source_path.get():
            messagebox.showerror("Ошибка", "Не выбрана исходная папка!")
            return False
        
        if not self.target_path.get():
            messagebox.showerror("Ошибка", "Не выбрана целевая папка!")
            return False
        
        if not self.namespace.get().strip():
            messagebox.showerror("Ошибка", "Не указана подпапка!")
            return False
        
        if not os.path.exists(self.source_path.get()):
            messagebox.showerror("Ошибка", "Исходная папка не существует!")
            return False
        
        return True
    
    def scan_folders(self):
        """Сканировать папки в исходной директории"""
        if not self.validate_inputs():
            return
        
        self.log_message("Сканирование папок...")
        self.folders = []
        self.folders_listbox.delete(0, tk.END)
        
        try:
            source = self.source_path.get()
            for item in os.listdir(source):
                item_path = os.path.join(source, item)
                if os.path.isdir(item_path):
                    self.folders.append(item_path)
            
            self.folders.sort()
            
            if not self.folders:
                self.log_message("В указанной папке не найдено подпапок!")
                messagebox.showwarning("Предупреждение", "В указанной папке не найдено подпапок!")
                return
            
            # Заполняем список
            for folder in self.folders:
                folder_name = os.path.basename(folder)
                self.folders_listbox.insert(tk.END, f"{folder_name} -> {folder}")
            
            self.create_button.configure(state="normal")
            self.log_message(f"Найдено папок: {len(self.folders)}")
            
        except Exception as e:
            error_msg = f"Ошибка при сканировании папки: {e}"
            self.log_message(error_msg)
            messagebox.showerror("Ошибка", error_msg)
    
    def create_symlink(self, source_path, target_path):
        """Создать симлинк"""
        try:
            # Проверяем, существует ли уже симлинк или папка
            if os.path.exists(target_path):
                result = messagebox.askyesno("Перезаписать?", 
                                           f"'{target_path}' уже существует!\nПерезаписать?")
                if result:
                    if os.path.isdir(target_path):
                        shutil.rmtree(target_path)
                    else:
                        os.remove(target_path)
                else:
                    return False
            
            # Создаем симлинк
            os.symlink(source_path, target_path)
            return True
            
        except OSError as e:
            if e.errno == 1314:  # ERROR_PRIVILEGE_NOT_HELD
                error_msg = "Недостаточно прав для создания симлинка!\nЗапустите программу от имени администратора."
                self.log_message(error_msg)
                messagebox.showerror("Ошибка прав", error_msg)
            else:
                error_msg = f"Не удалось создать симлинк: {e}"
                self.log_message(error_msg)
                messagebox.showerror("Ошибка", error_msg)
            return False
        except Exception as e:
            error_msg = f"Неожиданная ошибка: {e}"
            self.log_message(error_msg)
            messagebox.showerror("Ошибка", error_msg)
            return False
    
    def create_symlinks(self):
        """Создать симлинки"""
        if not self.validate_inputs() or not self.folders:
            return
        
        # Подтверждение
        confirm_msg = (f"Создать симлинки?\n\n"
                      f"Исходная папка: {self.source_path.get()}\n"
                      f"Целевая папка: {self.target_path.get()}\n"
                      f"Подпапка: {self.namespace.get()}\n"
                      f"Количество папок: {len(self.folders)}")
        
        if not messagebox.askyesno("Подтверждение", confirm_msg):
            return
        
        # Запускаем создание симлинков в отдельном потоке
        thread = threading.Thread(target=self._create_symlinks_thread)
        thread.daemon = True
        thread.start()
    
    def _create_symlinks_thread(self):
        """Создание симлинков в отдельном потоке"""
        self.create_button.configure(state="disabled")
        self.log_message("Начало создания симлинков...")
        self.log_message("-" * 50)
        
        success_count = 0
        error_count = 0
        
        for folder in self.folders:
            folder_name = os.path.basename(folder)
            symlink_path = os.path.join(self.target_path.get(), folder_name, self.namespace.get())
            
            self.log_message(f"Обработка: {folder_name}")
            self.log_message(f"  Исходный путь: {folder}")
            self.log_message(f"  Симлинк: {symlink_path}")
            
            if self.create_symlink(folder, symlink_path):
                self.log_message(f"  УСПЕХ: Симлинк создан!")
                success_count += 1
            else:
                error_count += 1
            
            self.log_message("")
        
        # Итоговая статистика
        self.log_message("=" * 50)
        self.log_message("Результат выполнения")
        self.log_message("=" * 50)
        self.log_message(f"Успешно создано симлинков: {success_count}")
        self.log_message(f"Ошибок: {error_count}")
        
        if error_count > 0:
            self.log_message("ВНИМАНИЕ: Некоторые симлинки не были созданы.")
            self.log_message("Убедитесь, что у вас есть права администратора.")
        
        self.create_button.configure(state="normal")
        
        # Показываем итоговое сообщение
        result_msg = f"Операция завершена!\n\nУспешно: {success_count}\nОшибок: {error_count}"
        if error_count > 0:
            messagebox.showwarning("Результат", result_msg)
        else:
            messagebox.showinfo("Результат", result_msg)
    
    def clear_all(self):
        """Очистить все поля"""
        self.source_path.set("")
        self.target_path.set("")
        self.namespace.set("")
        self.folders = []
        self.folders_listbox.delete(0, tk.END)
        self.create_button.configure(state="disabled")
        self.log_text.configure(state="normal")
        self.log_text.delete(1.0, tk.END)
        self.log_text.configure(state="disabled")


def main():
    """Основная функция"""
    root = tk.Tk()
    app = SymlinkCreatorGUI(root)
    root.mainloop()


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Неожиданная ошибка: {e}")
        print("Программа завершена.")
