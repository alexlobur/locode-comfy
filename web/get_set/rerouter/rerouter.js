import {makeUniqueName, setObjectParams, watchProperty, matchCase} from "../../.core/utils/base_utils.js"
import { LoNodesUtils } from "../../.core/utils/lo_nodes_utils.js"
import {PropsUtils} from "../props_utils.js"
import {_CFG} from "./config.js"

const NODE_CFG = _CFG.node


/**----
 *	
 *	REROUTER NODE
 *	
 *	@author Locode
 *	@version 1.0.0
 *	@since 1.0.0
 *	@description Node for managing routes
 */
 export class LoRerouter extends LGraphNode {

	/**
	 *	Режим отображения узла
	 *	@returns {string} режим отображения узла
	 */
	get viewMode(){ return this.properties.viewMode }

	/**
     *  Заморожены ли параметры ввода
     */
    get frozen(){ return this.properties.frozen }

	/**
	 *  Видимость меток слотов
	 */
	get hideLabels(){ return this.properties.hideLabels }


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
			default_value:	_CFG.viewModes[1]
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
		this.#normalizeSlots()
    }


	/**
	 *  Конфигурация узла
	 */
	onConfigure(){
		this.#normalizeSlots()
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
            setTimeout(()=>this.#normalizeSlots(), _CFG.applyDelay)
        }
    }


	/**
	 *  При изменении свойств узла
	 */
	onPropertyChanged(property, value){
		// задержка, чтобы не реагировать на изменения свойств узла сразу после создания
		if(Date.now() - this._createdTime < _CFG.afterCreateDelay) return

		// обновление состояния узла в зависимости от измененного свойства
		matchCase(property, {
			// заморозка узла
			frozen:		()=> this.#updateFrozenState(),
			// режим отображения узла
			viewMode:	()=> this.#updateViewMode(),
			// видимость меток слотов
			hideLabels:	()=> this.#updateLabelsVisibility(),
		})
	}



	/* NODE DRAW */

	/**
	 *  Рисование переднего плана узла
	 */
	onDrawForeground(ctx){
		// если метки слотов не видны, то выходим
		if(this.hideLabels) return

		// расчет параметров слотов
		const params = this.#getSlotsParams()

		// если узел свернут, то рисуем количество выходов
		const collapsed = params.spacing < _CFG.slots.collapseOnSpacing
		if(collapsed){
			ctx.save()
			ctx.fillStyle = _CFG.slots.textColor
			ctx.font = this.titleFontStyle

			// рисуем заголовок узла, если он выходит за пределы узла обрезаем
			const text = this.title===NODE_CFG.title
				? `× ${this.outputs.length}`
				: `${this.title.trim()} × ${this.outputs.length}`
			const measure = ctx.measureText(text)

			// устанавливаем область обрезки по границам узла
			ctx.beginPath()
			ctx.rect(params.textPadding, 0, this.size[0] - 2 * params.textPadding, this.size[1])
			ctx.clip()

			const x = (this.size[0] - measure.width - params.textPadding)
			const y = (this.size[1] + measure.actualBoundingBoxAscent)/2
			ctx.fillText(text, x, y)
			ctx.restore()
			return
		}

		// рисуем типы выходов
		ctx.save()
		ctx.fillStyle = _CFG.slots.textColor
		ctx.font = params.textFont
		for (let index = 0; index < this.outputs.length; index++){
			const output = this.outputs[index]
			const text = this.#getSlotRenderingLabel(output)
			const measure = ctx.measureText(text)
			const x = this.size[0] - measure.width - params.textPadding
			const y = output.pos[1] + measure.actualBoundingBoxAscent/2
			ctx.fillText(text, x, y)
		}
		ctx.restore()
	}


	/**
	 *  Расчет минимального размера узла
	 */
	computeSize(){
		// расчет параметров слотов
		const params = this.#getSlotsParams()

		// начальная ширина / высота узла
		let width = _CFG.node.minSize[0]
		const height = params.verticalMinOffset * 2 + (this.inputs.length-1) * params.minSpacing

		// если метки слотов не видны, то возвращаем начальную ширину и высоту
		if(this.hideLabels){
			return [width, height]
		}

		// расчет ширины текста инпутов
		const textWidth = Math.max(
			...this.inputs.map(
				input=>PropsUtils.computeSlotTextWidth(this.#getSlotRenderingLabel(input), params.textFont)
			)
		)
		// ширина / высота
		width = textWidth + 2 * params.textPadding

		// возвращаем ширину и высоту
		return [width, height]
	}


	/* SLOTS */

	/**
	 *  Нормализация слотов
	 */
	#normalizeSlots(){
		// нормализация инпутов
		LoNodesUtils.normalizeDynamicInputs( this, {
			onLabelChanged:		(_, input, value) => {
				const index = this.inputs.indexOf(input)
				this.outputs[index][ this.outputs[index]._label!==undefined ? "_label" : "label" ] = value
			},
			removeEmptyInputs:	!this.frozen,
		})

		// добавление пустого инпута в конец
		if(!this.frozen) LoNodesUtils.addEmptyInput(this)

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
	 *  Переопределение свойств отображения слота
	 */
	#redefineSlotDisplayProperties(slot){
		// определение типа слота
		const isOutputSlot = slot.links !== undefined

		// переопределение свойства renderingLabel
		watchProperty( slot, "renderingLabel", {
			getValue: ()=> ""
		})

		// переопределение свойства pos
		watchProperty( slot, "pos", {
			getValue: (value)=>{
				const index = isOutputSlot ? this.outputs.indexOf(slot) : this.inputs.indexOf(slot)
				return this.#getSlotPosition(slot, index)
			}
		})
	}


	/**
	 *  Получение расчетной позиции слота
	 */
	#getSlotPosition(slot, index){
		// определение типа слота
		const isOutput = slot.links !== undefined

		// расчет параметров слотов
		const params = this.#getSlotsParams()

		// возвращаем расчетную позицию слота
		return [
			isOutput ? this.size[0] - params.horizontalOffset : params.horizontalOffset,
			params.verticalOffset + index * params.spacing
		]
	}


	/**
	 *  Расчет параметров слотов
	 */
	#getSlotsParams(){
		// размер узла
		const height = this.size[1]

		// Если размер и режим отображения не изменились, то возвращаем параметры слотов из кеша
		if(	this._cachedSlotsParams
			&& this._cachedSlotsParams.height===height
			&& this._cachedSlotsParams.viewMode===this.viewMode
			&& this._cachedSlotsParams.inputsLength===this.inputs.length
		){
			return this._cachedSlotsParams.params
		}

		// Минимальное расстояние между слотами для режимов отображения
		const minSpacing = matchCase( this.viewMode, {
			Compact:	()=> _CFG.slots.spacing,
			System:		()=> _CFG.slots.spacingSystem,
			Adaptive:	()=> 0,
		})

		// Расстояние между слотами
		const spacing = this.viewMode!=="Adaptive"
			? minSpacing
			: Math.min ((height - _CFG.slots.padVertical*2) / this.inputs.length, _CFG.slots.spacingSystem)

		// Минимальный вертикальный отступ для режимов отображения
		const verticalMinOffset = matchCase( this.viewMode, {
			Compact:	()=> _CFG.slots.padVertical,
			System:		()=> _CFG.slots.padVerticalSystem,
			Adaptive:	()=> _CFG.slots.padVertical,
		})

		// расчет вертикального отступа для слота
		const verticalOffset = (height - (this.inputs.length-1) * spacing) / 2

		// расчет горизонтального отступа для слота
		const horizontalOffset = this.viewMode==="System"
			? _CFG.slots.padHorizontalSystem
			: _CFG.slots.padHorizontal

		// расчет шрифта для текста слотов
		const textFont = this.viewMode==="System"
			? _CFG.slots.textFontSystem
			: _CFG.slots.textFont

		// расчет горизонтального отступа для текста слотов
		const textPadding = this.viewMode==="System"
			? _CFG.slots.textPaddingSystem
			: _CFG.slots.textPadding

		// кеширование параметров слотов
		this._cachedSlotsParams = {
			height:			height,
			viewMode:		this.viewMode,
			inputsLength:	this.inputs.length,
			params: {
				minSpacing,
				spacing,
				verticalMinOffset,
				verticalOffset,
				horizontalOffset,
				textFont,
				textPadding,
			}
		}

		// возвращаем расстояние между слотами и вертикальный отступ для слота
		return this._cachedSlotsParams.params
	}


	/**
	 *  Получение текста для отображения в слоте
	 */
	#getSlotRenderingLabel(slot){
		return (slot.label || slot.localized_name || slot.name || slot.type || '*').trim()
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
							content:	NODE_CFG.menu.submenu.continueRoutes,
							callback:	()=> this.cloneWithRoutes()
						},{
							content:	NODE_CFG.menu.submenu.inputsFreezing[this.frozen ? 1 : 0],
							callback:	()=> this.setProperty("frozen", !this.frozen)
						},{
							content:	NODE_CFG.menu.submenu.slotsLabelsVisibility[this.hideLabels ? 0 : 1],
							callback:	()=> this.setProperty("hideLabels", !this.hideLabels)
						},{
							content:	NODE_CFG.menu.submenu.viewMode.title,
							has_submenu: true,
							submenu: {
								options: NODE_CFG.menu.submenu.viewMode.options().map(mode=>({
									content:	mode,
									callback:	()=> this.setProperty("viewMode", mode)
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
     *	Обновление состояния заморозки узла
     */
    #updateFrozenState(){
		// Если заморожено, то удаляем последний инпут, если он пустой
        if(this.frozen && this.inputs.length > 0){
            const lastInput = this.inputs[this.inputs.length - 1]
            if(!lastInput.connected) this.inputs.pop()
        }

		this.#normalizeSlots()
		this.expandToFitContent()	// Нормализация слотов
		this.setDirtyCanvas(true, true)
    }


	/**
	 *	Обновление видимости меток слотов
	 */
	#updateLabelsVisibility(){
		this.expandToFitContent()
		this.setDirtyCanvas(true, true)
	}


	/**
	 *  Обновление режима отображения узла
	 */
	#updateViewMode(){
		this.expandToFitContent()
		this.setDirtyCanvas(true, true)
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
		cloned.#normalizeSlots()

		this.graph.setDirtyCanvas(true, true)
    }


	/* STATIC */

    static setUp(){
		LiteGraph.registerNodeType(NODE_CFG.type, this)

		// параметры прототипа
		setObjectParams(this, NODE_CFG.prototype)
	}

}
