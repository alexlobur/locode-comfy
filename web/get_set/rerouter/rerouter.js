import Logger from "../../.core/utils/Logger.js"
import {setObjectParams} from "../../.core/utils/base_utils.js"
import {addEmptyNodeInput, normalizeDynamicInputs, overrideOnConnectInput} from "../../.core/utils/nodes_utils.js"
import {computeSlotTextWidth, updateOutputsFromReferInputs} from "../props_utils.js"
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

		// Нормализация инпутов
		this._normalizeInputs()

		// Обновление выходов
		this._updateOutputs()
    }


	/**
     *  Конфигурация узла
     */
    onConfigure(){
        try{
			// Нормализация выходов
			this._updateOutputs()
		} catch(e) {
            Logger.error(e, this)
        }
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
				this._updateOutputs()
            }, _CFG.applyDelay )
        }
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
        this._normalizeInputs()
		this._updateOutputs()
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
			const text = "!!!!" // output.localized_name || output.name || output.type || ''
			const measure = ctx.measureText(text)
			const x = this.size[0] // - measure.width - _CFG.slots.textPadding
			const y = _CFG.slots.padVertical + index * _CFG.slots.spacing + measure.actualBoundingBoxAscent/2
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
		this._updateSlotsPositions()
	}


	/**
	 *  Обновление позиций слотов
	 */
	_updateSlotsPositions(){
		this.inputs.forEach((input, index) => {
			input.pos = [
				_CFG.slots.padHorizontal,
				_CFG.slots.padVertical + index * _CFG.slots.spacing
			]
		})
		this.outputs.forEach((output, index) => {
			output.pos = [
				this.size[0] - _CFG.slots.padHorizontal,
				_CFG.slots.padVertical + index * _CFG.slots.spacing
			]
		})
	}


	/* METHODS */

    /**
     *  Нормализация инпутов
     */
    _normalizeInputs(){
        // если заморожены, то не нормализуем
        if(this.frozen) return

		// нормализация инпутов
        normalizeDynamicInputs( this, {
			onLabelChanged: (_, index, input)=>{
				input._label = " "
				Logger.debug("onLabelChanged", Array.from(this.outputs))
				// this.outputs[index].label = input.label
				this.expandToFitContent()
				this.setDirtyCanvas(true, true)
			}
		})

		Logger.debug("normalizeInputs", this)

		// добавление пустого инпута в конец
        addEmptyNodeInput(this)
	}


	/**
	 *	Обновление выходов
	 */
	 _updateOutputs(){
		// Обновление выходов
		updateOutputsFromReferInputs(this, this)

		// задаем пустое localized_name выходов
		this.outputs.forEach(output => { output.label = " " })
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
        this.setDirtyCanvas(true, true)
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
					],
				},
			},
			null
		)
	}


	/* STATIC */

    static setUp(){
		LiteGraph.registerNodeType( NODE_CFG.type, this )

		// параметры прототипа
		setObjectParams(this, NODE_CFG.prototype)

		// Переопределение присоединения к слоту
		overrideOnConnectInput( this.prototype, {
			setLabelFromOutput: false,
			setLocalizationNameFromOutput: true,
			callbackAfter: function(index, type, outputSlot, outputNode, outputIndex){
				this.inputs[index].label = " "
			}
		})

		// // Переопределение границы минимальной ширины узла (computeSize)
		// overrideComputeSizeMinWidth( this.prototype, NODE_CFG.minWidth )

	}

}
