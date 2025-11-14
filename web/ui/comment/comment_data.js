/**
 *  Данные комментария
 */
export class CommentData {

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
        borderSize = 0.5
    }={}) {
        this.title = title
        this.titleColor = titleColor
        this.titleFont = titleFont
        this.text = text
        this.textColor = textColor
        this.textFont = textFont
        this.bgColor = bgColor
        this.borderColor = borderColor
        this.borderSize = borderSize
    }


    /**
     * Преобразует объект в JSON строку
     * @returns {string} JSON представление объекта
     */
    toJson() {
        return JSON.stringify(this)
    }


    /**
     * Создает объект CommentData из JSON строки
     * 
     * @param {string} jsonString - JSON строка
     * @returns {CommentData} новый экземпляр CommentData
     */
    static fromJson(jsonString){
        try {
            const data = JSON.parse(jsonString)
            return new CommentData(
                data.title,
                data.titleColor,
                data.titleFont,
                data.text,
                data.textColor,
                data.textFont,
                data.bgColor,
                data.borderColor,
                data.borderSize
            )
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
     * @returns {CommentData} новый экземпляр с обновленными свойствами
     */
    copyWith(updates = {}) {
        return new CommentData(
            updates.title !== undefined ? updates.title : this.title,
            updates.titleColor !== undefined ? updates.titleColor : this.titleColor,
            updates.titleFont !== undefined ? updates.titleFont : this.titleFont,
            updates.text !== undefined ? updates.text : this.text,
            updates.textColor !== undefined ? updates.textColor : this.textColor,
            updates.textFont !== undefined ? updates.textFont : this.textFont,
            updates.bgColor !== undefined ? updates.bgColor : this.bgColor,
            updates.borderColor !== undefined ? updates.borderColor : this.borderColor,
            updates.borderSize !== undefined ? updates.borderSize : this.borderSize
        )
    }


}