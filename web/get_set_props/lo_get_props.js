import {app} from "../../../scripts/app.js"
import Logger from "../.core/utils/Logger.js"
import {setObjectParams} from "../.core/utils/base_utils.js"
import GetSetPropsVM, { _CFG } from "./get_set_props_vm.js"


/**---
 * 
 *  Расширение прототипа
 */
export function LoGetPropsExtends(proto){
	const {getNode: NODE_CFG} = _CFG
	const vm = GetSetPropsVM


	// создаем сеттеры/геттеры для referId
	Object.defineProperty( proto, "referId", {
		get() { return this.properties.referId },
	})


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

			// Свойства
			this.properties = this.properties || {}
			this.properties.referId = ""

			// Параметры входа
			setObjectParams(this.inputs[0], NODE_CFG.inputProps)

		} catch(e){
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
			this.normalizeOutputs()
        } catch(e){
            Logger.error(e, this)
        }
        return ret
    }


	/**
	 *	Ищет рефер по ссылкам
	 */
	proto.findReferNode = function(){
		// TODO: ....
	}


	/**
	 *	Обновление выходов на основе узла-рефера
	 */
	proto.updateOutputsFromRefer = function(fitSize=false){
		const referInputs = vm.getReferActiveInputs(app.graph.getNodeById(this.referId))
		if(!referInputs) return

		const badLinks = []

		// обновление выходов
		for (let index = 0; index < referInputs.length; index++){
			const input = referInputs[index]

			// создание / обновление выхода
			const output = !this.outputs[index]
				? this.addOutput("*", "*")
				: this.outputs[index]
			output.label = input.label || input.name
			output.type = input.type

			// Валидация линков
			badLinks.push(vm.validateOutputLink(output))
		}

		// Удаление узлов, которые выходят за границы
		while(this.outputs[referInputs.length]!=null){
			this.removeOutput(referInputs.length)
		}

		// this.title = "Lo:Get > "+node.title.replace("Lo:Set", "")
		// this.setDirtyCanvas(true, true)

		if(fitSize) this.setSize(this.computeSize())
	}


	/**
     *	Дополнительные опции
     */
	// proto.getExtraMenuOptions = function(_, options){
	// 	// список LoSet нодов
	// 	const setNodes = app.graph.findNodesByType(cfg.setNode.type)

	// 	// Подменю
	// 	const submenuOptions = setNodes.map( node => ({
	// 		content: `${this.referId==node.id ? "&rArr; " : ""} #${node.id} ${node.title}`,
	// 		callback: () => {
	// 			this.setOutputsFromRefer(node)
	// 		}
	// 	}))
	// 	submenuOptions.push({
	// 		content: `None`,
	// 		callback: () => {
	// 			this.properties.referId = ""
	// 			this.normalizeOutputs()
	// 		}
	// 	})

	// 	// Опции будут наверху
	// 	options.unshift(
	// 		{
	// 			content: "Lo:Get > Outputs From...",
	// 			// callback: () => {},
	// 			has_submenu: true,
	// 			submenu: {
	// 				title: "Set Outputs From:",
	// 				options: submenuOptions
	// 			},
	// 		},
	// 		{
	// 			content: "Lo:Get > Update Outputs",
	// 			callback: () => this.normalizeOutputs(),
	// 		},
	// 		null
	// 	)
	// }

}