import {app} from "../../../scripts/app.js"
import Logger from "../.core/utils/Logger.js"
import {setObjectParams} from "../.core/utils/base_utils.js"
import GetSetPropsVM, { _CFG } from "./get_set_props_vm.js"


/**---
 * 
 *  Расширение прототипа
 */
export function LoSetPropsExtends(proto){
    const {setNode: NODE_CFG} = _CFG
	const vm = GetSetPropsVM


    /**
     * Создание узла и инициализация виджета
     */
    const _onNodeCreated = proto.onNodeCreated
    proto.onNodeCreated = function(){
        const ret = _onNodeCreated?.apply(this, arguments)
        try {
            // Начальные значения
            this.title = NODE_CFG.title

            // Параметры выхода
            setObjectParams(this.outputs[0], NODE_CFG.outputProps)
        } catch(e){
            Logger.error(e, this)
        }
        Logger.debug(this)
        return ret
    }


    /**
     *  Конфигурация узла
     */
    const _onConfigure = proto.onConfigure
    proto.onConfigure = function(){
        const ret = _onConfigure?.apply(this, arguments)
        try{
            // Нормализация инпутов
            this.normalizeInputs()
        } catch(e){
            Logger.error(e, this)
        }
        return ret
    }


    /**
     *  При изменении соединений	// side: 1 = input, 2 = output
     */
    const _onConnectionsChange = proto.onConnectionsChange
    proto.onConnectionsChange = function (side, index, connected, link, slot){
        const ret = _onConnectionsChange?.apply(this, arguments)
        setTimeout(()=>{ // задержка, чтобы успели обновиться слоты

            // входы
            if(side==1){
                this.normalizeInputs()
                // оповещение об изменении
                vm.onSetInputChanged(this, index, slot)
            }

        }, 10)
        return ret
    }


    /**
     *  Нормализация Инпутов
     */
    proto.normalizeInputs = function(){
        const that = this

        // Нормализация инпутов - удаление пустых, добавление свободного
        this.inputs = this.inputs.filter( input => input.isConnected )

        // Обновление типов
        let index=0
        for (const input of this.inputs){
            const link = app.graph.getLink(input.link)
            const originNode = app.graph.getNodeById(link.origin_id)
            input.type = originNode.outputs[link.origin_slot].type

            // создаем get/set для label
            if(!input._label){
                input._label = input.label
                Object.defineProperty( input, "label", {
                    set(value) {
                        this._label = value
                        // оповещение об изменении
                        vm.onSetInputChanged(that, index, input)
                    },
                    get(){ return this._label }
                })
            }
            index++
        }
        // Добавление свободного
        this.addInput(`${NODE_CFG.inputPrefix}${this.inputs.length}`, "*",)
    }

}





function override(protoFn, fn){
    const _protoFn = protoFn
    protoFn = function(){
        const ret = _protoFn?.apply(this, arguments)
        fn()
        return ret
    }
}
