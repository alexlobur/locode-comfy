/**
 * 
 *  ### Скрытый виджет для получения измененных label инпутов узла
 *
 *  Собирает изменненные `label` инпутов начинающихся `inputPrefix` и возвращает объект вида:
 *  ```
 *  {
 *      name1: label1, 
 *      name2: label2
 *  }
 *  ```
 */
export class LoSetWidget {

    type = "object"
    hidden = true
    serialize = false
    #node

    /**
     * @type{{name: label}}
     */
    get value(){ return this.#prepareResult() }


    // Это экранирование типа - сюда не должно прийти
    set value(val){}


    /**
     *  LoSetWidget
     *  @param {*} name имя виджета
     *  @param {*} node ссылка на узел
     */
    constructor(node, name){
        this.name = name
        this.#node = node
    }

    // Убираем высоту нахер
    computeLayoutSize = () => ({ minWidth: 0, maxWidth: 0, minHeight: 0, maxHeight: 0 })


    /**
     *  Формирует результирующий объект
     */
    #prepareResult(){
        const result = []
        for (const input of this.#node.inputs){
            result.push(input.value)
        }
        return result
    }

}
