import {ChangeNotifier} from "../.core/notify/ChangeNotifier.js"
import { genUid } from "../.core/utils/nodes_utils.js"


/**
 *  Итерратор Табов
 */
export class TabsIterrator extends ChangeNotifier {


    /**
     * @type {Number}
     */
    #activeIndex = 0
    get activeIndex(){ return this.#activeIndex }

    /**
     * @type {TabData[]}
     */
    #tabs=[ new TabData() ]
    get tabs(){ return Array.from(this.#tabs) }

    /**
     * @type {boolean}
     */
    #hideDisabled = false
    get hideDisabled(){ return this.#hideDisabled }


    /**
     * @type {TabData}
     */
    get activeTab(){ return this.#tabs[this.#activeIndex] }


    /**
     *  @param {TabData[]|undefined} tabs
     *  @param {Number|undefined} activeIndex
     *  @returns {this}
     */
    set({ tabs, activeIndex, hideDisabled }){
        if(tabs != undefined){
            this.#tabs = Array.from(tabs??[]).map( data => new TabData(data) )
        }
        if(hideDisabled != undefined ){
            this.#hideDisabled = hideDisabled
        }
        this.#setActiveIndex(activeIndex)
        this.notifyListeners(new TabsIterratorEvent("set"))
        return this
    }


    /**
     *  Добавление Таба
     * 
     *  @param {Number?} index — если не задан, будет добавлен в конец
     *  @returns {this}
     */
    addTab( index=null, { title, text, activeIndex }={}){
        const tabData = new TabData({ title: title, text: text })
        index==null
            ? this.#tabs.push(tabData)
            : this.#tabs.splice(index, 0, tabData)
        this.#setActiveIndex(activeIndex)
        this.notifyListeners(new TabsIterratorEvent("added"))
        return this
    }


    /**
     *  Перемещение Таба
     * 
     *  @param {Number} fromIndex 
     *  @param {Number} toIndex 
     *  @returns {this}
     */
    moveTab(fromIndex, toIndex){
        // запоминаем текущий таб
        const curTab = this.activeTab
        // перемещаем
        const [item] = this.#tabs.splice(fromIndex, 1)
        this.#tabs.splice(toIndex, 0, item)
        // находим индекс текущего таба
        this.#setActiveIndex( this.#tabs.findIndex( item => item == curTab ) )
        this.notifyListeners()
        return this
    }


    /**
     *  Удаление Таба
     * 
     *  @param {Number} index
     *  @returns {this}
     */
    removeTab(index){
        if(this.#tabs.length<=1) return
        this.#tabs.splice(index, 1)
        this.#setActiveIndex()
        this.notifyListeners(new TabsIterratorEvent("removed"))
        return this
    }


    /**
     *  Уставновка активного индекса и приведение к границам
     */
    #setActiveIndex(index=null){
        if(index!=null) this.#activeIndex = index
        if(this.#activeIndex<0) this.#activeIndex=0
        if(this.#tabs.length<this.#activeIndex+1) this.#activeIndex = this.#tabs.length-1
    }


    notify = () => this.notifyListeners()


    /* Сериализация */

    /**
     * 
     * @param {Object} json 
     * @returns {this}
     */
    fromJson(json, append=false){
        const tabs = Array.from(json['tabs']??[]).map( data => new TabData(data) )
        this.set({
            tabs:           append ? [...this.#tabs, ...tabs] : tabs,
            activeIndex:    json['activeIndex']??0,
            hideDisabled:   json['hideDisabled']??false,
        })
        return this
    }


    toJson(){
        return {
            tabs:           this.#tabs,
            activeIndex:    this.#activeIndex,
            hideDisabled:   this.#hideDisabled
        }
    }    

}


/**
 *  Данные Таба
 */
export class TabData {

    uid
    title
    text
    disabled

    constructor({uid=null, title='', text='', disabled=false }={}){
        this.uid = uid || genUid()
        this.title = title
        this.text = text
        this.disabled = disabled
    }

}



class TabsIterratorEvent{

    constructor(name){
        this.name = name
    }

}

