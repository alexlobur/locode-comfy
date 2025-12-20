import Logger from "../../.core/utils/Logger.js"
import {setObjectParams, makeUniqueName, watchProperty} from "../../.core/utils/base_utils.js"
import {addEmptyNodeInput, normalizeDynamicInputs, overrideOnConnectInputDynamic} from "../../.core/utils/nodes_utils.js"
import {HiddenWidget} from "../../.core/widgets/HiddenWidget.js"
import { _CFG } from "./config.js"
import GetSetPropsVM from "./get_set_props_vm.js"
import {drawFrozenIndicator} from "../props_utils.js"

const VM = GetSetPropsVM
const {setNode: NODE_CFG} = _CFG


/**---
 * 
 *  Расширение прототипа
 */
export function LoSetPropsExtends(proto){

    // создаем сеттеры/геттеры для названия свойств
	Object.defineProperty( proto, "propsName", {
		get() { return this.outputs[0]?.label??this.outputs[0]?.localized_name??null },
	})


    // создаем свойство заморозки
	Object.defineProperty( proto, "frozen", {
		get() { return this.properties?.frozen??false },
	})


    /* NODE EVENTS */

    /**
     *  Создание узла и инициализация виджета
     */
    const _onNodeCreated = proto.onNodeCreated
    proto.onNodeCreated = function(){
        const ret = _onNodeCreated?.apply(this, arguments)

        // Начальные значения
        this.title = NODE_CFG.title
        // Добавление начального инпута
        addEmptyNodeInput(this)

        // Добавление виджета списка типов данных
        this._typesWidget = createSetterTypesWidget(this)

        // Параметры выхода
        this._setOutputParams()

        // оповещение об изменении
        VM.setterCreated(this)
        return ret
    }


    /**
     *  Конфигурация узла
     */
    const _onConfigure = proto.onConfigure
    proto.onConfigure = function(){
        const ret = _onConfigure?.apply(this, arguments)

        // Параметры выхода
        this._setOutputParams()

        // оповещение об изменении
        VM.setterConfigured(this)
        return ret
    }


    /**
     *  Переопределение присоединения к слоту
     */
    overrideOnConnectInputDynamic(proto)


    /**
     *  При изменении соединений	// side: 1 = input, 2 = output
     */
    const _onConnectionsChange = proto.onConnectionsChange
    proto.onConnectionsChange = function (side, index, connected, link, slot){
        const ret = _onConnectionsChange?.apply(this, arguments)
        // input
        if(side==1){
            setTimeout(()=>{
                this._normalizeInputs()
                VM.setterInputChanged(this, index, slot)    // оповещение об изменении
            }, _CFG.applyDelay )
        } else {
        // output
            VM.setterOutputConnectChanged(this, slot)       // оповещение об изменении
        }

        return ret
    }


    /**
     *  Переопределение отсоединения выхода
     */
    const _disconnectOutput = proto.disconnectOutput
    proto.disconnectOutput = function(slot){
        try{
            const ret = _disconnectOutput?.apply(this, arguments)
            return ret
        } catch(e){
            Logger.error(e, this)
        }
    }


    /**
     *  Удаление узла
     */
    const _onRemoved = proto.onRemoved
    proto.onRemoved = function (){
        const ret = _onRemoved?.apply(this, arguments)
        // вызываем с задержкой, чтобы узел успел удалиться из графа
        const nodeId = this.id
        setTimeout(()=> VM.setterAfterRemoved(nodeId), _CFG.applyDelay)
        return ret
    }


    /**
     *  Клонирование узла
     */
    const _clone = proto.clone
    proto.clone = function (){
        const cloned = _clone?.apply(this, arguments)
        if(cloned){
            cloned._normalizeInputs()
            cloned.size = cloned.computeSize()
            if(cloned.outputs[0].label){
                cloned.outputs[0].label = makeUniqueName(
                    this.outputs[0].label,
                    VM.findSetters().map( item => item.propsName )
                )
            }
            return cloned
        }
    }


    /* NODE DRAW */


    /**
     *  Рисование бокса заголовка узла
     *  - Если заморожен, то рисуется индикатор заморозки
     *  - Иначе рисуется бокс заголовка узла
     */
    const _drawTitleBox = proto.drawTitleBox
    proto.drawTitleBox = function(ctx, { scale, low_quality = false, title_height = LiteGraph.NODE_TITLE_HEIGHT, box_size = 10 }){
        if(this.frozen){
            drawFrozenIndicator(ctx, { centerPos: [title_height*0.5, -title_height*0.5] })
        } else {
            _drawTitleBox?.apply(this, arguments)
        }
    }


    /* METHODS */

    /**
     *  Нормализация инпутов
     */
    proto._normalizeInputs = function(){
        // если заморожены, то не нормализуем
        if(this.frozen) return

        // нормализация инпутов
        normalizeDynamicInputs(this, {
            onLabelChanged: (node, index, input)=>VM.setterInputChanged(node, index, input)
        })

        // добавление пустого инпута в конец
        addEmptyNodeInput(this)
    }


    /**
     *  Обновление параметров выхода
     */
    proto._setOutputParams = function (){
        // отложенно, т.к. иначе - неверный id
        setTimeout(() => {
            setObjectParams(this.outputs[0], {
                ...NODE_CFG.outputProps,
                localized_name: `${NODE_CFG.outputProps.name}_${this.id}`,
            })

            // вешаем слушатель на label
            watchProperty( this.outputs[0], "label", {
                onChanged: (_) => VM.setterOutputRenamed(this),
            })

            // обновление графики
            this.setDirtyCanvas(true, true)

            // оповещение об изменении
            VM.setterOutputRenamed(this)
        }, _CFG.applyDelay )
    }


    /**
     *  Заморозка инпутов
     */
    proto._freezeInputsToggle = function(){
        this.properties = this.properties || {}
        this.properties.frozen = !this.properties.frozen

        // Если заморожено, то удаляем последний инпут, если он пустой
        if(this.frozen && this.inputs.length > 0){
            const lastInput = this.inputs[this.inputs.length - 1]
            if(!lastInput.connected) this.inputs.pop()
        }

        // Нормализация инпутов
        this._normalizeInputs()
        this.setDirtyCanvas(true, true)
    }


    /**
     *  Создание геттера
     */
    proto._createGetter = function(){
        const getter = LiteGraph.createNode(_CFG.getNode.type)
        if (!getter) return

        // ставим рядом с текущим узлом
        getter.pos = [
            this.pos[0] + this.size[0] + _CFG.onCreateGetterOffset[0],
            this.pos[1] + _CFG.onCreateGetterOffset[1]
        ]
        this.graph.add(getter)

        // Установка текущего сеттера
        getter.updateSetterId(this.id)

        // Создание ссылки между выходом сеттера и входом геттера
        try{
            this.connect(0, getter, 0)
        } catch(e){
            Logger.error(e, this)
        }
        this.graph.setDirtyCanvas(true, true)
    }


    /* MENU */

    /**
     *	Дополнительные опции
     */
     const _getExtraMenuOptions = proto.getExtraMenuOptions
     proto.getExtraMenuOptions = function(canvas, menu){
        menu = menu ?? []
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
							callback:  ()=> this._createGetter()
						},
					],
				},
			},
			null
		)
        return _getExtraMenuOptions ? _getExtraMenuOptions.apply(this, [canvas, menu]) : undefined
	}

}

// Тип узла (static)
LoSetPropsExtends.nodeType = NODE_CFG.type


/*
------

    WIDGETS

------
*/


/**
 *	Создает скрытый виджет списка типов данных.
 *	@param {*} node 
 */
 function createSetterTypesWidget(node){
	const widget = node.addCustomWidget(
		new HiddenWidget( node, "props_types", {
			type: "list",
			getValue: () => node.inputs.map(input => input.type),
		})
	)
	return widget
}

