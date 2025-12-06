/**
 *  Данные элемента документации
 */
export class DocsNodeItem {

    #header = ''
    #text = ''

    /**
     *  Конструктор
     *  
     * @param {Object} data
     * @param {string} data.header
     * @param {string} data.text
     */
    constructor(data){
        this.#header = data?.header || ''
        this.#text = data?.text || ''
    }


    /**
     *  Преобразовать в JSON
     *
     * @returns {Object}
     */
    toJson(){
        return {
            header: this.#header,
            text: this.#text
        }
    }


    /**
     *  Преобразовать из JSON
     *
     * @param {Object} data
     * @returns {DocsNodeItem}
     */
    static fromJson(data){
        return new DocsNodeItem(data)
    }


    /**
     *  Сделать копию с обновленными данными
     *
     * @param {Object} updates
     * @returns {DocsNodeItem}
     */
    copyWith(updates = {}) {
        return new DocsNodeItem({
            ...this,
            ...updates
        })
    }

}


