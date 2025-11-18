import Logger from "../../.core/utils/Logger.js"
import {createElement, haltEvent} from "../../.core/utils/dom_utils.js"


/**---
 * 
 *  ReplacersInputs
 */
export class ReplacersInputs{

    /**
     * @type {Element}
     */
    #element

    /**
     * @type {ReplacerItem[]}
     */
    get data(){ return this.#data }
    #data = [new ReplacerItem(),]

    #onChanged


    /**
     *  @param {Element} parent
     *  @param {[string[]]} data
     *  @param {function()} onChanged
     */
    constructor({ parent, data, onChanged }){
        this.#createElement(parent)
        this.#data = data ?? this.#data
        this.#onChanged = onChanged
        this.#setState()
    }


    /**
     *  Создание контейнера
     */
    #createElement(parent){
        this.#element = createElement("div", {
            classList: ["items"],
            parent: parent
        })
    }


    /**
     *
     */
    #normalizeData(){
        this.#data = this.#data.filter( item => !item.isEmpty )
        this.#data.push(new ReplacerItem())
        this.#setState()
    }


    /**
     *  Обновить стейт
     */
    #setState(){
        let inFocus = false
        // создание инпута
        const createInput = (item, name, parent)=>{
            createElement("div", {
                content: item[name],
                events: {
                    "click": (e)=> haltEvent(e),
                    "input": (e)=>{
                        item[name] = e.target.textContent
                        this.#onChanged?.()
                    },
                    "focusin": (e)=> inFocus = true,
                    "focusout": (e)=> {
                        inFocus = false
                        // нормализуем данные если нет фокуса
                        setTimeout(()=>{
                            if(!inFocus) this.#normalizeData()
                        }, 50)
                    },
                },
                attributes: { "contenteditable": true },
                parent: parent
            })
        }

        // Пересоздаем инпуты
        this.#element.innerHTML = ''
        for (const item of this.#data){
            createInput(item, "find", this.#element)
            createInput(item, "replace", this.#element)
        }
    }


    decode(data){
        this.#data = data.map( item => new ReplacerItem(item[0], item[1]) )
        this.#normalizeData()
    }


    encode(){
        return this.#data
            .filter( item => !item.isEmpty )
            .map( item => [item.find, item.replace] )
    }

}


/**
 *  ReplacerItem
 */
export class ReplacerItem{

    get isEmpty(){
        return (this.find.trim()+this.replace.trim()=='')
    }

    constructor(find='', replace=''){
        this.find = find
        this.replace = replace
    }

}
