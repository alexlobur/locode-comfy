import {app} from "../../../../scripts/app.js"
import {gotoNode} from "../../.core/utils/nodes_utils.js"
import {setObjectParams} from "../../.core/utils/base_utils.js"
import {overrideComputeSizeMinWidth} from "../../.core/utils/nodes_utils.js"
import {LoSetNode} from "./set_node.js"
import {_CFG} from "./config.js"


// const LGraphNode = LiteGraph.LGraphNode
const NODE_CFG = _CFG.getNode

/**----
 *	
 *	GET NODE
 * 
 */
 export class LoGetNode extends LGraphNode {

	#nsWidget

	constructor(title=NODE_CFG.title){
		super(title)
		this.isVirtualNode = true
		this.serialize_widgets = true

		// дизайн
		setObjectParams(this, NODE_CFG.nodesDefaults)
	}


	/* NODE EVENTS */

	/**
	 *  Создание узла
	 */
	onNodeCreated(){
		// Начальные значения
		this.title = NODE_CFG.title

		// виджет пространства имен
		this.#nsWidget = this.addWidget( "combo", "namespace", "",
			(val) => this.#updateOutputsFromSetter(true),
			{ values: [] }
		)

		// слушатели
		LoSetNode.events.on("nodes_changed",		this.#handleSetNodesChanged )
		LoSetNode.events.on("namespace_changed",	this.#handleSetNodeNamespaceChange )
		LoSetNode.events.on("input_updated",		this.#handleSetNodeInputUpdated )

		// начальное обновление значений комбо
		this.#updateNamespaceCombo()
	}


	/* HANDLERS */

	/**
	 *	Обработка события изменения namespace в SetNode
	 */
	 #handleSetNodesChanged =(e, data)=>{
		this.#updateNamespaceCombo()
	}


	/**
	 *	Обработка события изменения namespace в SetNode
	 */
	 #handleSetNodeNamespaceChange =(e, data)=>{
		this.#updateNamespaceCombo()
		if(data.oldName==this.#nsWidget.value) this.#nsWidget.value = data.newName
		this.#updateOutputsFromSetter()
	}


	/**
	 *	Обработка события изменения namespace в SetNode
	 */
	 #handleSetNodeInputUpdated =(e, data)=>{
		const {index, input, node} = data
		if(node.namespace=="" || node.namespace!=this.#nsWidget.value) return
		this.#updateOutputsFromSetter()
	}


	/* METHODS */


	/**
	 *	Получение ссылки-инпута. Вызывается при рассчете воркфлоу.
	 *	Собственно на этом и построена возможность работы геттера как прокси на сеттере.
	 */
	 getInputLink(slot){
		// переносим ссылку на сеттер
		const setter = this.getSetterNode()
		if(!setter){
			this.#showAlert(_CFG.messages.noSetter.replace("{name}", this.#nsWidget.value), "error")
			return null
		}
		// Находим слот
		return this.graph.links[setter.inputs[slot].link]
	}


	/**
	 *	Установка пространства имен
	 */
	setNamespace(namespace){
		if(namespace==this.#nsWidget.value) return
		this.#nsWidget.value = namespace
		this.#updateOutputsFromSetter(true)
	}


	/**
	 *	Получение узла сеттера
	 */
	 getSetterNode(){
		return LoSetNode.findNodeByNamespace(this.#nsWidget.value)
	}


	/**
	 *	Обновление значений комбо
	 */
	#updateNamespaceCombo =()=>{
		const ns = LoSetNode.getNamespaces()
		this.#nsWidget.options.values = ns
	}


	/**
	 *	Получаем выходы из узла-рефера
	 */
	#updateOutputsFromSetter(fitSize=false){
		const setterInputs = this.#getSetterActiveInputs()
		if(!setterInputs) return

		// обновление выходов
		for (let index = 0; index < setterInputs.length; index++){
			const input = setterInputs[index]

			// создание / обновление выхода
			const output = !this.outputs[index]
				? this.addOutput("*", "*")
				: this.outputs[index]
			output.label = input.label || input.name
			output.type = input.type
		}

		// Удаление узлов, которые выходят за границы
		while(this.outputs[setterInputs.length]!=null){
			this.removeOutput(setterInputs.length)
		}

		// Обновление заголовка узла
		this.#updateTitle()

		if(fitSize) this.setSize(this.computeSize())
	}


	/**
	 *	Выдает список инпутов рефера, без учета последнего
	 */
	 #getSetterActiveInputs(){
		const setterNode = this.getSetterNode()
		if(!setterNode) return null

		// Если заморожены, то возвращаем все инпуты
		if(setterNode.frozen){
			return setterNode.inputs
		}

		// Только один инпут
		if(setterNode.inputs.length<=1) return []

		// Активные инпуты
		return setterNode.inputs.slice(0, setterNode.inputs.length-1)
	}


	/**
     *  Обновление заголовка узла
     *  - Установлен setTitleFromNamespace, то заголовок равен NODE_CFG.title + namespace
     */
    #updateTitle(){
		if(!_CFG.setTitleFromNamespace) return
        this.title = NODE_CFG.titleFromNamespace.replace("{namespace}", this.#nsWidget.value)
    }


	/* MENU */

	/**
     *	Дополнительные опции
     */
	 getExtraMenuOptions(_, options){

		const setter = this.getSetterNode()

		// Опции будут наверху
		options.unshift(
			{
				content:  NODE_CFG.menu.title,
				has_submenu: true,
				submenu: {
					title: NODE_CFG.menu.title,
					options: [
						{
							content:   NODE_CFG.menu.submenu.gotoSetter.replace("{id}", setter?.id),
							callback:  ()=> gotoNode(setter)
						},
					],
				},
			},
			null
		)
	}


	/* SYSTEM */


	/**
     *  Alert
     */
    #showAlert(message, severity='warn'){
        app.extensionManager.toast.add({
            severity:   severity,
            summary:    `#${this.id} ${this.type} > ${this.title}`,
            detail:     `${message}.`,
            life:       5000,
        })
    }


	/* STATIC */

	static setUp() {
		LiteGraph.registerNodeType( NODE_CFG.type, this )
        this.category = _CFG.category
    }
}



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
//
//  OVERRIDES
//
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 


// Переопределение границы минимальной ширины узла (computeSize)
overrideComputeSizeMinWidth(
    LoGetNode.prototype,
    NODE_CFG.minWidth
)

