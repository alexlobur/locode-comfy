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
     *  Заморожены ли параметры ввода
     */
    get frozen(){ return this.properties?.frozen??false }


	/**
	 *  Видимость меток слотов
	 */
	get slotsLabelsVisible(){ return this.properties?.slotsLabelsVisible??true }


	/**---
     * 
     *  Конструктор
     */
    constructor(title=NODE_CFG.title){
		super(title)

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

		// Нормализация слотов
		this._normalizeSlots()
    }


	// /**
    //  *  Конфигурация узла
    //  */
    // onConfigure(){}


	// getSlotMenuOptions(){
	// 	super.getSlotMenuOptions(...arguments)
	// 	Logger.debug("getSlotMenuOptions", arguments)
	// }

	getExtraSlotMenuOptions(){

		app.canvas.createDialog(
			"<span class='name'>Name</span><input autofocus type='text'/><button>OK</button>",
		)

		Logger.debug("getExtraSlotMenuOptions", arguments)
		return [
		]
	}


	/**
     *  Присоединение к динамическому инпуту
     */
	onConnectInput(index, type, outputSlot, outputNode, outputIndex){
		const input = this.inputs[index]

		// параметры инпута из выхода
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
	 *  Нормализация слотов
	 */
	_normalizeSlots(){
        // если заморожены, то не нормализуем
        if(this.frozen) return

		// нормализация инпутов
		normalizeDynamicInputs( this, {
			onLabelChanged: (_, input, value)=>{
				const index = this.inputs.indexOf(input)
				if(index===-1) return // инпут не найден, такого не должно быть
				this.outputs[index].localized_name = value
			}
		})
		// добавление пустого инпута в конец
		addEmptyNodeInput(this)

		// установка слушателя на изменения label
		for(const output of this.outputs){
			watchProperty(output, "label", {
				onChanged: (value)=>{
					const index = this.outputs.indexOf(output)
					if(index===-1) return // выход не найден, такого не должно быть
					output.localized_name = value
					this.inputs[index].localized_name = value
				}
			})
		}

		// Нормализация выходов
		PropsUtils.updateOutputsFromRefer(this, this)

		// переопределение renderingLabel для слотов
		Logger.debug("normalizeSlots", this.slots)
		this.slots.forEach( slot=>{
			try{
				Object.defineProperty(slot, "renderingLabel", { get: ()=> "" })
			}catch(e){}
		})
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
        this._normalizeSlots()
    }


	/* NODE DRAW */

	/**
	 *  Рисование переднего плана узла
	 */
	onDrawForeground(ctx){
		// рисуем типы выходов
		ctx.save()
		ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
		for (let index = 0; index < this.outputs.length; index++){
			const output = this.outputs[index]
			const text = output.label || output.localized_name || output.name || output.type || '*'
			const measure = ctx.measureText(text)
			const x = output.pos[0] - measure.width - _CFG.slots.textPadding
			const y = output.pos[1] + measure.actualBoundingBoxAscent/2
			ctx.fillText(text, x, y)
		}
		ctx.restore()
	}


	/**
	 *  Расчет размера узла
	 */
	computeSize(){
		// получаем расчетный размер узла
		// let size = super.computeSize(...arguments)

		// начальная ширина узла
		let width = _CFG.slots.minWidth

		// // расчет ширины инпутов
		// // ширину выходов не считаем, т.к. они не имеют текста
		// for (const input of this.inputs){
		// 	const text = input.label || input.localized_name || input.name || ''
		// 	// расчет ширины текста
		// 	const text_width = computeSlotTextWidth(text.trim(), this.innerFontStyle)
		// 	if (text_width > slots_width) slots_width = text_width
		// }
		// добавление ширины слота
		// slots_width = slots_width + 2 * LiteGraph.NODE_SLOT_HEIGHT

		// высота узла
		const height = _CFG.slots.padVertical * 2 + (this.inputs.length-1) * _CFG.slots.spacing

		// возвращаем ширину и высоту
		return [width, height]
	}


	/**
	 *  Установка размера узла
	 */
	setSize(size){
		super.setSize(size)
		this.#updateSlotsPositions()
	}


	/**
	 *  Обновление позиций слотов
	 */
	#updateSlotsPositions(){
		const verticalOffset = this.#getVerticalOffset()

		this.inputs.forEach((input, index) => {
			input.pos = [
				_CFG.slots.padHorizontal,
				verticalOffset + index * _CFG.slots.spacing
			]
		})
		this.outputs.forEach((output, index) => {
			output.pos = [
				this.size[0] - _CFG.slots.padHorizontal,
				verticalOffset + index * _CFG.slots.spacing
			]
		})
	}


	/**
	 *  Определение вертикального отступа, чтобы слоты были по центру узла
	 */
	#getVerticalOffset(){
		return (this.size[1] - (this.inputs.length-1) * _CFG.slots.spacing) / 2
	}


	/* METHODS */


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

		// Нормализация слотов
		this._normalizeSlots()

		// обновление размера узла - чтобы сработал перерасчет позиций слотов
		this.setSize(this.size)
    }


	/**
	 *  Продолжение маршрутов
	 */
	_continueRoutes(){
		Logger.debug("continueRoutes", this)
	}


	/**
	 *  Переключение видимости меток слотов
	 */
	_slotsLabelsVisibilityToggle(){
		this.properties = this.properties || {}
		this.properties.slotsLabelsVisible = !this.properties.slotsLabelsVisible
		Logger.debug("slotsLabelsVisibilityToggle", this)
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
							content:   NODE_CFG.menu.submenu.continueRoutes,
							callback:  ()=> this._continueRoutes()
						},
						{
							content:   this.slotsLabelsVisible
								? NODE_CFG.menu.submenu.unhideSlotsLabels
								: NODE_CFG.menu.submenu.hideSlotsLabels,
							callback:  ()=> this._slotsLabelsVisibilityToggle()
						},
					],
				},
			},
			null
		)
	}


	/* STATIC */

    static setUp(){
		LiteGraph.registerNodeType(NODE_CFG.type, this)

		// параметры прототипа
		setObjectParams(this, NODE_CFG.prototype)
	}

}
