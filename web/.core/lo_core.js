import { app } from "../../../scripts/app.js"
import Logger from "./utils/Logger.js"
import {importCss} from "./utils/dom_utils.js"
import { EventEmitter } from "./notify/EventEmitter.js"


/**
 *  Singleton класс для Locode Core
 */
class _LoCore {


    DEPRECATED_TYPES = new Set()

    /**
     * Инициализирован
     */
    get inited(){ return this.#inited }
    #inited = false

    /**
     * События
     */
    get events(){ return this.#events }
    #events = new EventEmitter()

    /**
     * Отладка
     */
    get debug(){ return this.#debug }
    #debug = false

    /**
     * Настройки
     */
    get settings(){ return this.#settings }
    #settings = new _Settings()


    /**---
     * 
     * Конструктор
     */
    constructor(debug=true){
        this.#debug = debug

        // Подключаем CSS стили
        importCss(".assets/css/styles.css", import.meta)

        // Logger
        Logger.init({
            scope: this.#debug ? [] : [ "error", "warn", "log" ],
            title: "LO",
            titleStyle: "background-color: hsla(276, 87%, 49%, 1); color: #FFF; padding: 2px; border-radius: 4px; font-weight: 700; font-size: 10px;"
        })

        // Логирование всех событий
        // this.events.onAny((eventName, ...args) => Logger.debug(`Event: ${eventName}`, ...args))
        this.events.emit("core_inited")
    }


    /**
     *  Инициализация
     */
    init(){
        if(this.#inited) return

        // Инициализация событий
        this.#initEvents()

        this.#inited = true
    }


    /**
     *  Инициализация событий
     */
    #initEvents(){
        const that = this

        /**
         *  Цепляется к функции и эмитит событие
         *  @param {Function} fn - функция
         *  @param {string} eventName - имя события
         */
        const wrapWithEvent = (fn, eventName) => {
            return function(){
                that.events.emit(eventName, ...arguments)
                return fn?.apply(this, arguments)
            }
        }

        // загрузка графа
        app.loadGraphData = wrapWithEvent(app.loadGraphData, "graph_load")

        // добавление узла к графу
        app.graph.onNodeAdded = wrapWithEvent(app.graph.onNodeAdded, "graph_node_added")

        // удаление узла из графа
        app.graph.onNodeRemoved = wrapWithEvent(app.graph.onNodeRemoved, "graph_node_removed")

        // выделение узлов
        app.canvas.onSelectionChange = wrapWithEvent(app.canvas.onSelectionChange, "canvas_selection_changed")

        // перемещение узла
        app.canvas.onNodeMoved = wrapWithEvent(app.canvas.onNodeMoved, "canvas_node_moved")

        // открытие сабграфа
        app.canvas.openSubgraph = wrapWithEvent(app.canvas.openSubgraph, "canvas_open_subgraph")

        Logger.debug("Events initialized", app)
    }

}


/**
 *  Класс для работы с настройками
 */
class _Settings {
    #prefix = "LoCode."

    get sidebarNodeDesignCollapsed(){ return this.#get("sidebarNodeDesignCollapsed") ?? false }
    set sidebarNodeDesignCollapsed(value){ this.#set("sidebarNodeDesignCollapsed", value) }

    get sidebarGroupDesignCollapsed(){ return this.#get("sidebarGroupDesignCollapsed") ?? false }
    set sidebarGroupDesignCollapsed(value){ this.#set("sidebarGroupDesignCollapsed", value) }

    get sidebarNodesInspectorCollapsed(){ return this.#get("sidebarNodesInspectorCollapsed") ?? false }
    set sidebarNodesInspectorCollapsed(value){ this.#set("sidebarNodesInspectorCollapsed", value) }

    #get(key){
        return JSON.parse(localStorage.getItem(`${this.#prefix}${key}`))
    }

    #set(key, value){
        localStorage.setItem(`${this.#prefix}${key}`, JSON.stringify(value))
    }

}


const LoCore = new _LoCore(true)
export default LoCore


