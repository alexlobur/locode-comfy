// Кастомный виджет для массива текстов с закладками
import { app } from "../../scripts/app.js";

class TextArrayWidget {
    constructor(node, inputName, inputData, app) {
        this.node = node;
        this.inputName = inputName;
        this.inputData = inputData;
        this.app = app;
        
        // Инициализируем данные
        this.texts = [];
        this.activeTab = 0;
        this.tabs = [];
        this.textInputs = [];
        this.collapsed = true;
        
        // Создаем интерфейс
        this.createInterface();
        
        // Добавляем обработчики событий
        this.setupEventListeners();
        
        // Сворачиваем по умолчанию
        this.toggleCollapse();
    }
    
    createInterface() {
        // Создаем контейнер для виджета
        this.container = document.createElement("div");
        this.container.className = "text-array-widget";
        this.container.style.cssText = `
            width: 100%;
            margin: 5px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
            background: #f9f9f9;
        `;
        
        // Создаем заголовок
        this.header = document.createElement("div");
        this.header.className = "text-array-header";
        this.header.style.cssText = `
            background: #e0e0e0;
            padding: 8px;
            font-weight: bold;
            border-bottom: 1px solid #ccc;
            cursor: pointer;
            user-select: none;
        `;
        this.header.textContent = "Массив текстов ▼";
        
        // Создаем контейнер для закладок
        this.tabsContainer = document.createElement("div");
        this.tabsContainer.className = "text-array-tabs";
        this.tabsContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            background: #f0f0f0;
            border-bottom: 1px solid #ccc;
        `;
        
        // Создаем контейнер для содержимого
        this.contentContainer = document.createElement("div");
        this.contentContainer.className = "text-array-content";
        this.contentContainer.style.cssText = `
            padding: 10px;
            min-height: 100px;
        `;
        
        // Создаем кнопку добавления новой закладки
        this.addButton = document.createElement("button");
        this.addButton.textContent = "+ Добавить текст";
        this.addButton.style.cssText = `
            margin: 5px;
            padding: 5px 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;
        
        // Добавляем элементы в контейнер
        this.container.appendChild(this.header);
        this.container.appendChild(this.tabsContainer);
        this.container.appendChild(this.contentContainer);
        this.container.appendChild(this.addButton);
        
        // Добавляем контейнер к узлу
        this.node.addDOMWidget(this.inputName, "text_array", this.container, {
            getValue: () => this.getValue(),
            setValue: (value) => this.setValue(value)
        });
        
        // Добавляем начальную закладку
        this.addTab();
    }
    
    setupEventListeners() {
        // Обработчик для сворачивания/разворачивания
        this.header.addEventListener("click", () => {
            this.toggleCollapse();
        });
        
        // Обработчик для добавления новой закладки
        this.addButton.addEventListener("click", () => {
            this.addTab();
        });
    }
    
    toggleCollapse() {
        this.collapsed = !this.collapsed;
        if (this.collapsed) {
            this.tabsContainer.style.display = "none";
            this.contentContainer.style.display = "none";
            this.addButton.style.display = "none";
            this.header.textContent = "Массив текстов ▼";
        } else {
            this.tabsContainer.style.display = "flex";
            this.contentContainer.style.display = "block";
            this.addButton.style.display = "block";
            this.header.textContent = "Массив текстов ▲";
        }
    }
    
    addTab(text = "") {
        const tabIndex = this.texts.length;
        this.texts.push(text);
        
        // Создаем закладку
        const tab = document.createElement("div");
        tab.className = "text-array-tab";
        tab.style.cssText = `
            padding: 5px 10px;
            margin: 2px;
            background: ${tabIndex === this.activeTab ? "#4CAF50" : "#e0e0e0"};
            color: ${tabIndex === this.activeTab ? "white" : "black"};
            border-radius: 3px;
            cursor: pointer;
            user-select: none;
            position: relative;
        `;
        tab.textContent = `Текст ${tabIndex + 1}`;
        
        // Добавляем кнопку удаления
        const deleteBtn = document.createElement("span");
        deleteBtn.textContent = " ×";
        deleteBtn.style.cssText = `
            margin-left: 5px;
            font-weight: bold;
            cursor: pointer;
        `;
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.removeTab(tabIndex);
        });
        tab.appendChild(deleteBtn);
        
        // Создаем текстовое поле
        const textInput = document.createElement("textarea");
        textInput.value = text;
        textInput.style.cssText = `
            width: 100%;
            height: 80px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
            resize: vertical;
            font-family: monospace;
        `;
        
        // Обработчики событий для закладки
        tab.addEventListener("click", () => {
            this.setActiveTab(tabIndex);
        });
        
        // Обработчик изменения текста
        textInput.addEventListener("input", () => {
            this.texts[tabIndex] = textInput.value;
            this.updateNodeValue();
        });
        
        // Добавляем элементы
        this.tabsContainer.appendChild(tab);
        this.tabs.push(tab);
        this.textInputs.push(textInput);
        
        // Показываем активную закладку
        this.setActiveTab(tabIndex);
    }
    
    removeTab(tabIndex) {
        if (this.texts.length <= 1) return; // Не удаляем последнюю закладку
        
        // Удаляем данные
        this.texts.splice(tabIndex, 1);
        this.tabs[tabIndex].remove();
        this.textInputs[tabIndex].remove();
        this.tabs.splice(tabIndex, 1);
        this.textInputs.splice(tabIndex, 1);
        
        // Обновляем индексы
        this.updateTabLabels();
        
        // Устанавливаем активную закладку
        if (this.activeTab >= tabIndex) {
            this.activeTab = Math.max(0, this.activeTab - 1);
        }
        this.setActiveTab(this.activeTab);
        
        this.updateNodeValue();
    }
    
    setActiveTab(tabIndex) {
        this.activeTab = tabIndex;
        
        // Обновляем стили закладок
        this.tabs.forEach((tab, index) => {
            tab.style.background = index === tabIndex ? "#4CAF50" : "#e0e0e0";
            tab.style.color = index === tabIndex ? "white" : "black";
        });
        
        // Показываем содержимое активной закладки
        this.contentContainer.innerHTML = "";
        this.contentContainer.appendChild(this.textInputs[tabIndex]);
    }
    
    updateTabLabels() {
        this.tabs.forEach((tab, index) => {
            const deleteBtn = tab.querySelector("span");
            tab.textContent = `Текст ${index + 1}`;
            tab.appendChild(deleteBtn);
        });
    }
    
    updateNodeValue() {
        // Обновляем значение узла
        if (this.node.widgets && this.node.widgets[this.inputName]) {
            this.node.widgets[this.inputName].value = this.texts;
        }
        
        // Обновляем узел
        if (this.node.onResize) {
            this.node.onResize();
        }
    }
    
    getValue() {
        return this.texts;
    }
    
    setValue(value) {
        if (Array.isArray(value)) {
            this.texts = [...value];
            // Пересоздаем интерфейс
            this.tabsContainer.innerHTML = "";
            this.contentContainer.innerHTML = "";
            this.tabs = [];
            this.textInputs = [];
            
            if (this.texts.length === 0) {
                this.addTab();
            } else {
                this.texts.forEach(text => this.addTab(text));
            }
        }
    }
}

// Регистрируем виджет
app.registerExtension({
    name: "TextArrayWidget",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name === "LoTextArray") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function() {
                const ret = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined;
                
                // Создаем наш кастомный виджет
                new TextArrayWidget(this, "text_array", {}, app);
                
                return ret;
            };
        }
    }
});

export { TextArrayWidget };
