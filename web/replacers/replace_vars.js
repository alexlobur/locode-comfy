import {app} from "../../../../scripts/app.js"
import Logger from "../.core/utils/Logger.js"

// Конфиг узла
const NODE_CFG = {
    type:           "LoReplaceVars",
    inputPrefix:    "var"
}


//---
//
// Регистрация фронтенд-расширения ComfyUI:
//
app.registerExtension({
    name: "locode.LoReplaceVars",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // Проверяем, что имя узла соответствует нужному типу
        if (nodeType.comfyClass !== NODE_CFG.type) return

        //
        // Создание узла и инициализация виджета
        const onNodeCreated = nodeType.prototype.onNodeCreated
        nodeType.prototype.onNodeCreated = function(){

            // Начальные инпуты
            updateInputs(this)
            return onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined
        }

        //
        // При изменении соединений
        const originalOnConnectionsChange = nodeType.prototype.onConnectionsChange;
        nodeType.prototype.onConnectionsChange = function (side, slot, connect, link_info, output) {
            const ret = originalOnConnectionsChange?.apply(this, arguments)
            // задержка, чтобы успели обновить слоты
            setTimeout( ()=>updateInputs(this), 10 )
            return ret
        }

    }

})


/**
 *  Обновление инпутов
 */
function updateInputs(node){
    // список активных инпутов
    const linkedInputs = Array.from(node.inputs).filter( input => input.name.startsWith(NODE_CFG.inputPrefix) && input.isConnected )

    // переименование инпутов
    linkedInputs.forEach( (item, index) => item.name = `${NODE_CFG.inputPrefix}${index}` )
    // замена инпутов узла и добавление пустого
    node.inputs = linkedInputs
    node.addInput(`${NODE_CFG.inputPrefix}${linkedInputs.length}`, "*",)

}
