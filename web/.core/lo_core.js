import { app } from "../../../scripts/app.js"
import Logger from "./utils/Logger.js"
import {importCss} from "./utils/dom_utils.js"
import { EventEmitter } from "./notify/EventEmitter.js"


/**
 *  Singleton класс для Locode Core
 */
class _LoCore {
    #inited = false
    get inited(){ return this.#inited }

    #events = new EventEmitter()
    get events(){ return this.#events }

    #debug = false
    get debug(){ return this.#debug }


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

        // загрузка графа
        app.loadGraphData = wrapWithEvent(app.loadGraphData, "graph_load", this.events)

        // добавление узла к графу
        app.graph.onNodeAdded = wrapWithEvent(app.graph.onNodeAdded, "graph_node_added", this.events)

        // удаление узла из графа
        app.graph.onNodeRemoved = wrapWithEvent(app.graph.onNodeRemoved, "graph_node_removed", this.events)

        // выделение узлов
        app.canvas.onSelectionChange = wrapWithEvent(app.canvas.onSelectionChange, "canvas_selection_changed", this.events)

        // перемещение узла
        app.canvas.onNodeMoved = wrapWithEvent(app.canvas.onNodeMoved, "canvas_node_moved", this.events)

        // открытие сабграфа
        app.canvas.openSubgraph = wrapWithEvent(app.canvas.openSubgraph, "canvas_open_subgraph", this.events)

        Logger.debug("Events initialized", app)
    }

}


const LoCore = new _LoCore(true)
export default LoCore


/**
 *  Цепляется к функции и эмитит событие
 *  @param {Function} fn - функция
 *  @param {string} eventName - имя события
 */
function wrapWithEvent( fn, eventName, events ){
    return function(){
        events.emit(eventName, ...arguments )
        return fn?.apply(this, arguments)
    }
}