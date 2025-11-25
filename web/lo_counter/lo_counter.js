import { app } from "../../../scripts/app.js"
import { listToNamedObject} from "../.core/utils/nodes_utils.js"
import { clamp } from "../.core/utils/base_utils.js"
import Logger from "../.core/utils/Logger.js"


// Конфиг узла
const NODE_CFG = {
    type:           "LoCounter",
    extName:        "locode.LoCounter",
    inputPrefix:    "any",
}


/**
 * Регистрация расширения
 */
app.registerExtension({
    name: NODE_CFG.extName,
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeType.comfyClass !== NODE_CFG.type) return;

        // Изменение виджета
        // если меняется max_minor — пересчитать границы
        const _onWidgetChanged = nodeType.prototype.onWidgetChanged
        nodeType.prototype.onWidgetChanged = function(name) {
            const ret = _onWidgetChanged?.apply(this, arguments)
            if (name === "max_minor") applyMinMax(this)
            return ret
        }

        // При загрузке конфига (импорт воркфлоу) — тоже применить
        const _onConfigure = nodeType.prototype.onConfigure
        nodeType.prototype.onConfigure = function (){
            const ret = _onConfigure?.apply(this, arguments)
            applyMinMax(this)
            return ret
        }

        // При создании Нода
        const _onNodeCreated = nodeType.prototype.onNodeCreated
        nodeType.prototype.onNodeCreated = function (){
            const ret = _onNodeCreated?.apply(this, arguments)

            // hack: убираем инпут с "max_minor"
            const maxMinorIndex = this.inputs.findIndex( input => input.name = "max_minor" )
            this.inputs = this.inputs.splice(maxMinorIndex, 1)

            // обновляем min/max
            applyMinMax(this)
            return ret
        }
    },

    // Setup
    async setup(app){
        // Пытаемся увеличивать счетчик
        // app.api.addEventListener("execution_start", (ev) => {
        //     Logger.debug("LoCounterNode: execution_start", ev.type, ev)
        //     updateNodesValues(app)
        // })
        // переопределение queuePrompt
        const _queuePrompt = app.api.queuePrompt
        app.api.queuePrompt = async function(){
            // Logger.debug(app.api)
            updateNodesValues(app)
            return await _queuePrompt.apply(this, arguments)
        }
        // return await original_queuePrompt.call(api, number, { output, workflow });
        // app.api.socket.addEventListener("message", (ev) => {
        //     Logger.debug("message", ev.type, ev)
        // })
    }

})



/* FUNCTIONS */

/**
 *  Обновление значений узлов счетчиков
 */
function updateNodesValues(app){
    if (!app?.graph?._nodes) return

    for (const node of app.graph._nodes) {
        const comfyClass = node?.constructor?.comfyClass || node?.comfyClass || node?.type
        if (comfyClass !== NODE_CFG.type) continue
        try{
            const widgets = listToNamedObject(node.widgets)
            widgets.minor.value++
            if (widgets.minor.value > widgets.max_minor.value){
                widgets.minor.value = 0
                widgets.major.value++
            }
        } catch(e){
            Logger.warn(e)
        }
    }
    app.graph.setDirtyCanvas(true, true)
}


/**
 *  переопределение границ
 */
function applyMinMax(node){
    try{
        const widgets = listToNamedObject(node.widgets)

        // Настроить границы
        widgets.minor.options = { ...(widgets.minor.options || {}), min: 0, max: widgets.max_minor.value }
        widgets.major.options = { ...(widgets.major.options || {}), min: 0 }

        // Приведение к границам
        widgets.minor.value = clamp(widgets.minor.value, 0, widgets.max_minor.value)

    } catch (e){
        Logger.warn(e)
    }
    node.graph?.setDirtyCanvas?.(true, true)
}
