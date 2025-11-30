import {app} from "../../../../scripts/app.js"
import {EventEmitter} from "../../.core/notify/EventEmitter.js"
import {makeUniqueName, setObjectParams} from "../../.core/utils/base_utils.js"
import {addEmptyNodeInput, normalizeDynamicInputs, overrideComputeSizeMinWidth, overrideOnConnectInput} from "../../.core/utils/nodes_utils.js"
import {_CFG} from "./config.js"
import Logger from "../../.core/utils/Logger.js"


const NODE_CFG = _CFG.setNode


/**----
 *	
 *	SET NODE
 *
 */
 export class LoSetNode extends LGraphNode {

    /**
     *  События класса SetNode
     */
    static events = new EventEmitter()    

    #nsWidget
    #oldNamespace = ''
    /**
     *  Пространство имен
     */
    get namespace(){ return this.#nsWidget.value }

    /**
     *  Заморожены ли параметры ввода
     */
    get frozen(){ return this.properties?.frozen??false }


    /**---
     * 
     *  Конструктор
     */
    constructor(title=NODE_CFG.title){
		super(title)
		this.isVirtualNode = true
		this.serialize_widgets = true

        // дизайн
		setObjectParams(this, NODE_CFG.nodesDefaults)
    }


    /* NODE EVENTS */

    /**
     * Создание узла и инициализация виджета
     */
    onNodeCreated(){
		// Начальные значения
		this.title = NODE_CFG.title

		// виджет пространства имен
		this.#nsWidget = this.#addNamespaceWidget()

		// Нормализация инпутов
		this._normalizeInputs()
    }


    /**
     *  Конфигурация узла
     */
    onConfigure(){
        super.onConfigure(arguments)
        this.#oldNamespace = this.#nsWidget.value
        LoSetNode.emitNodesChanged(this)
    }


    /**
     *  Присоединение к динамическому инпуту
     *  NOTE: Переопределяется ниже.
     */
    // onConnectInput()


    /**
     *  При изменении соединений	// side: 1 = input, 2 = output
     */
    onConnectionsChange(side, index, connected, link, slot){
        // input
        if(side==1){
            setTimeout(()=>{
                this._normalizeInputs()
                LoSetNode.emitInputChanged(this, index, slot)
            }, _CFG.applyDelay )
        }
    }


    /**
     *  При удалении узла
     */
    onRemoved(){
        setTimeout(()=>LoSetNode.emitNodesChanged(this), _CFG.applyDelay )
    }


    /**
     *  Клонирование виджета
     */
    clone(){
        const cloned = super.clone()
        cloned._onCloned()
        return cloned
    }


    /**
     *  После клонирования
     */
    _onCloned(){
        const baseName = this.#nsWidget.value.replace(/_[0-9]+$/, '')
        this.#nsWidget.value = makeUniqueName(baseName, LoSetNode.getNamespaces())
        this._normalizeInputs()
        this._updateTitle()
        this.setSize(this.computeSize())
        setTimeout(()=>LoSetNode.emitNodesChanged(this), _CFG.applyDelay )
    }


    /**
     *  Рисование переднего плана
     */
    onDrawForeground(ctx){
        if(this.frozen) this.#drawFrozenIndicator(ctx)
    }


    #drawFrozenIndicator(ctx){
        ctx.save()
        ctx.fillStyle = NODE_CFG.frozenIndicator.color
        ctx.font = NODE_CFG.frozenIndicator.font
        ctx.fillText(
            NODE_CFG.frozenIndicator.text,
            this.size[0] + NODE_CFG.frozenIndicator.offset[0],
            NODE_CFG.frozenIndicator.offset[1]
        )
        ctx.restore()
    }


    drawSlots(){
        Logger.debug("drawSlots", super.drawSlots, arguments)
        super.drawSlots?.apply(this, arguments)
        // Logger.debug("drawSlots", arguments)
    }


    /* METHODS */

    /**
     *  Нормализация инпутов
     */
    _normalizeInputs(){
        // если заморожены, то не нормализуем
        if(this.frozen) return

        // нормализация инпутов
        normalizeDynamicInputs(this, {
            onLabelChanged: (node, index, input)=>LoSetNode.emitInputChanged(node, index, input)
        })

        // добавление пустого инпута в конец
        addEmptyNodeInput(this)
    }


    /**
     *  Обновление заголовка узла
     *  - Если frozen, то перед заголовком ставится "*"
     *  - Установлен setTitleFromNamespace, то заголовок равен NODE_CFG.title + namespace
     */
    _updateTitle(){
        if(!_CFG.setTitleFromNamespace) return
        this.title = NODE_CFG.titleFromNamespace.replace("{namespace}", this.namespace)
    }



    /**
     *  Заморозка инпутов
     */
    _freezeInputsToggle(){
        this.properties = this.properties || {}
        this.properties.frozen = !this.properties.frozen

        // Если заморожено, то удаляем последний инпут, если он пустой
        if(this.frozen && this.inputs.length > 0){
            const lastInput = this.inputs[this.inputs.length - 1]
            if(!lastInput.connected) this.inputs.pop()
        }

        // Нормализация инпутов
        this._normalizeInputs()

        // Обновление заголовка узла
        this._updateTitle()
    }


    /**
     *  Создание геттера
     */
    _createGetter(){
        const getter = LiteGraph.createNode(_CFG.getNode.type)
        if (!getter) return

        // ставим рядом с текущим узлом
        getter.pos = [
            this.pos[0] + this.size[0] + _CFG.onCreateGetterOffset[0],
            this.pos[1] + _CFG.onCreateGetterOffset[1]
        ]
        app.graph.add(getter)

        // Установка текущего сеттера
        getter.setNamespace(this.namespace)

        app.graph.setDirtyCanvas(true, true)
    }


    /* EVENTS EMITTERS */

    /** Оповещение об изменении инпута */
    static emitInputChanged = (node, index, input) => LoSetNode.events.emit("input_updated", { node, index, input })

    /** Оповещение об изменении namespace */
    static emitNamespaceChanged = (node, oldName, newName) => LoSetNode.events.emit("namespace_changed", { node, oldName, newName })

    /** Оповещение об изменении узлов */
    static emitNodesChanged = (node) => LoSetNode.events.emit("nodes_changed", { node })


    /* WIDGETS */

    /**
	 *	Добавление виджета
	 */
     #addNamespaceWidget(){
        const widget = this.addWidget("string", "namespace", "",
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
                    this.#showAlert(_CFG.messages.namespaceExist.replace("{name}", val), "error")
                    widget.value = this.#oldNamespace
                    return
                }
                // замена имени
                LoSetNode.emitNamespaceChanged(this, this.#oldNamespace, val)
                widget.value = val
                this.#oldNamespace = widget.value

                // Обновление заголовка узла
                this._updateTitle()
			},
			{}
		)
        return widget
	}


    /* MENU */

	/**
     *	Дополнительные опции
     */
	 getExtraMenuOptions(_, options){
		// Опции будут наверху
		options.unshift(
			{
				content:  NODE_CFG.menu.title,
				has_submenu: true,
				submenu: {
					// title: NODE_CFG.menu.title,
					options: [
						{
							content:   this.frozen
                                ? NODE_CFG.menu.submenu.unfreezeInputs
                                : NODE_CFG.menu.submenu.freezeInputs,
							callback:  ()=> this._freezeInputsToggle()
						},
						{
							content:   NODE_CFG.menu.submenu.createGetter,
							callback:  ()=> this._createGetter()
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

    static setUp(){
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


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
//
//  OVERRIDES
//
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

// Переопределение присоединения к слоту
overrideOnConnectInput(LoSetNode.prototype)


// Переопределение границы минимальной ширины узла (computeSize)
overrideComputeSizeMinWidth( LoSetNode.prototype, NODE_CFG.minWidth )

