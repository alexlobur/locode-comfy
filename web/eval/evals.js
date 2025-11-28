import {app} from "../../../scripts/app.js"
import {addEmptyNodeInput, normalizeNodeInputs} from "../.core/utils/nodes_utils.js"
import {InputsLabelsWidget} from "../.core/widgets/InputsLabelsWidget.js"


// Конфиг узла
const NODE_CFG = {
    type:           "LoEvals",
    extName:        "locode.LoEvals",
    inputPrefix:    "x",
    applyDelay:     100,
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

            // добавление скрытого виджета для сбора меток
            this.addCustomWidget(new InputsLabelsWidget(this, "labels_of_vars", NODE_CFG.inputPrefix ))

            // Обновление динамических инпутов
            _normalizeInputs(this)
            return ret
        }

        //
        // При изменении соединений
        const originalOnConnectionsChange = nodeType.prototype.onConnectionsChange;
        nodeType.prototype.onConnectionsChange = function (side, slot, connect, link_info, output) {
            const ret = originalOnConnectionsChange?.apply(this, arguments)
            // задержка, чтобы успели обновить слоты
            setTimeout( ()=>_normalizeInputs(this), NODE_CFG.applyDelay )
            return ret
        }

    }
})


function _normalizeInputs(node){
    normalizeNodeInputs( node, { addDefaultEmptyInput: false })
    addEmptyNodeInput( node, {
        prefix: NODE_CFG.inputPrefix,
        label: NODE_CFG.inputPrefix+node.inputs.length
    })
}

