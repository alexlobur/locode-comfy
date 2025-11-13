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
    #data = [new ReplacerItem("find", "replace"),]

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


    fromJson(data){
        this.#data = data.map( itemData => ReplacerItem.fromData(itemData) )
        this.#normalizeData()
    }


    toJson(){
        return this.#data
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

    static fromData(data){
        return new ReplacerItem(data.find??"find", data.replace??"replace")
    }

}
