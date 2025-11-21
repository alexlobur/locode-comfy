import {app} from "../../../scripts/app.js"
import {updateDynamicInputs} from "../.core/utils/nodes_utils.js"
import {InputsLabelsWidget} from "../.core/widgets/InputsLabelsWidget.js"
import Logger from "../.core/utils/Logger.js"


// Конфиг узла
const NODE_CFG = {
    type:           "LoReplaceVars",
    extName:        "locode.LoReplaceVars",
    inputPrefix:    "find"
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

        const INPUTS_PREFIX = nodeData.input.hidden['inputs_prefix']??"var"

        //
        // Создание узла и инициализация виджета
        const _onNodeCreated = nodeType.prototype.onNodeCreated
        nodeType.prototype.onNodeCreated = function(){
            const ret = _onNodeCreated?.apply(this, arguments)

            // добавление скрытого виджета для сбора меток
            this.addCustomWidget(new InputsLabelsWidget(this, "labels_of_vars", INPUTS_PREFIX ))
            // Обновление динамических инпутов
            updateDynamicInputs(this, INPUTS_PREFIX)

            return ret
        }

        //
        // При изменении соединений
        const _onConnectionsChange = nodeType.prototype.onConnectionsChange;
        nodeType.prototype.onConnectionsChange = function (side, slot, connect, link_info, output) {
            const ret = _onConnectionsChange?.apply(this, arguments)
            // задержка, чтобы успели обновить слоты
            setTimeout( ()=>updateDynamicInputs(this, INPUTS_PREFIX), 10 )
            return ret
        }

    }
})


