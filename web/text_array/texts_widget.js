import {app} from "../../../scripts/app.js"
import {importCss, createElement} from "../utils/dom_utils.js"


// Подключаем CSS стили
importCss("text_array.css", import.meta)

// Минимальные размеры самого узла
const MIN_NODE_WIDTH = 240
const MIN_NODE_HEIGHT = 300


/**
 * TextsWidget
 * Кастомный виджет для массива текстов с закладками
 */
class TextsWidget {


    node;           // ссылка на узел
    inputName;      // имя входного параметра
    inputData;      // данные входного параметра
    app;            // ссылка на приложение

    // Исходные данные
    texts = [""];
    activeTab = 0;

    // DOM
    dom = {
        parent: null,
        tabs: null,
        textInput: null,
    };


    /**
     * constructor
     * 
     * @param {any} node - узел
     * @param {any} inputName - имя входного параметра
     * @param {any} inputData - данные входного параметра
     * @param {any} app - приложение
     */
    constructor(node, inputName, inputData, app) {
        this.node = node;
        this.inputName = inputName;
        this.inputData = inputData;
        this.app = app;

        this.node.color = "#2f3544";
        this.node.bgcolor = "#3a435e";

        // Создаем элемент
        this.#createElement();

        // DEBUG
        console.debug("constructor", this);
    }



    /*** INTERFACE ***/


    /**
     *  Скелет элемента
     */
    #buildDomScaffold({ textInput }){
        const parent = createElement("div", {
            classList: ["text-array-widget"],
            content: `
                <div class="topbar">
                    <div class="tabs"></div>
                    <div class="menu"></div>
                </div>
                <div class="content">
                </div>
            `
        })
        this.dom = {
            parent: parent,
            tabs: parent.querySelector(".tabs"),
            menu: parent.querySelector(".menu"),
            textInput: textInput
        }
    }


    /**
     * Создаем интерфейс
     */
    #createElement() {

        // Создаем скелет DOM
        this.dom = this.#buildDomScaffold({
            // Текстовое поле
            textInput:  createElement( "textarea", {
                classList: ["text-input", "comfy-multiline-input"],
                events: {
                    "input": () => this.#handleInput()
                },
            })
        })

        // Добавляем элемент к узлу (node)
        this.node.addDOMWidget(this.inputName, "text_array", this.dom.parent, {
            getValue: () => this.getValue(),
            setValue: (value) => this.setValue(value)
        });

        this.#updateTabs();         // Обновляем закладки
        this.#setState();           // Обновляем состояние
        this.#setNodeMinSize();     // Задаём минимальные размеры самого узла и оборачиваем onResize
        this.#updateNodeValue();    // Инициализируем значение узла текущим состоянием, чтобы оно попало в сохранение
    }


    /**
     * Задаём минимальные размеры самого узла и оборачиваем onResize
     */
    #setNodeMinSize() {
        const originalOnResize = this.node.onResize ? this.node.onResize.bind(this.node) : null;
        this.node.onResize = (...args) => {
            if (originalOnResize) originalOnResize(...args);
            const size = this.node.size || [0, 0];
            const newW = Math.max(size[0], MIN_NODE_WIDTH);
            const newH = Math.max(size[1], MIN_NODE_HEIGHT);
            if (newW !== size[0] || newH !== size[1]) {
                this.node.size[0] = newW;
                this.node.size[1] = newH;
                if (this.node.setDirtyCanvas) this.node.setDirtyCanvas(true, true);
            }
        };

        // Применяем ограничения сразу
        if (this.node.onResize) this.node.onResize();
    }


    /**
     *   Обновление табов
     */
    #updateTabs(){
        // Очищаем контейнер
        this.dom.tabs.innerHTML = "";

        // Создаем закладки для всех текстов
        for (let i = 0; i < this.texts.length; i++) {
            this.#createTabElement(i, {
                onDelete: () => this.#removeTab(i),
                onSelect: () => this.#setActiveTab(i),
                active:   i === this.activeTab,
                parent:   this.dom.tabs
            });
        }

        // Создаем кнопку добавления новой закладки
        const addButton = createElement( "button", {
            classList:  ["add-button"],
            content:    "+",
            parent:     this.dom.parent,
            events: {
                "click": () => this.#addNewTab()
            }
        });
        this.dom.tabs.appendChild(addButton)

    }


    /**
     *  Обновляем состояние
     */
    #setState(){
        // Обновляем активную закладку
        this.dom.tabs.querySelectorAll(".tab").forEach((tab) => {
            tab.classList.remove("active");
        });
        this.dom.tabs.querySelectorAll(".tab")[this.activeTab].classList.add("active");

        // Устанавливаем значение текстового поля
        this.dom.textInput.value = this.texts[this.activeTab];

        // Обновляем значение узла
        this.#updateNodeValue();
    }


    /**
     * Создаем элемент закладки
     * 
     * @param {any} tabIndex - индекс закладки
     * @param {any} onDelete - обработчик удаления
     * @param {any} onSelect - обработчик выбора
     * @returns {HTMLElement}
     */
    #createTabElement(tabIndex, {onDelete, onSelect, parent=null}){
        const isActive = tabIndex === this.activeTab;
        const tab = createElement("div", {
            parent:     parent,
            classList:  [ "tab", isActive ? "active" : null ],
            content:    tabIndex.toString().padStart(2, "0"),
            events: {
                // Выбор закладки
                "click": () => {
                    onSelect.call(this, tabIndex)
                    console.log(this)
                    console.log(this.node)
                },
            }
        });

        // Добавляем кнопку удаления
        createElement( "span", {
            parent:     tab,
            classList:  ["tab-delete"],
            content:    '<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
            events: {
                // Обработчик удаления
                "click": (e) => {
                    e.stopPropagation();
                    onDelete.call(this, tabIndex);
                }
            }
        });

        return tab;
    }


    /*** ACTIONS ***/

    /**
     * Добавляем новую закладку
     * 
     * @param {any} text - текст
     */
    #addNewTab(text = "") {
        this.texts.push(text);
        this.activeTab = this.texts.length - 1;
        this.#updateTabs();          // Обновляем интерфейс
        this.#setState();           // Обновляем состояние
    }


    /**
     * Удаляем закладку
     * @param {any} tabIndex - индекс закладки
     */
    #removeTab(tabIndex) {
        // Не удаляем последнюю закладку
        if (this.texts.length <= 1) return;
        // Удаляем данные
        try{
            this.texts.splice(tabIndex, 1);
            this.activeTab --;
            this.#updateTabs();
            this.#setState();
        } catch (error) {
            console.error("removeTab", error);
        }
    }


    /**
     * Устанавливаем активную закладку
     * @param {any} tabIndex - индекс закладки
     */
    #setActiveTab(tabIndex) {
        this.activeTab = tabIndex;
        this.#setState();
    }


    /**
     * Обработчик изменения текста
     */
    #handleInput() {
        // сохраняем текст текущей вкладки и обновляем значение узла
        this.texts[this.activeTab] = this.dom.textInput.value;
        this.#updateNodeValue();
    }


    /**
     * Обновляем значение узла
     */
    #updateNodeValue() {
        // Обновляем значение узла
        if (this.node.widgets && this.node.widgets[this.inputName]) {
            this.node.widgets[this.inputName].value = this.getValue();
        }
        // Дублируем в свойства узла для надёжной сериализации
        if (!this.node.properties) this.node.properties = {};
        this.node.properties.widget_data = this.getValue();
        
        // Обновляем узел
        if (this.node.onResize) this.node.onResize();
    }


    /*** GETTERS ***/


    /**
     * Получаем значение
     */
    getValue() {
        return {
            texts: [...this.texts],
            activeTab: this.activeTab
        };
    }


    /**
     * Устанавливаем значение
     * @param {any} value - значение
     */
    setValue(value){
        this.texts = Array.isArray(value.texts) ? value.texts : [value.texts??''];
        this.activeTab = value.activeTab??0;
        this.#updateTabs();
        this.#setState();
        this.#updateNodeValue();

    }

}


