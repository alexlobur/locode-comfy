import {app} from "../../../scripts/app.js"
import { LoNodeDynamicInputsOverrides } from "../.core/overrides/LoNodeDynamicInputsOverrides.js"
import { LoNodesUtils } from "../.core/utils/lo_nodes_utils.js"


// Конфиг узлов
const NODE_CFG = {
    types:              ["LoListsMerge", "LoSetList"],
    extName:            'locode.LoListsCommon',
    normalizeConfig: {
        startName:  'any',
        startIndex: 0,
        label:      '*'
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
        if (!NODE_CFG.types.includes(nodeType.comfyClass)) return

        // Переопределение узла для динамических инпутов
        new LoNodeDynamicInputsOverrides().override( nodeType.prototype, {
            normalizeConfig: NODE_CFG.normalizeConfig,
        })

        // Переопределение присоединения к слоту
        LoNodesUtils.overrideOnConnectInputDynamic(nodeType.prototype, {})
    }

})
