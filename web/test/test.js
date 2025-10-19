import { app } from "../../../scripts/app.js";


/**
 * TestWidget
 */
class TestWidget {

    /**
     * constructor
     */
    constructor(node, inputName, inputData, app) {
        // DEBUG
        console.debug("TestWidget", node, inputName, inputData, app);
    }

}


//---
//
// Регистрация фронтенд-расширения
//
app.registerExtension({
    name: "LoTestWidget",
    
    // Вызывается перед регистрацией каждого определения узла.
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // DEBUG
        console.debug("beforeRegisterNodeDef", arguments);

        // Проверяем, что узел является тестовым
        if (nodeType.comfyClass !== "LoTest") {
            return;
        }

        const widget = new TestWidget(nodeType, nodeData, app);

        const originalOnExecuted = nodeType.prototype.onExecuted;

        nodeType.prototype.onExecuted = function () {
            console.debug("onExecuted", arguments);

            // Вызываем оригинальный метод
            return originalOnExecuted?.apply(this, arguments);
        }

    },


    // Вызывается при создании узла.
    async nodeCreated(node){
        // DEBUG
        console.debug("nodeCreated", node);
    },


    // Вызывается при инициализации расширения.
    async init(){
        // DEBUG
        console.debug("init", arguments );
    },


    // Вызывается при настройке расширения.
    async setup(){
        // DEBUG
        console.debug("setup", arguments);
    },


});
