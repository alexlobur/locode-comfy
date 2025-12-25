import {app} from "../../../scripts/app.js"
import { LoNodeDynamicInputsOverrides } from "../.core/overrides/LoNodeDynamicInputsOverrides.js"


// Конфиг узла
const NODE_CFG = {
    type:           'LoSwitcher',
    extName:        'locode.LoSwitcher',
    normalizeConfig: {
        startName:  'any',
        pattern:    'any{index}',
        label:      ''
    }
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

        new LoNodeDynamicInputsOverrides().override( nodeType.prototype, {
            normalizeConfig: NODE_CFG.normalizeConfig,
            afterInputsNormalized: function(){
                // переименование label чтобы было по порядку
                this.inputs
                    .filter( input => !input.isWidgetInputSlot )
                    .forEach( (input, index) => {
                        input.label = `${NODE_CFG.normalizeConfig.pattern.replace('{index}', index)}`
                    })
            }
        })

    }
})
