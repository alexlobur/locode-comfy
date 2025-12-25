import {app} from "../../../scripts/app.js"
import {InputsLabelsCollectorWidget} from "../.core/widgets/InputsLabelsCollectorWidget.js"
import { LoNodeDynamicInputsOverrides } from "../.core/overrides/LoNodeDynamicInputsOverrides.js"
import Logger from "../.core/utils/Logger.js"


// Конфиг узла
const NODE_CFG = {
    type:               'LoEvals',
    extName:            'locode.LoEvals',
    widgetName:         'labels_of_vars',
    widgetInputPrefix:  'x',
    normalizeConfig: {
        startName:  '',
        startIndex: 0,
        pattern:    'x{index}',
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
                Logger.debug('onNodeCreated', this)
                this.addCustomWidget(
                    new InputsLabelsCollectorWidget(this, NODE_CFG.widgetName, NODE_CFG.widgetInputPrefix )
                )
            }
        })
    }

})
