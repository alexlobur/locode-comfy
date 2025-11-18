/**
 *  Текстовый блок
 */
export class TextData {

    #value
    #color
    #font
    #lineSpacing

    get value() { return this.#value }
    get color() { return this.#color }
    get font() { return this.#font }
    get lineSpacing() { return this.#lineSpacing }

    get isEmpty(){
        return this.#color=="" || this.#font=="" || this.#value==""
    }


    /**---
     * 
     * @param {Object} params - Configuration object
     * @param {string} params.value - The text content
     * @param {string} params.color - Text color in hex format
     * @param {string} params.font - CSS font property
     * @param {number} params.lineSpacing - Line height multiplier
     */
    constructor({ value = '', color = "#666666", font = '400 10px Arial, sans-serif', lineSpacing = 1.5 } = {}) {
        this.#value = value
        this.#color = color.trim()
        this.#font = font.trim()
        this.#lineSpacing = Number(lineSpacing)
    }


    /**
     * @param {Object} updates - Properties to update
     * @param {string} [updates.value] - New text content
     * @param {string} [updates.color] - New text color
     * @param {string} [updates.font] - New font specification
     * @param {number} [updates.lineSpacing] - New line spacing
     * @returns {CommentText} New instance with updated properties
     */
    copyWith(updates = {}) {
        return new CommentText({
            value: updates.value !== undefined ? updates.value : this.#value,
            color: updates.color !== undefined ? updates.color : this.#color,
            font: updates.font !== undefined ? updates.font : this.#font,
            lineSpacing: updates.lineSpacing !== undefined ? updates.lineSpacing : this.#lineSpacing,
        })
    }


    /**
     * Creates a CommentText instance from a JSON object
     * @param {Object} json - JSON representation of CommentText
     * @returns {CommentText} New CommentText instance
     */
    static fromJson(json) {
        return new TextData({
            value: json.value || '',
            color: json.color || "#666666",
            font: json.font || '400 10px Arial, sans-serif',
            lineSpacing: json.lineSpacing || 1.25,
        })
    }


    /**
     * Converts the CommentText instance to a JSON object
     * @returns {Object} JSON representation of the CommentText
     */
    toJson() {
        return {
            value: this.#value,
            color: this.#color,
            font: this.#font,
            lineSpacing: this.#lineSpacing,
        }
    }

}