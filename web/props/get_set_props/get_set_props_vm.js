import {EventEmitter} from "../../.core/notify/EventEmitter.js"


// Конфиги узлов
export const _CFG = {

    extName:        "locode.GetSetProps",
    applyDelay:     100, // задержка применения изменений
    onCreateGetterOffset: [50, 0],  // Сдвиг при создании геттера относительно сеттера [x, y]

    setNode: {
        type:           "LoSetProps",
        // title:          "Set:",
        inputPrefix:    "in",
        outputProps: {
            color_on:   "#FFF",
            color_off:  "#000",
            name:       "props",
        },
        minWidth:       140,
        frozenIndicator: {
            color:  "#FFFFFF66",
            font:   "36px sans-serif",
            text:   "*",
            offset: [-18, 32],
        },
        menu: {
            title: "Lo:SetProps",
            submenu: {
                freezeInputs: "Freeze Inputs",
                unfreezeInputs: "Unfreeze Inputs",
                createGetter: "Create Getter",
            }
        }
    },

    getNode: {
        type:           "LoGetProps",
        // title:          "Get:",
        outputPrefix:   "out",
        inputProps: {
            color_on:   "#FFF",
            color_off:  "#000",
            label:      "props"
        },
        minWidth:       140
    },
}


/**
 *  Класс: Вью-модель для Get/Set Props
 *  содержит в себе систему оповещения
 */
class _GetSetPropsVM{
    events = new EventEmitter()

    // SETTER EVENTS
    setterCreated = (node) =>
        this.events.emit("setter_created", { node })
    setterConfigured = (node) =>
        this.events.emit("setter_configured", { node })
    setterInputChanged = (node, index, input) =>
        this.events.emit("setter_input_changed", { node, index, input })
    setterOutputConnectChanged = (node, output) =>
        this.events.emit("setter_output_connect_changed", { node, output })
    setterOutputRenamed = (node) =>
        this.events.emit("setter_output_renamed", { node })
    setterAfterRemoved = (node) =>
        this.events.emit("setter_removed", { node })


    /**
     *  Ищет все узлы сеттера по дереву ссылок, начиная с parentNode
     *
     *  @param {{}} parentNode
     *  @return {{}[]} setters
     */
    findLinkedSetters(parentNode){
        if (!parentNode || !Array.isArray(parentNode.inputs)) return []
        
        const skipTypes = [
            "STRING", "INT", "FLOAT", "BOOLEAN",
            "IMAGE", "MASK", "LATENT",
            "LATENT_IMAGE", "LATENT_MASK", "LATENT_IMAGE_MASK",
            "METADATA_RAW", "JSON"
        ]

        const result = []
        const links = parentNode.inputs
            .map(input => input?.link ? app.graph.getLink(input.link) : null)
            .filter(link => !!link)
            .filter(link => !skipTypes.includes(link.origin_type))

            for (const link of links){
            const node = app.graph.getNodeById(link.origin_id)
            if (node.type == _CFG.setNode.type){
                result.push(node)
            } else {
                result.push(...this.findLinkedSetters(node))
            }
        }
         return result
    }


    /**
     *  Получение всех cеттеров
     *  @returns
     */
    findSetters(){
		return app.graph.findNodesByType(_CFG.setNode.type)
    }


    /**
     *	Выдает список инпутов сеттера, без последнего
     */
    getSetterActiveInputs(setterNode){
        if(!setterNode) return []
        // Только один инпут
        if(setterNode.inputs.length<=1) return []
        // Активные инпуты
        return setterNode.inputs.slice(0, setterNode.inputs.length-1)
    }

}

const GetSetPropsVM = new _GetSetPropsVM()
export default GetSetPropsVM
