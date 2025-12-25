import LoCore from "../lo_core.js"
import { LoNodesUtils } from "../utils/lo_nodes_utils.js"

const DEFAULT_NORMALIZE_CONFIG = { startName: "", startIndex: 0, pattern:"{name}_{index}", label: "*" }

/**
 *  Переопределение для типовых узлов с динамическими инпутами
 *  типа: Evals, ReplaceVars, Switcher, ListsMerge, SetList
 */
export class LoNodeDynamicInputsOverrides {

    /**
     *  Выполнение переопределения
     * 
     *  @param {LGraphNode} proto - Прототип узла
     *  @param {Object} normalizeConfig - Конфиг нормализации динамических инпутов
     *  @param {string} normalizeConfig.startName - Начальное имя
     *  @param {number} normalizeConfig.startIndex - Начальный индекс
     *  @param {string} normalizeConfig.pattern - Шаблон имени
     *  @param {string} normalizeConfig.label - Лейбл
     *  @param {Function} onNodeCreated
     *      Callback сработает сразу после создания узла, перед нормализацией динамических инпутов.
     *      Принимает аргументы: this, arguments
     *  @param {Function} afterInputsNormalized
     *      Callback сработает после нормализации динамических инпутов.
     *      Принимает аргументы: this, arguments
     */
    override(proto, { normalizeConfig=DEFAULT_NORMALIZE_CONFIG, onNodeCreated=null, afterInputsNormalized=null }){

        /**
         *  Создание узла и инициализация виджета
         */
        const _onNodeCreated = proto.onNodeCreated
        proto.onNodeCreated = function(){
            const ret = _onNodeCreated?.apply(this, arguments)

            // выполнение callback
            onNodeCreated?.apply(this, arguments)

            // если граф сконфигурирован, то нормализуем динамические инпуты сразу
            // иначе будем ждать конфигурации графа
            if(LoCore.graphConfigured){
                _normalizeInputs(this, normalizeConfig)
                afterInputsNormalized?.apply(this, arguments)
            } else {
                LoCore.events.once("graph_configure", () => {
                    _normalizeInputs(this, normalizeConfig)
                    afterInputsNormalized?.apply(this, arguments)
                })
            }
            return ret
        }

        /**
         *  При изменении соединений
         */
        const _onConnectionsChange = proto.onConnectionsChange
        proto.onConnectionsChange = function (side, slot, connect, link_info, output) {
            const ret = _onConnectionsChange?.apply(this, arguments)

            // нормализация динамических инпутов
            _normalizeInputs(this, normalizeConfig)
            afterInputsNormalized?.apply(this, arguments)

            return ret
        }        

    }

}


/**
 *  Нормализация динамических инпутов
 *  @param {LGraphNode} node
 *  @returns {void}
 */
function _normalizeInputs(node, normalizeConfig){
    LoNodesUtils.normalizeDynamicInputs(node)
    LoNodesUtils.addEmptyInput( node, {
        startName:  normalizeConfig.startName,
        startIndex: normalizeConfig.startIndex,
        pattern:    normalizeConfig.pattern,
        label:      normalizeConfig.label
    })
}
