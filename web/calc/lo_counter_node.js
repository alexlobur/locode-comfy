import { app } from "../../../scripts/app.js"
import { listToNamedObject, clamp } from "../.core/utils/nodes_utils.js"


/**
 * Регистрация расширения
 */
app.registerExtension({
    name: "LoCounterNode",

    // При регистрации типа — перехватить onWidgetChanged, чтобы реагировать на изменение max_minor
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name !== "LoCounter") return;

        // Изменение виджета
        // если меняется max_minor — пересчитать границы
        const _onWidgetChanged = nodeType.prototype.onWidgetChanged;
        nodeType.prototype.onWidgetChanged = function(name) {
            const ret = _onWidgetChanged ? _onWidgetChanged.apply(this, arguments) : undefined
            if (name === "max_minor") applyMinMax(this)
            return ret
        };

        // При загрузке конфига (импорт воркфлоу) — тоже применить
        const _onConfigure = nodeType.prototype.onConfigure;
        nodeType.prototype.onConfigure = function (){
            const ret = _onConfigure ? _onConfigure.apply(this, arguments) : undefined
            applyMinMax(this)
            return ret
        };
    },

    // При создании конкретного инстанса — выставить границы сразу
    async nodeCreated(node, app){
        console.log("nodeCreated", node)
        const cls = node?.constructor?.comfyClass || node?.comfyClass || node?.type;
        if (cls !== "LoCounter") return;
        applyMinMax(node);
    },

    // Setup
    async setup(app){
        app.api.addEventListener("execution_success", (ev) => {
            updateNodesValues(app)
        });
        // app.api.socket.addEventListener("message", (ev) => {
        //     console.debug("message", ev.type, ev);
        // });
    }

});



function updateNodesValues(app){
    if (!app?.graph?._nodes) return;

    for (const node of app.graph._nodes) {
        const comfyClass = node?.constructor?.comfyClass || node?.comfyClass || node?.type;
        if (comfyClass !== "LoCounter") continue;
        try{
            const widgets = listToNamedObject(node.widgets);
            widgets.minor.value++
            if (widgets.minor.value > widgets.max_minor.value){
                widgets.minor.value = 0;
                widgets.major.value++;
            }
        } catch(e){
            console.warn(e)
        }
    }
    app.graph.setDirtyCanvas(true, true);
}


function applyMinMax(node){
    try{
        const widgets = listToNamedObject(node.widgets)
        console.log(widgets)

        // Настроить границы
        widgets.minor.options = { ...(widgets.minor.options || {}), min: 0, max: widgets.max_minor.value }
        widgets.major.options = { ...(widgets.major.options || {}), min: 0 }

        // Приведение к границам
        widgets.minor.value = clamp(widgets.minor.value, 0, widgets.max_minor.value)

    } catch (e){
        console.warn(e)
    }
    node.graph?.setDirtyCanvas?.(true, true)
}
