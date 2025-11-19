import {TextData} from "../.core/entity/TextData.js";

/**
 *  Данные комментария
 */
export class CommentData {


    /**
     *  @type {TextData}
     */
    #header

    /**
     *  @type {TextData}
     */
    #text

    #bgColor

    #borderColor
    #borderSize
    #borderRadius

    #padding
    #headerGap

    // Подгонять размер под контент
    #hugContent

    // Геттеры
    get header() { return this.#header }
    get text() { return this.#text }

    get padding() { return this.#padding }
    get headerGap() { return this.#headerGap }
    get hugContent(){ return this.#hugContent }

    get bgColor() { return this.#bgColor }
    get borderRadius() { return this.#borderRadius }
    get borderColor() { return this.#borderColor }
    get borderSize() { return this.#borderSize }


    /**---
     * 
     * @param {TextData} header
     * @param {TextData} text
     * @param {number} padding - отступ от края
     * @param {number} headerGap - пространство между заголовком и текстом
     * @param {boolean} hugContent - Подгонять размер под контент
     * @param {string} bgColor - цвет фона
     * @param {number} borderRadius
     * @param {string} borderColor
     * @param {number} borderSize
     */
    constructor({
        header= new TextData(),
        text= new TextData(),
        padding = 10.0,
        headerGap = 10.0,
        hugContent = false,
        bgColor = '#333333344',
        borderRadius = 8.0,
        borderColor = '',
        borderSize = 0.5,
    }={}) {
        this.#header = header
        this.#text = text
        this.#padding = Number(padding)
        this.#headerGap = Number(headerGap)
        this.#hugContent = hugContent == true
        this.#bgColor = bgColor.trim()
        this.#borderRadius = Number(borderRadius)
        this.#borderColor = borderColor.trim()
        this.#borderSize = Number(borderSize)
    }


    /**
     * Преобразует объект в JSON строку
     * @returns {Object} JSON представление объекта
     */
    toJson() {
        return {
            header:      this.#header.toJson(),
            text:        this.#text.toJson(),
            padding:     this.#padding,
            headerGap:         this.#headerGap,
            hugContent:   this.#hugContent,
            bgColor:     this.#bgColor,
            borderColor: this.#borderColor,
            borderRadius: this.#borderRadius,
            borderSize:  this.#borderSize,
        }
    }


    /**
     * Создает объект CommentData из JSON строки
     * 
     * @param {Object} data - Объект JSON
     * @returns {CommentData} новый экземпляр CommentData
     */
    static fromJson(data){
        try {
            return new CommentData({
                header:         TextData.fromJson(data.header),
                text:           TextData.fromJson(data.text),
                padding:        data.padding,
                headerGap:            data.headerGap,
                hugContent:      data.hugContent,
                bgColor:        data.bgColor,
                borderColor:    data.borderColor,
                borderRadius:   data.borderRadius,
                borderSize:     data.borderSize,
            })
        } catch (error) {
            console.error('Ошибка при парсинге JSON:', error)
            return new CommentData()
        }
    }


    /**
     * @param {Object} updates
     * @param {string} [updates.header]
     * @param {string} [updates.text]
     * @param {number} [updates.padding]
     * @param {number} [updates.headerGap]
     * @param {number} [updates.hugContent]
     * @param {string} [updates.bgColor]
     * @param {string} [updates.borderRadius]
     * @param {string} [updates.borderColor]
     * @param {number} [updates.borderSize]
     * @returns {CommentData}
     */
    copyWith(updates = {}) {
        return new CommentData({
            header:         updates.header !== undefined ? updates.header : this.#header,
            text:           updates.text !== undefined ? updates.text : this.#text,
            padding:        updates.padding !== undefined ? updates.padding : this.#padding,
            headerGap:            updates.headerGap !== undefined ? updates.headerGap : this.#headerGap,
            hugContent:      updates.hugContent !== undefined ? updates.hugContent : this.#hugContent,
            bgColor:        updates.bgColor !== undefined ? updates.bgColor : this.#bgColor,
            borderColor:    updates.borderColor !== undefined ? updates.borderColor : this.#borderColor,
            borderRadius:   updates.borderRadius !== undefined ? updates.borderRadius : this.#borderRadius,
            borderSize:     updates.borderSize !== undefined ? updates.borderSize : this.#borderSize,
        })
    }

}


