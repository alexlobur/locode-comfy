import {app} from "../../../scripts/app.js"
import {InputsLabelsCollectorWidget} from "../.core/widgets/InputsLabelsCollectorWidget.js"
import { LoNodeDynamicInputsOverrides } from "../.core/overrides/LoNodeDynamicInputsOverrides.js"


// Конфиг узла
const NODE_CFG = {
    type:               'LoReplaceVars',
    extName:            'locode.LoReplaceVars',
    widgetName:         'labels_of_vars',
    widgetInputPrefix:  'var',
    normalizeConfig: {
        startName:  '',
        startIndex: 1,
        pattern:    'var{index}',
        label:      ''
    },
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

        // Переопределение узла для динамических инпутов
        new LoNodeDynamicInputsOverrides().override( nodeType.prototype, {
            normalizeConfig: NODE_CFG.normalizeConfig,
            onNodeCreated: function(){
                this.addCustomWidget(
                    new InputsLabelsCollectorWidget(this, NODE_CFG.widgetName, NODE_CFG.widgetInputPrefix )
                )
            }
        })

    }

})