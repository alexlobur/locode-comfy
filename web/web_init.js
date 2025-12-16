import {app} from "../../../scripts/app.js"
import Logger from "./.core/utils/Logger.js"
import LoCore from "./.core/lo_core.js"
import {updateDeprecatedBanner} from "./common/deprecated_banner/deprecated_banner.js"
import { overrideComputeSizeMinWidth } from "./.core/utils/nodes_utils.js"
import { setObjectParams } from "./.core/utils/base_utils.js"
import { LO_NODES_DEFAULTS, LO_NODES_MIN_WIDTH_OVERRIDES } from "./config.js"
import { registerSidebarTab } from "./common/sidebar/sidebar.js"


//---
//
//  Начальные значения для всех узлов LoCode
//
app.registerExtension({
    name: "locode.init",

    // BEFORE NODE REGISTER
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // список устаревших нодов
        if(nodeData.deprecated) LoCore.DEPRECATED_TYPES.add(nodeType.comfyClass)

        // Добавление пункта в контекстное меню для ВСЕХ нодов
        setContextMenu(nodeType)

        // Установка начальных значений
        setLocodeDefaults(nodeType)

        // Переопределение границы минимальной ширины узла (computeSize)
        // Не сработает с виртуальными нодами - для них нужно переопределять computeSize напрямую
        overrideComputeSizeMinWidth(nodeType.prototype, LO_NODES_MIN_WIDTH_OVERRIDES[nodeType.comfyClass])
    },


    // AFTER NODE CREATED
    async nodeCreated(node){
        // Установка контекстного меню для сабграфов
        if(node.subgraph) setSubgraphContextMenu(node)
    }, 


    // SETUP
    async setup(app){
        LoCore.init()

        // Добавление контекстного меню для выделения
        setSelectionContextMenu()

        // Регистрируем вкладку в боковой панели
        registerSidebarTab(app)
    }

})


/*---

FUNCTIONS

---*/


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
    nodeType.prototype.getExtraMenuOptions = function(canvas, menu){
        const ret = _getExtraMenuOptions?.apply(this, arguments)
        //...
        return ret
    }
}


/**
 * Устанавливает контекстное меню для выделенных узлов
 */
function setSelectionContextMenu(){
    const _getCanvasMenuOptions = LGraphCanvas.prototype.getCanvasMenuOptions
    LGraphCanvas.prototype.getCanvasMenuOptions = function(...args) {
        const options = _getCanvasMenuOptions?.apply(this, [...args]) || []

        return options
    }

}


/**
 * Устанавливает контекстное меню для сабграфов
 * @param {*} node - Сабграф
 */
function setSubgraphContextMenu(node){
    if(!node.subgraph) return

    const _getExtraMenuOptions = node.getExtraMenuOptions
    node.getExtraMenuOptions = function(canvas, menu){
        const ret = _getExtraMenuOptions?.apply(this, arguments)

        //FIXME: Пока приостанавливаем — в разработке

        // menu.unshift(...[
        //     {
        //         content: "Lo: Better Subgraph Edit",
        //         callback: () => {
        //             SubgraphModal.show(node)
        //         },
        //     },
        //     null
        // ])
        // return ret
    }
}



/*
Это если понадобится перехватывать регистрацию узлов

const _registerNodeType = LiteGraph.registerNodeType
LiteGraph.registerNodeType = function(type, baseClass){
    const ret = _registerNodeType.apply(this, arguments)
    Logger.debug("registerNodeType", baseClass)
    return ret
}
*/

