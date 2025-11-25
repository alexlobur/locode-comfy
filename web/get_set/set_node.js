import {app} from "../../../scripts/app.js"
import {EventEmitter} from "../.core/notify/EventEmitter.js"
import { setObjectParams } from "../.core/utils/base_utils.js"
import {_CFG} from "./config.js"
import Logger from "../.core/utils/Logger.js"


/**----
 *	
 *	SET NODE
 *
 */
 export class LoSetNode extends LGraphNode {

    static events = new EventEmitter()    

    #nsWidget
    #oldNamespace = ''

    get namespace(){ return this.#nsWidget.value }


    constructor(title=_CFG.setNode.title){
		super(title)
		this.isVirtualNode = true
		this.serialize_widgets = true

        // дизайн
		setObjectParams(this, _CFG.setNode.nodesDefaults)
	}


    /**
     * Создание узла и инициализация виджета
     */
    onNodeCreated(){
		// Начальные значения
		this.title = _CFG.setNode.title

		// виджет пространства имен
		this.#nsWidget = this.#addNamespaceWidget()

		// Нормализация инпутов
		this.normalizeInputs()
    }


    onConfigure(){
        super.onConfigure(arguments)
        this.#oldNamespace = this.#nsWidget.value
        LoSetNode.events.emit("set_configured", { node: this })
    }


    /**
	 *	Добавление виджета
	 */
	#addNamespaceWidget(){
        const widget = this.addWidget( "string", "namespace", "",
			(val) => {
                val = val.trim()
                // проверка имени
                const ns = LoSetNode.getNamespaces({ excludeNodesIds: [this.id] })
                if(val==''){
                    this.#showAlert(_CFG.messages.namespaceEmpty, "error")
                    widget.value = this.#oldNamespace
                    return
                }
                if(ns.includes(val)){
                    this.#showAlert(_CFG.messages.namespaceExist.replace("name", val), "error")
                    widget.value = this.#oldNamespace
                    return
                }
                // замена имени
                LoSetNode.events.emit("namespace_changed", { old: this.#oldNamespace, new: val, node: this })
                widget.value = val
                this.#oldNamespace = widget.value
			},
			{}
		)
        return widget
	}


    /**
     *  После клонирования
     */
    onCloned(){
        this.#nsWidget.value=''
        this.normalizeInputs()
        this.setSize(this.computeSize())
    }


    /**
     *  Клонирование виджета
     */
    clone(){
        const cloned = super.clone()
        cloned.onCloned()
        return cloned
    }


    /**
     *  При изменении соединений	// side: 1 = input, 2 = output
     */
    onConnectionsChange(side, slotIndex, connect, link_info, slot){
        setTimeout(()=>{ // задержка, чтобы успели обновиться слоты
            // входы
            if(side==1){
                this.normalizeInputs()
                this.#inputChangeHandler(slotIndex, slot)
            }
        }, 10)
    }


    #inputChangeHandler = (index, input)=>{
        LoSetNode.events.emit("input_updated", { index, input, node: this })
    }


    /**
     *  Нормализация Инпутов
     */
    normalizeInputs(){
        const that = this

        // Нормализация инпутов - удаление пустых, добавление свободного
        this.inputs = this.inputs.filter( input => input.isConnected )

        // Обновление типов
        let index=0
        for (const input of this.inputs){
            const link = app.graph.getLink(input.link)
            const originNode = app.graph.getNodeById(link.origin_id)
            input.type = originNode.outputs[link.origin_slot].type

            // создаем get/set для label
            if(!input._label){
                input._label = input.label
                Object.defineProperty( input, "label", {
                    set(value) {
                        this._label = value
                        that.#inputChangeHandler(index, input)
                    },
                    get(){ return this._label }
                })
            }
            index++
        }
        // Добавление свободного
        this.addInput(`${_CFG.setNode.inputPrefix}${this.inputs.length}`, "*",)
    }


    /**
     *  Alert
     */
    #showAlert(message, severity='warn'){
        app.extensionManager.toast.add({
            severity: severity,
            summary: `#${this.id} ${this.type} > ${this.title}`,
            detail: `${message}.`,
            life: 5000,
        })
    }


    /* STATIC */


	static setUp() {
		LiteGraph.registerNodeType( _CFG.setNode.type, this )
        this.category = _CFG.category
    }


	/**
	 *	Получение списка пространства имен воркфлоу
	 */
     static getNamespaces({ excludeNodesIds = [] }={}){
		return app.graph
            .findNodesByType(_CFG.setNode.type)
            .filter( node => !excludeNodesIds.includes(node.id) )
            .map( node => node.namespace )
            .filter( namespace => namespace!="" )
	}


    /**
     *  Получение узла SetNode по namespace 
     */
    static findNodeByNamespace(name){
        const nodes = app.graph.findNodesByType(_CFG.setNode.type)
        return nodes.find(node => node.namespace == name)
    }

}
