import Logger from "../../.core/utils/Logger.js"
import {setObjectParams, watchProperty, matchCase} from "../../.core/utils/base_utils.js"
import {HiddenWidget} from "../../.core/widgets/HiddenWidget.js"
import { _CFG } from "./config.js"
import GetSetPropsVM from "./get_set_props_vm.js"
import {PropsUtils} from "../props_utils.js"
import {LoNodesUtils} from "../../.core/utils/lo_nodes_utils.js"

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

        // запоминаем время создания узла
        this._createdTime = Date.now()

        // Добавление виджета списка типов данных
        this._typesWidget = createSetterTypesWidget(this)

        // Параметры выхода
        this._setOutputParams()

        // Нормализация инпутов, чтобы создать пустой инпут в конце
        this._normalizeInputs()

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

        // Нормализация инпутов
        this._normalizeInputs()

        // оповещение об изменении
        VM.setterConfigured(this)
        return ret
    }


	/**
	 *  При изменении свойств узла
	 */
    const _onPropertyChanged = proto.onPropertyChanged
	proto.onPropertyChanged = function(property, value){
        const ret = _onPropertyChanged?.apply(this, arguments)

        // задержка, чтобы не реагировать на изменения свойств узла сразу после создания
		if(Date.now() - this._createdTime < _CFG.afterCreateDelay) return

		// обновление состояния узла в зависимости от измененного свойства
		matchCase(property, {
			// заморозка узла
			frozen: ()=> this._freezeInputsToggle(),
		})

        return ret
	}


    /**
     *  Переопределение присоединения к слоту
     */
    LoNodesUtils.overrideOnConnectInputDynamic(proto)


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
            cloned._setOutputParams()
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
            PropsUtils.drawFrozenIndicator(ctx, { centerPos: [title_height*0.5, -title_height*0.5] })
        } else {
            _drawTitleBox?.apply(this, arguments)
        }
    }


    /* METHODS */

    /**
     *  Нормализация инпутов
     */
    proto._normalizeInputs = function(){
        // нормализация инпутов
        LoNodesUtils.normalizeDynamicInputs(this, {
            removeEmptyInputs: !this.frozen,
            onLabelChanged: (node, index, input)=>VM.setterInputChanged(node, index, input)
        })

        // добавление пустого инпута в конец
        if(!this.frozen) LoNodesUtils.addEmptyInput(this)
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


    /* MENU & METHODS */


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


    /**
     *  Заморозка инпутов
     */
    proto._freezeInputsToggle = function(){
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
					options: [
						{
							content: NODE_CFG.menu.submenu.frozenInputs[ this.frozen ? 1 : 0 ],
							callback:  ()=> this.setProperty("frozen", !this.frozen)
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

