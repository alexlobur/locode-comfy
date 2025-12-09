/**
 *  Данные элемента документации
 */
export class DocsNodeItem {

    #title = ''
    #text = ''
    get title() { return this.#title }
    get text() { return this.#text }


    /**
     *  Конструктор
     *  
     * @param {string} title
     * @param {string} text
     */
    constructor({ title = 'Untitled', text = '' } = {}){
        this.#title = title || 'Untitled'
        this.#text = text
    }


    /**
     *  Преобразовать в JSON
     *
     * @returns {Object}
     */
    toJson(){
        return {
            title: this.#title,
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
            ...this.toJson(),
            ...updates
        })
    }

}
