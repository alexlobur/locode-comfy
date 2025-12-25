import {EventEmitter} from "../../.core/notify/EventEmitter.js"
import {PropsUtils} from "../props_utils.js"
import {LoGraphUtils} from "../../.core/utils/lo_graph_utils.js"
import {app} from "../../../../scripts/app.js"
import { _CFG } from "./config.js"


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
    setterAfterRemoved = (nodeId) =>
        this.events.emit("setter_removed", { nodeId })


    /**
     *  Ищет все узлы сеттера по дереву ссылок, начиная с parentNode
     *
     *  @param {{}} parentNode
     *  @return {{}[]} setters
     */
    findLinkedSetters(parentNode, count=0){
        if (
            !parentNode
            || !Array.isArray(parentNode.inputs)
            || count > _CFG.maxFindLinkedSettersDepth
        ) return []

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
            const node = LoGraphUtils.findNodeBy({ id: link.origin_id })
            if (node.type == _CFG.setNode.type){
                result.push(node)
            } else {
                result.push(...this.findLinkedSetters(node, count+1))
            }
        }
         return result
    }


    /**
     *  Получение всех cеттеров
     *  @returns
     */
    findSetters(){
        return LoGraphUtils.findNodesBy({ type: _CFG.setNode.type })
    }


    /**
     *  Получение сеттера по id
     *  @param {string} id
     *  @returns {LGraphNode}
     */
    getSetterById(id){
        return LoGraphUtils.findNodeBy({ id })
    }


    /**
     *	Выдает список инпутов сеттера
     */
    getSetterActiveInputs = (setterNode) => PropsUtils.getSetterActiveInputs(setterNode)


}


const GetSetPropsVM = new _GetSetPropsVM()
export default GetSetPropsVM
