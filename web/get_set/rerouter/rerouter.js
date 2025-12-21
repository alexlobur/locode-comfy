import Logger from "../../.core/utils/Logger.js"
import {makeUniqueName, setObjectParams, watchProperty} from "../../.core/utils/base_utils.js"
import {addEmptyNodeInput, normalizeDynamicInputs} from "../../.core/utils/nodes_utils.js"
import {PropsUtils} from "../props_utils.js"
import {_CFG} from "./config.js"

const NODE_CFG = _CFG.node


/**----
 *	
 *	REROUTER NODE
 *
 */
 export class LoRerouter extends LGraphNode {


	get collapsible(){ return false }


	/**
	 *	TODO: Режим отображения узла
	 *
	 *	- system: классический режим отображения узла (как в системе)
	 *	- standart: стандартный режим отображения узла
	 *	- adapted: подстраивается под размеры узла
	 *	- compact: компактный режим отображения узла
	 *	@returns {string} - режим отображения узла
	 *	@default 'default'
	 */
	get viewMode(){ return this.properties?.mode??'system' }


	/**
     *  Заморожены ли параметры ввода
     */
    get frozen(){ return this.properties?.frozen??false }


	/**
	 *  Видимость меток слотов
	 */
	get hideLabels(){ return this.properties?.hideLabels??false }


	/**---
     * 
     *  Конструктор
     */
    constructor(title=NODE_CFG.title){
		super(title)

		// Начальные значения свойств
		this.properties = {
			...(this.properties || {}),
			frozen:		false,
			hideLabels:	false,
			viewMode:	_CFG.viewModes[0],
		}

		// Описание свойства
		this.properties_info ||= []
		this.properties_info.push({
			name:			"viewMode",
			type:			"enum", // или "string"
			widget:			"combo",    			// ключевое — combo
			values:			_CFG.viewModes,			// варианты
			default_value:	_CFG.viewModes[0]
		})

		// Начальные значения
		setObjectParams(this, NODE_CFG.defaults)
    }


	/* NODE EVENTS */

    /**
     * Создание узла и инициализация виджета
     */
    onNodeCreated(){
		// Начальные значения
		this.title = NODE_CFG.title

		// время создания узла
		this._createdTime = Date.now()

		// Нормализация слотов
		this._normalizeSlots()
    }


	/**
	 *  Конфигурация узла
	 */
	onConfigure(){
		this._normalizeSlots()
	}


	/**
     *  Присоединение к инпуту
     */
	onConnectInput(index, type, outputSlot, outputNode, outputIndex){
		// если этот узел заморожен, то выходим
		if(this.frozen) return true

		// параметры инпута из выхода
		const input = this.inputs[index]
		const label = outputSlot.label || outputSlot.localized_name || outputSlot.name || outputSlot.type || '*'
		input.label = makeUniqueName(label, this.inputs.map(input=>input.label), { excludeIndex: index })
		input.type = type
	}


	/**
     *  При изменении соединений	// side: 1 = input, 2 = output
     */
    onConnectionsChange(side, index, connected, link, slot){
		// input
        if(side==1){
            setTimeout(()=>this._normalizeSlots(), _CFG.applyDelay)
        }
    }


	/**
	 *  При изменении свойств узла
	 */
	onPropertyChanged(property, value){
		// задержка, чтобы не реагировать на изменения свойств узла сразу после создания
		if(Date.now() - this._createdTime < _CFG.afterCreateDelay) return

		// заморозка
		if(property==="frozen"){
			this.freezeInputsToggle(value)
		}
		// режим отображения
		if(property==="viewMode"){
			this.setViewMode(value)
		}
	}


	/**
	 *  Нормализация слотов
	 */
	_normalizeSlots(){
		// нормализация инпутов
		normalizeDynamicInputs( this, {
			onLabelChanged:		(_, input, value) => {
				const index = this.inputs.indexOf(input)
				this.outputs[index][ this.outputs[index]._label!==undefined ? "_label" : "label" ] = value
			},
			removeEmptyInputs:	!this.frozen,
		})

		// добавление пустого инпута в конец
		if(!this.frozen) addEmptyNodeInput(this)

		// Нормализация выходов
		PropsUtils.updateOutputsFromRefer(this, this)

		// вешаем слушатель на изменения label выходов
		this.outputs.forEach( output=>
			watchProperty( output, "label", {
				onChanged: (value) => {
					const index = this.outputs.indexOf(output)
					this.inputs[index][ this.inputs[index]._label!==undefined ? "_label" : "label" ] = value
				}
			})
		)

		// переопределение свойств отображения слотов
		this.slots.forEach( slot=>this.#redefineSlotDisplayProperties(slot) )
	}


	/**
     *  Клонирование виджета
     */
    clone(){
        const cloned = super.clone()
		cloned._normalizeSlots()
        return cloned
    }


	/* NODE DRAW */

	/**
	 *  Рисование переднего плана узла
	 */
	onDrawForeground(ctx){
		// если метки слотов не видны, то выходим
		if(this.hideLabels) return

		// если узел свернут, то рисуем количество выходов
		// if(this.collapsed){
		// 	ctx.save()
		// 	ctx.fillStyle = _CFG.slots.textColor
		// 	ctx.font = this.titleFontStyle
		// 	const text = `×${this.outputs.length}`
		// 	const measure = ctx.measureText(text)
		// 	const x = (this.boundingRect[2] - measure.width)/2
		// 	const y = this.boundingRect[3] - (this.boundingRect[3] - measure.actualBoundingBoxAscent)/2
		// 	ctx.fillText(text, x, y)
		// 	ctx.restore()
		// 	return
		// }

		// рисуем типы выходов
		ctx.save()
		ctx.fillStyle = _CFG.slots.textColor
		ctx.font = _CFG.slots.textFont
		for (let index = 0; index < this.outputs.length; index++){
			const output = this.outputs[index]
			const text = this.#getSlotRenderingLabel(output)
			const measure = ctx.measureText(text)
			const x = this.size[0] - measure.width - _CFG.slots.textPadding
			const y = output.pos[1] + measure.actualBoundingBoxAscent/2
			ctx.fillText(text, x, y)
		}
		ctx.restore()
	}


	/**
	 *  Переопределение свойств отображения слота
	 */
	#redefineSlotDisplayProperties(slot){

		// определение типа слота
		const isOutputSlot = slot.links !== undefined

		watchProperty( slot, "renderingLabel", { initialValue: "", setValue: ()=> "" })
		watchProperty( slot, "pos", {
			getValue: (value)=>{
				const index = isOutputSlot ? this.outputs.indexOf(slot) : this.inputs.indexOf(slot)
				return this.#getSlotPosition(slot, index)
			}
		})
	}


	/**
	 *  Получение текста для отображения в слоте
	 */
	#getSlotRenderingLabel(slot){
		return (slot.label || slot.localized_name || slot.name || slot.type || '*').trim()
	}


	/**
	 *  Расчет минимального размера узла
	 */
	computeSize(){
		// начальная ширина узла
		let width = _CFG.slots.minWidth
		const height = _CFG.slots.padVertical * 2 + (this.inputs.length-1) * _CFG.slots.spacing

		// если метки слотов не видны, то возвращаем начальную ширину и высоту
		if(this.hideLabels){
			return [width, height]
		}

		// расчет ширины текста инпутов
		const textWidth = Math.max(
			...this.inputs.map(
				input=>PropsUtils.computeSlotTextWidth(this.#getSlotRenderingLabel(input), _CFG.slots.textFont)
			)
		)
		// ширина / высота
		width = textWidth + 2 * _CFG.slots.textPadding

		// возвращаем ширину и высоту
		return [width, height]
	}


	/**
	 *  Получение расчетной позиции слота
	 */
	#getSlotPosition(slot, index){
		// определение типа слота
		const isOutput = slot.links !== undefined

		// расчет вертикального отступа
		const verticalOffset = (this.boundingRect[3] - (this.inputs.length-1) * _CFG.slots.spacing) / 2

		// расчет горизонтальной позиции слота
		const x = isOutput
			? this.boundingRect[2] - _CFG.slots.padHorizontal
			: _CFG.slots.padHorizontal

		// расчет вертикальной позиции слота
		const y = verticalOffset + index * _CFG.slots.spacing

		return [x, y]

	}


	/* MENU & METHODS */

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
					options: [
						{
							content:	NODE_CFG.menu.submenu.inputsFreezing[this.frozen ? 1 : 0],
							callback:	()=> this.freezeInputsToggle()
						},{
							content:	NODE_CFG.menu.submenu.continueRoutes,
							callback:	()=> this.cloneWithRoutes()
						},{
							content:	NODE_CFG.menu.submenu.slotsLabelsVisibility[this.hideLabels ? 0 : 1],
							callback:	()=> this.slotsLabelsVisibilityToggle()
						},{
							content:	NODE_CFG.menu.submenu.viewMode.title,
							has_submenu: true,
							submenu: {
								options: NODE_CFG.menu.submenu.viewMode.options().map(mode=>({
									content:	mode,
									callback:	()=> this.setViewMode(mode)
								}))
							},
						},
				],
				},
			},
			null
		)
	}


	/**
     *  Заморозка инпутов
     */
    freezeInputsToggle(force=null){
        this.properties.frozen = force ?? !this.properties.frozen

		// Если заморожено, то удаляем последний инпут, если он пустой
        if(this.frozen && this.inputs.length > 0){
            const lastInput = this.inputs[this.inputs.length - 1]
            if(!lastInput.connected) this.inputs.pop()
        }

		// Нормализация слотов
		this._normalizeSlots()
    }


	/**
	 *  Продолжение маршрутов
	 */
	cloneWithRoutes(){

		const frozen = this.frozen			// сохранение состояния заморозки узла
		this.properties.frozen = true		// заморозка узла
		const cloned = this.clone()			// создание клона узла
		this.properties.frozen = frozen		// восстановление заморозки узла

		// установка позиции клона
		cloned.pos = [
			this.pos[0] + this.size[0] + _CFG.onContinueRoutesOffset[0],
			this.pos[1] + _CFG.onContinueRoutesOffset[1]
		]

		// добавление клона в граф
		this.graph.add(cloned)

		// Соединение выходов клона с входами текущего узла
		cloned.outputs.forEach((output, index) => {
			this.connect(index, cloned, index)
		})

		// восстановление заморозки узла
		cloned.properties.frozen = frozen

		// нормализация слотов клона
		cloned._normalizeSlots()

		this.graph.setDirtyCanvas(true, true)
    }


	/**
	 *  Переключение видимости меток слотов
	 */
	slotsLabelsVisibilityToggle(){
		this.properties.hideLabels = !this.hideLabels
		this.expandToFitContent()
	}


	/**
	 *  Установка режима отображения узла
	 */
	setViewMode(mode){
		if(!_CFG.viewModes.includes(mode)) return
		this.properties.viewMode = mode
		this.expandToFitContent()
	}


	/* STATIC */

    static setUp(){
		LiteGraph.registerNodeType(NODE_CFG.type, this)

		// параметры прототипа
		setObjectParams(this, NODE_CFG.prototype)
	}

}
