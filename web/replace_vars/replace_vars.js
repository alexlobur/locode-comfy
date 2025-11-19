import {app} from "../../../scripts/app.js"
import {updateDynamicInputs} from "../.core/utils/nodes_utils.js"


// Конфиг узла
const NODE_CFG = {
    type:           "LoReplaceVars",
    extName:        "locode.LoReplaceVars",
    inputPrefix:    "var"
}


//---
//
// Регистрация фронтенд-расширения ComfyUI:
//
app.registerExtension({
    name: NODE_CFG.extName,
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // Проверяем, что имя узла соответствует нужному типу
        if (nodeType.comfyClass !== NODE_CFG.type) return

        //
        // Создание узла и инициализация виджета
        const onNodeCreated = nodeType.prototype.onNodeCreated
        nodeType.prototype.onNodeCreated = function(){
            const ret = onNodeCreated?.apply(this, arguments)
            updateDynamicInputs(this, NODE_CFG.inputPrefix)
            return ret
        }

        //
        // При изменении соединений
        const originalOnConnectionsChange = nodeType.prototype.onConnectionsChange;
        nodeType.prototype.onConnectionsChange = function (side, slot, connect, link_info, output) {
            const ret = originalOnConnectionsChange?.apply(this, arguments)
            // задержка, чтобы успели обновить слоты
            setTimeout( ()=>updateDynamicInputs(this, NODE_CFG.inputPrefix), 10 )
            return ret
        }

    }
})


