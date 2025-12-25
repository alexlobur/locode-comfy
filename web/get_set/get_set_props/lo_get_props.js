import Logger from "../../.core/utils/Logger.js"
import {setObjectParams} from "../../.core/utils/base_utils.js"
import {HiddenWidget} from "../../.core/widgets/HiddenWidget.js"
import { _CFG } from "./config.js"
import GetSetPropsVM from "./get_set_props_vm.js"
import {PropsUtils} from "../props_utils.js"


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

		// Начальные значения
		this.title = NODE_CFG.title
		this.serialize_widgets = true
		this.setterId = -1

		// Виджеты
		this._setterWidget = createSetterSelectWidget( this, (s) => this.updateSetterId(s))
		this._typesWidget = createGetterTypesWidget(this)

		// Начальные слоты
		this._setPropsSlots()
		this._updateOutputsFromRefer()

		// слушатели событий
		this._setEventsHandlers()

		return ret
    }


	/**
     *  Конфигурация узла
     */
    const _onConfigure = proto.onConfigure
    proto.onConfigure = function(){
        const ret = _onConfigure?.apply(this, arguments)

		// Нормализация выходов
		this._updateOutputsFromRefer()

		return ret
    }


	/**
     *  При присоединении
     */
    proto.onConnectInput = function (index, type, outputSlot, outputNode, outputIndex){
		// проверка типа
		if(![this.inputs[index].type, "*"].includes(type)) return false

		// если тип совпадает, то установка сеттера
		if(type == this.inputs[index].type){
			this.updateSetterId(outputNode.id)
			return true
		}

		// если уже указан сеттер
		if(this.setterId != -1) return true

		// если тип "*", то поиск подходящих узлов по дереву
		const setters = VM.findLinkedSetters(outputNode)
		Logger.debug("setters", setters)
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


	/* METHODS */

	/**
	 *	Обновление установки значения setterId
	 *	@param {?number} setterId ID сеттера
	 */
	 proto.updateSetterId = function(setterId){
		this.setterId = setterId??-1
		this._setterWidget._updateValues(this.setterId)
		this._updateOutputsFromRefer(true)
		this._setPropsSlots()
		this.setDirtyCanvas(true, true)
	}


	/**
	 *	Обновление выходов на основе узла-сеттера
	 */
	proto._updateOutputsFromRefer = function(fitSize=false){
		const setter = VM.getSetterById(this.setterId)

		if(setter){
			PropsUtils.updateOutputsFromRefer(this, setter, {
				fitSize: fitSize,
				ouputStartIndex: 1,
			})
		} else {
			while(this.outputs[1]!=null){
				this.removeOutput(1)
			}
		}
	}


	/**
     *  Обновление параметров входа
     */
    proto._setPropsSlots = function (){
        // узел сеттера
		const setter = VM.getSetterById(this.setterId)
		const params = {
			...NODE_CFG.propsSlot,
			label: setter?.propsName??NODE_CFG.propsSlot.label,
		}
		setObjectParams(this.inputs[0], params)
		setObjectParams(this.outputs[0], params)
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

}


// Тип узла (static)
LoGetPropsExtends.nodeType = NODE_CFG.type


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
			getValue: () =>{
				const outputs = node.outputs.filter((output, index) => index > 0 )
				return outputs.map(output => output.type)
			}
		})
	)
	return widget
}

