import {app} from "../../../../scripts/app.js"
import {EventEmitter} from "../../.core/notify/EventEmitter.js"
import {makeUniqueName, setObjectParams} from "../../.core/utils/base_utils.js"
import {PropsUtils} from "../props_utils.js"
import {LoGraphUtils} from "../../.core/utils/lo_graph_utils.js"
import {LoNodesUtils} from "../../.core/utils/lo_nodes_utils.js"
import {_CFG} from "./config.js"

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

        // LoSetNode.emitNodesChanged(this)
    }


    /**
     *  Конфигурация узла
     */
    onConfigure(){
        this.#oldNamespace = this.#nsWidget.value
        LoSetNode.emitNodesChanged(this)
        super.onConfigure(arguments)
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


    /* NODE DRAW */


    /**
     *  Рисование бокса заголовка узла
     *  - Если заморожен, то рисуется индикатор заморозки
     *  - Иначе рисуется бокс заголовка узла
     */
    drawTitleBox(ctx, { scale, low_quality = false, title_height = LiteGraph.NODE_TITLE_HEIGHT, box_size = 10 }){
        if(this.frozen) PropsUtils.drawFrozenIndicator(ctx, { centerPos: [title_height*0.5, -title_height*0.5] })
        else super.drawTitleBox(ctx, { scale, low_quality, title_height, box_size })
    }


    /* METHODS */

    /**
     *  Нормализация инпутов
     */
    _normalizeInputs(){
        // если заморожены, то не нормализуем
        if(this.frozen) return

        // нормализация инпутов
        LoNodesUtils.normalizeDynamicInputs(this, {
            onLabelChanged: (node, index, input)=>LoSetNode.emitInputChanged(node, index, input)
        })

        // добавление пустого инпута в конец
        LoNodesUtils.addEmptyInput(this)
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

        this._normalizeInputs() // Нормализация инпутов
        this._updateTitle()     // Обновление заголовка узла
        this.setDirtyCanvas(true, true)
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
        this.graph.add(getter)

        // Установка текущего сеттера
        getter.setNamespace(this.namespace)

        this.graph.setDirtyCanvas(true, true)
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
     #addNamespaceWidget(namespace=''){
        const widget = this.addWidget("string", "namespace", namespace,
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
	 getExtraMenuOptions(canvas, menu){
		// Опции будут наверху
		menu.unshift(
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
                            disabled:  this.namespace=='',
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

        // Переопределение присоединения к слоту
        LoNodesUtils.overrideOnConnectInputDynamic( this.prototype )

        // Переопределение границы минимальной ширины узла (computeSize)
        LoNodesUtils.overrideComputeSize( this.prototype, NODE_CFG.minWidth )
    }


    /**
	 *	Получение списка пространства имен воркфлоу
	 */
     static getNamespaces({ excludeNodesIds = [] }={}){
        return LoGraphUtils.findNodesBy({ type: _CFG.setNode.type })
            .filter( node => !excludeNodesIds.includes(node.id) )
            .map( node => node.namespace )
            .filter( namespace => namespace!="" )
	}


    /**
     *  Получение узла SetNode по namespace 
     */
    static findNodeByNamespace(name){
        return LoGraphUtils.findNodeBy({ type: _CFG.setNode.type, namespace: name })
    }

}

