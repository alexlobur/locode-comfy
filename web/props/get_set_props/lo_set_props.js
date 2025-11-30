import Logger from "../../.core/utils/Logger.js"
import {app} from "../../../../scripts/app.js"
import {setObjectParams, makeUniqueName} from "../../.core/utils/base_utils.js"
import {HiddenWidget} from "../../.core/widgets/HiddenWidget.js"
import GetSetPropsVM, {_CFG} from "./get_set_props_vm.js"
import {addEmptyNodeInput, normalizeDynamicInputs, overrideOnConnectInput, watchSlotLabel}
    from "../../.core/utils/nodes_utils.js"

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
    overrideOnConnectInput(proto)


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
    proto.onRemoved = function (side, index, connected, link, slot){
        const ret = _onRemoved?.apply(this, arguments)
        // вызываем с задержкой, чтобы узел успел удалиться из графа
        setTimeout(()=> VM.setterAfterRemoved(this), 100)
        return ret
    }



    /**
     *  Клонирование узла
     */
    const _clone = proto.clone
    proto.clone = function (){
        const cloned = _clone?.apply(this, arguments)
        if(cloned){
            this._normalizeInputs()
            cloned.size = cloned.computeSize()
            if(cloned.outputs[0].label){
                cloned.outputs[0].label = makeUniqueName( this.outputs[0].label, VM.findSetters().map( item => item.propsName ) )
            }
            return cloned
        }
    }


    /**
     *  Рисование переднего плана
     */
    proto.onDrawForeground = function(ctx){
        if(this.frozen) this._drawFrozenIndicator(ctx)
    }


    /**
     *  Рисование индикатора заморозки
     */
    proto._drawFrozenIndicator = function(ctx){
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
     *  Устанавливает параметры инпута на основе соединения
     */
    proto._setInputFromConnection = function(index, link=null){

        const input = this.inputs[index]
        link = link ?? app.graph.getLink(input.link)

        const originNode = app.graph.getNodeById(link.origin_id)
        .name = makeUniqueName(
            originNode.outputs[link.origin_slot].type,
            this.inputs.map( item => item.name ),
            {
                excludeIndex: index 
            }
        )
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
            watchSlotLabel( this.outputs[0], {
                onChanged: (_) => VM.setterOutputRenamed(this),
                onSet: (value) => {
                    return makeUniqueName(value, VM.findSetters().map( item => item.propsName ))
                }
            })

            // оповещение об изменении
            VM.setterOutputRenamed(this)

        }, 100)
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

        // Обновление заголовка узла
        // this._updateTitle()
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
        app.graph.add(getter)

        // Установка текущего сеттера
        getter.updateSetterId(this.id)

        // Создание ссылки между выходом сеттера и входом геттера
        try{
            this.connect(0, getter, 0)
        } catch(e){
            Logger.error(e, this)
        }
        app.graph.setDirtyCanvas(true, true)
    }


    /* MENU */

    /**
     *	Дополнительные опции
     */
     proto.getExtraMenuOptions = function(_, options){
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

}


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

