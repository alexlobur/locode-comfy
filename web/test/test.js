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
    name: "TestWidget",
    
    // Вызывается перед регистрацией каждого определения узла.
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // DEBUG
        console.debug("beforeRegisterNodeDef", nodeType, nodeData, app);

        // Проверяем, что имя узла соответствует нужному типу
        if (nodeData.name === "LoTest") {
            new TestWidget(nodeType, nodeData, app);
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

    // Вызывается при добавлении кастомных узлов.
    async addCustomNodeDefs(){
        // DEBUG
        console.debug("addCustomNodeDefs", arguments);
    },
    
    // Вызывается при получении кастомных виджетов.
    async getCustomWidgets(){
        // DEBUG
        console.debug("getCustomWidgets", arguments);
    },

    // Вызывается при регистрации кастомных узлов.
    async registerCustomNodes(){
        // DEBUG
        console.debug("registerCustomNodes", arguments);
    },

    async beforeConfigureGraph(){
        // DEBUG
        console.debug("beforeConfigureGraph", arguments);
    },

    async loadedGraphNode(){
        // DEBUG
        console.debug("loadedGraphNode", arguments);
    },

    async afterConfigureGraph(){
        // DEBUG
        console.debug("afterConfigureGraph", arguments);
    },
});
