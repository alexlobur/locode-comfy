/**
 * ПРИМЕРЫ: Как добавить кнопки в меню ComfyUI
 * 
 * Этот файл содержит примеры кода для добавления:
 * 1. Кнопок в верхнее меню (Topbar Menu)
 * 2. Вкладок в левое меню (Sidebar Tabs)
 */

import {app} from "../../../../scripts/app.js"

// ============================================
// ПРИМЕР 1: Добавление кнопки в ВЕРХНЕЕ МЕНЮ
// ============================================

app.registerExtension({
    name: "locode.menu.example.topbar",
    
    // Определяем команды
    commands: [
        {
            id: "myCustomCommand",
            label: "Моя команда",
            function: () => {
                alert("Выполнена моя команда!");
                console.log("Команда выполнена");
            }
        },
        {
            id: "saveWorkflow",
            label: "Сохранить workflow",
            function: () => {
                // Ваш код для сохранения
                console.log("Сохранение workflow...");
            }
        }
    ],
    
    // Добавляем команды в меню
    menuCommands: [
        // Добавить в существующее меню "File"
        {
            path: ["File"],
            commands: ["saveWorkflow"]
        },
        // Создать новое подменю "Extensions" -> "LoCode"
        {
            path: ["Extensions", "LoCode"],
            commands: ["myCustomCommand"]
        }
    ]
});


// ============================================
// ПРИМЕР 2: Добавление вкладки в ЛЕВОЕ МЕНЮ (Sidebar)
// ============================================

app.registerExtension({
    name: "locode.menu.example.sidebar",
    
    async setup(app) {
        // Регистрируем вкладку в боковой панели
        app.extensionManager.registerSidebarTab({
            id: "locodeCustomTab",
            icon: "pi pi-code", // Иконка (PrimeIcons, Material Design, Font Awesome)
            title: "LoCode",
            tooltip: "Панель LoCode",
            type: "custom",
            render: (el) => {
                // Создаем содержимое вкладки
                el.innerHTML = `
                    <div style="padding: 10px;">
                        <h3>Моя кастомная панель</h3>
                        <button id="myButton" style="padding: 8px 16px; margin: 5px;">
                            Нажми меня
                        </button>
                        <div id="content" style="margin-top: 10px;">
                            Содержимое панели...
                        </div>
                    </div>
                `;
                
                // Добавляем обработчик события
                el.querySelector('#myButton').addEventListener('click', () => {
                    alert('Кнопка нажата!');
                });
            }
        });
    }
});


// ============================================
// ПРИМЕР 3: Комплексный пример с несколькими командами
// ============================================

app.registerExtension({
    name: "locode.menu.example.complex",
    
    commands: [
        {
            id: "exportData",
            label: "Экспорт данных",
            function: () => {
                // Логика экспорта
                console.log("Экспорт данных...");
            }
        },
        {
            id: "importData",
            label: "Импорт данных",
            function: () => {
                // Логика импорта
                console.log("Импорт данных...");
            }
        },
        {
            id: "settings",
            label: "Настройки",
            function: () => {
                // Открыть настройки
                console.log("Открытие настроек...");
            }
        }
    ],
    
    menuCommands: [
        // Создаем подменю "LoCode" -> "Данные"
        {
            path: ["Extensions", "LoCode", "Данные"],
            commands: ["exportData", "importData"]
        },
        // Добавляем в существующее меню "Settings"
        {
            path: ["Settings"],
            commands: ["settings"]
        }
    ],
    
    async setup(app) {
        // Также добавляем вкладку в sidebar
        app.extensionManager.registerSidebarTab({
            id: "locodeDataPanel",
            icon: "pi pi-database",
            title: "Данные",
            tooltip: "Управление данными",
            type: "custom",
            render: (el) => {
                el.innerHTML = `
                    <div style="padding: 15px;">
                        <h3>Управление данными</h3>
                        <button id="exportBtn" style="width: 100%; padding: 10px; margin: 5px 0;">
                            Экспорт
                        </button>
                        <button id="importBtn" style="width: 100%; padding: 10px; margin: 5px 0;">
                            Импорт
                        </button>
                    </div>
                `;
                
                el.querySelector('#exportBtn').addEventListener('click', () => {
                    // Вызываем команду экспорта
                    const command = app.extensionManager.getCommand("exportData");
                    if (command) command.function();
                });
                
                el.querySelector('#importBtn').addEventListener('click', () => {
                    // Вызываем команду импорта
                    const command = app.extensionManager.getCommand("importData");
                    if (command) command.function();
                });
            }
        });
    }
});


// ============================================
// ПРИМЕР 4: Использование React компонента в Sidebar
// ============================================

/*
// Если вы используете React:
import React from "react";
import ReactDOM from "react-dom/client";

app.registerExtension({
    name: "locode.menu.example.react",
    
    async setup(app) {
        app.extensionManager.registerSidebarTab({
            id: "locodeReactTab",
            icon: "pi pi-star",
            title: "React Tab",
            type: "custom",
            render: (el) => {
                const container = document.createElement("div");
                container.id = "react-container";
                el.appendChild(container);
                
                // Монтируем React компонент
                ReactDOM.createRoot(container).render(
                    <React.StrictMode>
                        <MyReactComponent />
                    </React.StrictMode>
                );
            }
        });
    }
});
*/


// ============================================
// СПРАВКА ПО ИКОНКАМ
// ============================================

/*
Доступные наборы иконок:

1. PrimeIcons (pi):
   - pi pi-home
   - pi pi-code
   - pi pi-database
   - pi pi-cog
   - pi pi-star
   - pi pi-compass
   - и другие...

2. Material Design Icons (mdi):
   - mdi mdi-robot
   - mdi mdi-palette
   - mdi mdi-settings
   - и другие...

3. Font Awesome (fa):
   - fa-solid fa-star
   - fa-regular fa-file
   - и другие...
*/
