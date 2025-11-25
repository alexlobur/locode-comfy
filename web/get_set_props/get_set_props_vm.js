import {EventEmitter} from "../.core/notify/EventEmitter.js"


// Конфиги узлов
export const _CFG = {
    extName:        "locode.GetSetProps",
    setNode: {
        type:           "LoSetProps",
        title:          "Set:",
        inputPrefix:    "in",
        outputProps: {
            color_on:   "#FFF",
            color_off:  "#000",
        }
    },
    getNode: {
        type:           "LoGetProps",
        title:          "Get:",
        outputPrefix:   "out",
        inputProps: {
            color_on:   "#FFF",
            color_off:  "#000",
        }
    },
    
}


/**
 *  Класс: Вью-модель для Get/Set Props
 *  содержит в себе систему оповещения
 */
class _GetSetPropsVM{
    events = new EventEmitter()

    onSetInputChanged(node, index, input){
        this.events.emit("input_changed", { node, index, input })
    }


    /**
	 *	Валидация линков на соответствие типов
	 *	@param {*} output 
	 */
     validateOutputLink = function(output){
		if(!output.links) return
		const badLinks = []
		const links = output.links.forEach( linkId => {
			const link = app.graph.getLink(linkId)
			if(link.type!=output.type){
				badLinks.push(link)
			}
		})
		return badLinks
	}


	/**
	 *	Выдает список инпутов рефера, без учета последнего
	 */
    getReferActiveInputs(referNode){
		if(!referNode) return null
		// Только один инпут
		if(referNode.inputs.length<=1) return []
		// Активные инпуты
		return referNode.inputs.slice(0, referNode.inputs.length-1)
	}


}


const GetSetPropsVM = new _GetSetPropsVM()
export default GetSetPropsVM
