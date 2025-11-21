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
export class InputsLabelsWidget {

    type = "object"
    hidden = true
    serialize = false
    #inputPrefix = "any"
    #node

    /**
     * @type{{name: label}}
     */
    get value(){ return this.#prepareResult() }


    // Это экранирование типа - сюда не должно прийти
    set value(val){}


    /**
     *  InputsLabelsWidget
     *  @param {*} name имя виджета
     *  @param {*} node ссылка на узел
     *  @param {*} inputPrefix Префик для поиска среди инпутов узла
     */
    constructor(node, name, inputPrefix="any"){
        this.name = name
        this.#node = node
        this.#inputPrefix = inputPrefix
    }

    // Убираем высоту нахер
    computeLayoutSize = () => ({ minWidth: 0, minHeight: 0, maxHeight: 0 })


    /**
     *  Формирует результирующий объект
     */
    #prepareResult(){
        const result = {}

        // список имен которые нельзя выбирать
        const known_names = this.#node.inputs.filter(input => input.label==undefined ).map( input => input.name )

        // список инпутов с метками и префиксом
        const labeledInputs = this.#node.inputs
            .filter(input => input.name.startsWith(this.#inputPrefix) && input.label!=undefined )

            // получение объекта вида name => label из список инпутов начинающихся с префикса
        for (const input of labeledInputs){
            // Имя метки
            const label = input.label || input.name

            // Проверка имени на валидность
            const re = /^[a-zA-Z_][a-zA-Z0-9_]*$/
            if(!re.test(label)){
                throw new Error(`
                    Bad input name "${label}" in ${this.#node.title} [${this.#node.id}]
                    Allowed: "a-zA-Z0-9_"
                `)
            }

            // Проверка на повтор имени
            if(known_names.includes(label)){
                throw new Error(`The input name "${label}" already exists in ${this.#node.title} [${this.#node.id}]`)
            }

            // Добавляем к объекту
            known_names.push(label)
            result[input.name] = label
        }
        return result
    }


}

