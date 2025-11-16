/**
 *  Данные комментария
 */
export class CommentData {

    #title
    #titleColor
    #titleFont
    #text
    #textColor
    #textFont
    #bgColor
    #borderColor
    #borderSize
    #padding

    // Геттеры
    get title() { return this.#title }
    get titleColor() { return this.#titleColor }
    get titleFont() { return this.#titleFont }
    get text() { return this.#text }
    get textColor() { return this.#textColor }
    get textFont() { return this.#textFont }
    get bgColor() { return this.#bgColor }
    get borderColor() { return this.#borderColor }
    get borderSize() { return this.#borderSize }
    get padding() { return this.#padding }


    /**
     * @param {string} title - заголовок комментария
     * @param {string} titleColor - цвет заголовка (hex, rgb, или название)
     * @param {string} titleFont - шрифт заголовка
     * @param {string} text - текст комментария
     * @param {string} textColor - цвет текста комментария (hex, rgb, или название)
     * @param {string} textFont - шрифт комментария
     * @param {string} bgColor - цвет фона
     * @param {string} borderColor - цвет рамки
     * @param {number} borderSize - толщина рамки в пикселях
     * @param {number} padding - отступ текста
     */
    constructor({
        title = '',
        titleColor = '#FFFFFF66',
        titleFont = '600 11px Arial, sans-serif',
        text = '',
        textColor = '#FFFFFF66',
        textFont = '400 10px Arial, sans-serif',
        bgColor = '#333333344',
        borderColor = '',
        borderSize = 0.5,
        padding = 10.0
    }={}) {
        this.#title = title
        this.#titleColor = titleColor
        this.#titleFont = titleFont
        this.#text = text
        this.#textColor = textColor
        this.#textFont = textFont
        this.#bgColor = bgColor
        this.#borderColor = borderColor
        this.#borderSize = borderSize
        this.#padding = padding
    }


    /**
     * Преобразует объект в JSON строку
     * @returns {string} JSON представление объекта
     */
    toJson() {
        return JSON.stringify({
            title: this.#title,
            titleColor: this.#titleColor,
            titleFont: this.#titleFont,
            text: this.#text,
            textColor: this.#textColor,
            textFont: this.#textFont,
            bgColor: this.#bgColor,
            borderColor: this.#borderColor,
            borderSize: this.#borderSize,
            padding: this.#padding
        })
    }

    /**
     * Создает объект CommentData из JSON строки
     * 
     * @param {string} jsonString - JSON строка
     * @returns {CommentData} новый экземпляр CommentData
     */
    static fromJson(jsonString=""){
        try {
            const data = JSON.parse(jsonString)
            return new CommentData({
                title: data.title,
                titleColor: data.titleColor,
                titleFont: data.titleFont,
                text: data.text,
                textColor: data.textColor,
                textFont: data.textFont,
                bgColor: data.bgColor,
                borderColor: data.borderColor,
                borderSize: data.borderSize,
                padding: data.padding,
            })
        } catch (error) {
            console.error('Ошибка при парсинге JSON:', error)
            return new CommentData()
        }
    }

    /**
     * Создает копию объекта с обновленными свойствами
     * @param {Object} updates - объект с обновляемыми свойствами
     * @param {string} [updates.title] - новый заголовок
     * @param {string} [updates.titleColor] - новый цвет заголовка
     * @param {string} [updates.titleFont] - новый шрифт заголовка
     * @param {string} [updates.text] - новый комментарий
     * @param {string} [updates.textColor] - новый цвет комментария
     * @param {string} [updates.textFont] - новый шрифт комментария
     * @param {string} [updates.bgColor] - новый цвет фона
     * @param {string} [updates.borderColor] - новый цвет рамки
     * @param {number} [updates.borderSize] - новая толщина рамки
     * @param {number} [updates.padding] - отступ
     * @returns {CommentData} новый экземпляр с обновленными свойствами
     */
    copyWith(updates = {}) {
        return new CommentData({
            title: updates.title !== undefined ? updates.title : this.#title,
            titleColor: updates.titleColor !== undefined ? updates.titleColor : this.#titleColor,
            titleFont: updates.titleFont !== undefined ? updates.titleFont : this.#titleFont,
            text: updates.text !== undefined ? updates.text : this.#text,
            textColor: updates.textColor !== undefined ? updates.textColor : this.#textColor,
            textFont: updates.textFont !== undefined ? updates.textFont : this.#textFont,
            bgColor: updates.bgColor !== undefined ? updates.bgColor : this.#bgColor,
            borderColor: updates.borderColor !== undefined ? updates.borderColor : this.#borderColor,
            borderSize: updates.borderSize !== undefined ? updates.borderSize : this.#borderSize,
            padding: updates.padding !== undefined ? updates.padding : this.#padding,
        })
    }
}