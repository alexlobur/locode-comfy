import {app} from "../../../scripts/app.js"
import {gotoNode} from "../.core/utils/nodes_utils.js"
import { setObjectParams } from "../.core/utils/base_utils.js"
import { LoSetNode } from "./set_node.js"
import {_CFG} from "./config.js"
import Logger from "../.core/utils/Logger.js"

// const LGraphNode = LiteGraph.LGraphNode


/**----
 *	
 *	GET NODE
 * 
 */
 export class LoGetNode extends LGraphNode {

	#nsWidget

	constructor(title=_CFG.getNode.title){
		super(title)
		this.isVirtualNode = true
		this.serialize_widgets = true

		// дизайн
		setObjectParams(this, _CFG.getNode.nodesDefaults)
	}


	onNodeCreated(){
		// Начальные значения
		this.title = _CFG.getNode.title

		// виджет пространства имен
		this.#nsWidget = this.addWidget( "combo", "namespace", "",
			(val) => this.#updateOutputsFromRefer(true),
			{ values: [] }
		)

		// слушатели
		LoSetNode.events.on("namespace_changed",	this.#handleSetNodeNamespaceChange )
		LoSetNode.events.on("set_configured",	 	()=>this.#updateNamespaceCombo() )
		LoSetNode.events.on("input_updated",		this.#handleSetNodeInputUpdated )

		// начальное обновление значений комбо
		this.#updateNamespaceCombo()
	}


	/**
	 *	Обработка события изменения namespace в SetNode
	 */
	 #handleSetNodeNamespaceChange =(e, data)=>{
		this.#updateNamespaceCombo()
		if(data.old==this.#nsWidget.value) this.#nsWidget.value = data.new
		this.#updateOutputsFromRefer()
	}


	/**
	 *	Обработка события изменения namespace в SetNode
	 */
	 #handleSetNodeInputUpdated =(e, data)=>{
		const {index, input, node} = data
		if(node.namespace=="" || node.namespace!=this.#nsWidget.value) return
		this.#updateOutputsFromRefer()
	}


	/**
	 *	Обновление значений комбо
	 */
	#updateNamespaceCombo =()=>{
		const ns = LoSetNode.getNamespaces()
		this.#nsWidget.options.values = ns
	}


	/**
	 *	Получение ссылки-инпута
	 */
	 getInputLink(slot){
		// переносим ссылку на рефера
		const refer = this.getReferNode()
		if(!refer){
			this.#showAlert(_CFG.messages.noRefer.replace("{name}", this.#nsWidget.value), "error")
		}
		// Находим слот
		return this.graph.links[refer.inputs[slot].link]
	}


	/**
	 *	Получаем выходы из узла-рефера
	 */
	#updateOutputsFromRefer(fitSize=false){
		const referInputs = this.#getReferActiveInputs()
		if(!referInputs) return

		const badLinks = []

		// обновление выходов
		for (let index = 0; index < referInputs.length; index++){
			const input = referInputs[index]

			// создание / обновление выхода
			const output = !this.outputs[index]
				? this.addOutput("*", "*")
				: this.outputs[index]
			output.label = input.label || input.name
			output.type = input.type

			// Валидация линков
			badLinks.push(this.#validateOutputLink(output))
		}

		// Удаление узлов, которые выходят за границы
		while(this.outputs[referInputs.length]!=null){
			this.removeOutput(referInputs.length)
		}

		// this.title = "Lo:Get > "+node.title.replace("Lo:Set", "")
		// this.setDirtyCanvas(true, true)

		if(fitSize) this.setSize(this.computeSize())
	}


	/**
	 *	TODO: Валидация линков на соответствие типов
	 *	@param {*} output 
	 */
	#validateOutputLink = function(output){
		if(!output.links) return
		const badLinks = []
		const links = output.links.forEach( linkId => {
			const link = app.graph.getLink(linkId)
			if(link.type!=output.type){
				badLinks.push(link)
			}
		})
		return badLinks
	}


	/**
	 *	Получение узла рефера
	 */
	getReferNode(){
		return LoSetNode.findNodeByNamespace(this.#nsWidget.value)
	}


	/**
	 *	Перейти к реферу
	 */
	#goToRefer = function() {
		const refer = this.getReferNode()
		if(!refer) return
		gotoNode(refer)
	}


	/**
	 *	Выдает список инпутов рефера, без учета последнего
	 */
	 #getReferActiveInputs(){
		const referNode = this.getReferNode()
		if(!referNode) return null
		// Только один инпут
		if(referNode.inputs.length<=1) return []
		// Активные инпуты
		return referNode.inputs.slice(0, referNode.inputs.length-1)
	}


	/**
     *	Дополнительные опции
     */
	 getExtraMenuOptions(_, options){
		// Опции будут наверху
		options.unshift(
			{
				content:  _CFG.menu.gotoRefer.replaceAll("{id}", this.id),
				callback: () => this.#goToRefer(),
			},
			null
		)
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
		LiteGraph.registerNodeType( _CFG.getNode.type, this )
        this.category = _CFG.category
    }
}
