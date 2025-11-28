/**
 *  Скрытый виджет
 */
export class HiddenWidget {

    serialize = false
    name = ""
    type = "custom"

    #node
    #getValue
    #setValue

    get value(){ return this.#getValue?.() }
    set value(val){ this.#setValue?.(val) }
    get node(){ return this.#node }
    get hidden(){ return true }

    /**
     *  HiddenWidget
     * 
     *  @param {string} name имя виджета
     *  @param {string} node ссылка на узел
     *  @param {string} type тип виджета
     *  @param {()=> *} getValue вызывается, когда нужно получить значение
     *  @param {(val)=>void} setValue вызывается, когда нужно установить значение
     */
    constructor(node, name, { type="custom", serialize=false, getValue=null, setValue=null }={}){
        this.name = name
        this.type = type
        this.serialize = serialize
        this.#node = node
        this.#getValue = getValue
        this.#setValue = setValue
    }

    draw(){ return; }

    // Убираем высоту
    computeSize(width){ return [0, 0] }
    computeLayoutSize = () => ({ minWidth: 0, minHeight: 0, maxHeight: 0, maxWidth: 0 })

}