//---
//
// Регистрация фронтенд-расширения ComfyUI:
// - name: произвольное имя расширения (для логов/отладки)
// - beforeRegisterNodeDef: хук, вызывается перед регистрацией каждого определения узла.
//   Здесь мы перехватываем конструктор узла и добавляем наш кастомный виджет
//   только для узла с именем "LoTextArray2".
//
app.registerExtension({
    name: "TextsWidget",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {

        console.debug(`beforeRegisterNodeDef: ${nodeData.name}`);

        // Проверяем, что имя узла соответствует нужному типу
        if (nodeData.name !== "LoTexts") return

        console.debug("beforeRegisterNodeDef", nodeType, nodeData, app);

        //
        // Создание узла и инициализация виджета
        const onNodeCreated = nodeType.prototype.onNodeCreated;
        nodeType.prototype.onNodeCreated = function() {
            const ret = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined;

            // создаём и сохраняем ссылку на виджет
            this.__widget = new TextsWidget(this, "widget_data", {}, app);

            // если есть сохранённые значения в properties — загрузим их
            try {
                const saved = this?.properties?.widget_data;
                this.__widget.setValue(saved);
            } catch (e) {
                console.warn("LoTexts restore on create failed", e);
            }
            return ret;
        };

        //
        // Сериализация: гарантируем сохранение значений
        const onSerialize = nodeType.prototype.onSerialize;
        nodeType.prototype.onSerialize = function(o) {
            const ret = onSerialize ? onSerialize.apply(this, arguments) : undefined;
            try {
                if (!o.properties) o.properties = {};
                const data = this?.__widget?.getValue?.();
                o.properties.widget_data = data;
            } catch (e) {
                console.warn("LoTexts onSerialize warning", e);
            }
            return ret;
        };

        //
        // Конфигурация (загрузка из workflow): восстановим значения в виджет
        const onConfigure = nodeType.prototype.onConfigure;
        nodeType.prototype.onConfigure = function(o) {
            const ret = onConfigure ? onConfigure.apply(this, arguments) : undefined;
            try {
                const saved = o?.properties?.widget_data;
                this.__widget.setValue(saved);
            } catch (e) {
                console.warn("LoTexts onConfigure warning", e);
            }
            return ret;
        };

    }
});
