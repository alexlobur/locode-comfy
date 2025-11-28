import Logger from "./.core/utils/Logger.js"
import {app} from "../../../scripts/app.js"
import coreInit from "./.core/core_init.js"
import {updateDeprecatedBanner} from "./.core/ui/deprecated_banner/deprecated_banner.js"
import { overrideComputeSizeMinWidth } from "./.core/utils/nodes_utils.js"
import { setObjectParams } from "./.core/utils/base_utils.js"
import { LO_NODES_DEFAULTS, LO_NODES_MIN_WIDTH_OVERRIDES } from "./config.js"


// Инициализиция ядра
coreInit()

const DEPRECATED_TYPES = new Set()


//---
//
//  Начальные значения для всех узлов LoCode
//
app.registerExtension({
    name: "locode.init",

    // BEFORE NODE REGISTER
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // список устаревших нодов
        if(nodeData.deprecated){
            DEPRECATED_TYPES.add(nodeType.comfyClass)
        }

        // Добавление пункта в контекстное меню для ВСЕХ нодов
        setContextMenu(nodeType)

        // Установка начальных значений
        setLocodeDefaults(nodeType)

        // Переопределение границы минимальной ширины узла (computeSize)
        // Не сработает с виртуальными нодами - для них нужно переопределять computeSize напрямую
        if(LO_NODES_MIN_WIDTH_OVERRIDES[nodeType.comfyClass]){
            overrideComputeSizeMinWidth(nodeType.prototype, LO_NODES_MIN_WIDTH_OVERRIDES[nodeType.comfyClass])
        }

    },

    // SETUP
    async setup(app){
        // Подключение баннера устаревших нодов
        updateDeprecatedBanner(DEPRECATED_TYPES)

        // Инициализация событий
        initEvents( app, {
            onEvent: (type)=>{
                updateDeprecatedBanner(DEPRECATED_TYPES) // обновление баннера устаревших нодов
            }
        })

    }

})


/* FUNCTIONS */


/**
 *  Инициализация событий
 */
function initEvents(app, { onEvent }){
    Logger.debug(app)

    // Цепляемся к loadGraphData чтобы отследить загрузку узлов
    const _loadGraphData = app.loadGraphData
    app.loadGraphData = function(){
        const ret = _loadGraphData?.apply(this, arguments)
        onEvent?.call(this, "graph_load", ...arguments)
        return ret
    }

    // Отслеживаем добавление узла к графу
    const _onNodeAdded = app.graph.onNodeAdded
    app.graph.onNodeAdded = function(){
        const ret = _onNodeAdded?.apply(this, arguments)
        onEvent?.call(this, "graph_node_added", ...arguments)
        return ret
    }

    // Отслеживаем удаление узла из графа
    const _onNodeRemoved = app.graph.onNodeRemoved
    app.graph.onNodeRemoved = function(){
        const ret = _onNodeRemoved?.apply(this, arguments)
        onEvent?.call(this, "graph_node_removed", ...arguments)
        return ret
    }

}


/**
 *  Установка начальных значений для LoCode
 */
function setLocodeDefaults(nodeType){
    // Проверяем, что имя узла соответствует нужному типу
    const defaults = LO_NODES_DEFAULTS[nodeType.comfyClass]
    if (!defaults) return

    // Создание узла и инициализация виджета
    const _onNodeCreated = nodeType.prototype.onNodeCreated
    nodeType.prototype.onNodeCreated = function(){
        // Переопределение начальных значений
        setObjectParams(this, defaults)
        // Переопределение начальных значений
        return _onNodeCreated?.apply(this, arguments)
    }
}


/**
 * Устанавливает общее контекстное меню
 * @param {*} nodeType - Тип нода
 */
function setContextMenu(nodeType){
    const _getExtraMenuOptions = nodeType.prototype.getExtraMenuOptions
    nodeType.prototype.getExtraMenuOptions = function(canvas, options) {
        Logger.debug(options)
        // Добавляем пункт меню
        options.push(...[
            {
                content: "Lo: Node Colors (в разработке)",
                callback: () => {
                    console.log("Выбран нод:", this.title, this.type)
                }
            }, null
        ])
        return _getExtraMenuOptions?.apply(this, arguments)
    }
}
