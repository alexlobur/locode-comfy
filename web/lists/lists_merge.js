import {app} from "../../../scripts/app.js"
import {normalizeNodeInputs} from "../.core/utils/nodes_utils.js"

// Конфиг узла
const NODE_CFG = {
    extName:  "locode.LoListsMerge",
    type:     "LoListsMerge",
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

            // Обновление динамических инпутов
            normalizeNodeInputs(this)

            return ret
        }

        //
        // При изменении соединений
        const _onConnectionsChange = nodeType.prototype.onConnectionsChange;
        nodeType.prototype.onConnectionsChange = function (side, slot, connect, link_info, output){
            const ret = _onConnectionsChange?.apply(this, arguments)
            // задержка, чтобы успели обновить слоты
            setTimeout( ()=>normalizeNodeInputs(this), 10 )
            return ret
        }

    }

})

