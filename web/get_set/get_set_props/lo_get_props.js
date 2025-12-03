import Logger from "../../.core/utils/Logger.js"
import {setObjectParams} from "../../.core/utils/base_utils.js"
import {HiddenWidget} from "../../.core/widgets/HiddenWidget.js"
import GetSetPropsVM, {_CFG} from "./get_set_props_vm.js"

const VM = GetSetPropsVM
const {getNode: NODE_CFG} = _CFG


/**---
 * 
 *  Расширение прототипа
 */
export function LoGetPropsExtends(proto){

	// создаем сеттеры/геттеры для setterId
	Object.defineProperty( proto, "setterId", {
		get() { return this.properties?.setterId??-1 },
		set(value) {
			this.properties = this.properties || {}
			this.properties.setterId = value
		}
	})


	/* NODE EVENTS */

	/**
     * Создание узла и инициализация виджета
     */
    const _onNodeCreated = proto.onNodeCreated
    proto.onNodeCreated = function(){
        const ret = _onNodeCreated?.apply(this, arguments)
		try{

			// Начальные значения
			this.title = NODE_CFG.title
			this.serialize_widgets = true

			// Виджеты
			this._setterWidget = createSetterSelectWidget( this, (s) => this.updateSetterId(s))
			this._typesWidget = createGetterTypesWidget(this)

			// Свойства
			this.setterId = -1

			// Начальные параметры входа
			this._setInputParams()

			// Начальные выходы
			this._updateOutputsFromRefer()

			// слушатели событий
			this._setEventsHandlers()

		} catch(e) {
			Logger.error(e, this)
		}
        return ret
    }


	/**
     *  Конфигурация узла
     */
    const _onConfigure = proto.onConfigure
    proto.onConfigure = function(){
        const ret = _onConfigure?.apply(this, arguments)
        try{

			// Нормализация выходов
			this._updateOutputsFromRefer()

		} catch(e) {
            Logger.error(e, this)
        }
        return ret
    }


    /**
     *  При присоединении
     */
    proto.onConnectInput = function (index, type, outputSlot, outputNode, outputIndex){
		// проверка типа
		if(type == this.inputs[index].type){
			this.updateSetterId(outputNode.id)
			return true
		}
		// если тип "*", поиск подходящих узлов по дереву
		const setters = VM.findLinkedSetters(outputNode)
		if(setters.length>0){
			this.updateSetterId(setters[0].id)
			return true
		}
		return false
    }


	/**
     *  Удаление узла
     */
    const _onRemoved = proto.onRemoved
    proto.onRemoved = function (){
        const ret = _onRemoved?.apply(this, arguments)
		this._removeEventsHandlers()
        return ret
    }


	/* SETTER EVENTS HANDLERS */

	/**
	 *	Установка слушателей settera
	 */
	 proto._setEventsHandlers = function(){
		// Привязываем обработчики к контексту и сохраняем ссылки для удаления
		this._setterHandlers = {
			valuesUpdated:			()=> this._setterWidget._updateValues(),
			inputsUpdated:			()=> this._updateOutputsFromRefer(true),
			outputRenamed:			()=> this.updateSetterId(this.setterId),
			outputConnectChanged:	()=> { /* обработка изменения связи выхода */ }
		}
		VM.events.on("setter_created",					this._setterHandlers.valuesUpdated)
		VM.events.on("setter_configured",				this._setterHandlers.valuesUpdated)
		VM.events.on("setter_output_renamed",			this._setterHandlers.outputRenamed)
		VM.events.on("setter_removed",					this._setterHandlers.valuesUpdated)
		VM.events.on("setter_input_changed",			this._setterHandlers.inputsUpdated)
		VM.events.on("setter_output_connect_changed",	this._setterHandlers.outputConnectChanged)
	}

	/**
	 *  Удаление слушателей settera
	 */
	proto._removeEventsHandlers = function(){
		if (!this._setterHandlers) return
		VM.events.off("setter_created",					this._setterHandlers.valuesUpdated)
		VM.events.off("setter_configured",				this._setterHandlers.valuesUpdated)
		VM.events.off("setter_output_renamed",			this._setterHandlers.outputRenamed)
		VM.events.off("setter_removed",					this._setterHandlers.valuesUpdated)
		VM.events.off("setter_input_changed",			this._setterHandlers.inputsUpdated)
		VM.events.off("setter_output_connect_changed",	this._setterHandlers.outputConnectChanged)
		// Очищаем ссылки
		this._setterHandlers = null
	}


	/* METHODS */


	/**
	 *	Обновление установки значения setterId
	 *	@param {?number} setterId ID сеттера
	 */
	proto.updateSetterId = function(setterId){
		this.setterId = setterId??-1
		this._setterWidget._updateValues(this.setterId)
		this._updateOutputsFromRefer(true)
		this._setInputParams()
		this.setDirtyCanvas(true, true)
	}


	/**
	 *	Обновление выходов на основе узла-сеттера
	 */
	proto._updateOutputsFromRefer = function(fitSize=false){
		const setterInputs = VM.getSetterActiveInputs(VM.getSetterById(this.setterId))

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

		if(fitSize) this.setSize(this.computeSize())
	}


	/**
     *  Обновление параметров входа
     */
    proto._setInputParams = function (){
        // узел сеттера
		const setter = VM.getSetterById(this.setterId)
		const params = {
			...NODE_CFG.inputProps,
			label:	setter?.propsName??NODE_CFG.inputProps.label,
		}
		setObjectParams(this.inputs[0], params)
    }

}



/*
------

    WIDGETS

------
*/


/**
 *	Создает виджет выбора типа данных
 *
 *	@param {LGraphNode} node
 *	@param {(setterId: number, propsType: string)=>void} onSetValue Функция для установки значения
 *	@returns {*}
 */
function createSetterSelectWidget(node, onSetValue){

	// виджет выбора сеттера
	const widget = node.addWidget( "combo", "props", "",
		function(val){
			if(this._values) onSetValue(this._values.get(val), val)
		},
		{ values: [] }
	)

	// обновление combo значений виджета
	widget._updateValues = function(setterId=null){
		const setters = VM.findSetters()
		// сохраняем в узел пару тип -> id узла
		this._values = new Map( setters.map( node => [ node.propsName, node.id ] ))
		this.options.values = [...this._values.keys(), "..."]

		// установка значения, если задан setterId
		if(setterId){
			this.value = setters.find( node => node.id==setterId )?.propsName??""
		}
		return this
	}
	return widget._updateValues()
}


/**
 *	Создает скрытый виджет списка типов данных.
 *	Должен передавать типы данных из сеттера.
 *	@param {LGraphNode} node
 *	@returns {*}
 */
 function createGetterTypesWidget(node){
	const widget = node.addCustomWidget(
		new HiddenWidget( node, "props_types", {
			type: "list",
			getValue: () => node.outputs.map(output => output.type),
		})
	)
	return widget
}

