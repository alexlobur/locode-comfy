import {app} from "../../../scripts/app.js"


// Конфиг узла
const NODE_CFG = {
    type:           "LoSwitcher",
    inputPrefix:    "any",
}


//---
//
// Регистрация фронтенд-расширения ComfyUI:
// - name: произвольное имя расширения (для логов/отладки)
// - beforeRegisterNodeDef: хук, вызывается перед регистрацией каждого определения узла.
//   Здесь мы перехватываем конструктор узла и добавляем наш кастомный виджет
//   только для узла с именем "LoTextArray2".
//
app.registerExtension({
    name: "locode.Switcher",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // Проверяем, что имя узла соответствует нужному типу
        if (nodeData.name !== NODE_CFG.type) return

        //
        // Создание узла и инициализация виджета
        const onNodeCreated = nodeType.prototype.onNodeCreated
        nodeType.prototype.onNodeCreated = function(){

            // Начальные инпуты
            updateSwitcherInputs(this)

            return onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined
        }

        //
        // Сохраняем оригинальную функцию, если она существует
        const originalOnConnectionsChange = nodeType.prototype.onConnectionsChange;
        nodeType.prototype.onConnectionsChange = function (side, slot, connect, link_info, output) {
            const ret = originalOnConnectionsChange?.apply(this, arguments)
            // задержка, чтобы успели обновить слоты
            setTimeout( ()=>updateSwitcherInputs(this), 10 )
            return ret
        };

    }

})


/**
 *  Обновление инпутов
 */
function updateSwitcherInputs(node){
    // список активных инпутов
    const linkedInputs = Array.from(node.inputs).filter( input => input.name.startsWith(NODE_CFG.inputPrefix) && input.isConnected )

    // переименование инпутов
    linkedInputs.forEach( (item, index) => item.name = `${NODE_CFG.inputPrefix}${index}` )
    // замена инпутов узла и добавление пустого
    node.inputs = linkedInputs
    node.addInput(`${NODE_CFG.inputPrefix}${linkedInputs.length}`, "*",)

}
