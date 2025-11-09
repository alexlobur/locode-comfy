import { app } from "../../../scripts/app.js"
import { createElement } from "../.core/utils/dom_utils.js"


/**
 * CommentWidget
 * Виджет для комментария
 */
class CommentWidget {
    constructor(node, inputName, inputData, app) {
        this.node = node
        this.inputName = inputName
        this.inputData = inputData
        this.app = app

        // Устанавливаем цвета узла
        this.node.color = "#4a5568"
        this.node.bgcolor = "#5a6578"

        // Создаем элемент
        this.#createElement()
    }

    #createElement() {
        const textarea = createElement("textarea", {
            classList: ["lo-comment-textarea", "comfy-multiline-input"],
            attributes: {
                placeholder: "Введите комментарий..."
            },
            events: {
                input: () => this.#handleInput()
            }
        })

        this.node.addDOMWidget(this.inputName, "text", textarea, {
            getValue: () => this.getValue(),
            setValue: (value) => this.setValue(value)
        })

        try {
            const saved = this.node?.properties?.comment_text
            if (saved) {
                this.setValue(saved)
            }
        } catch (e) {
            console.warn("LoComment restore on create failed", e)
        }
    }

    #handleInput() {
        const textarea = this.node.widgets?.[this.inputName]?.element
        if (textarea) {
            this.#updateNodeValue(textarea.value)
        }
    }

    #updateNodeValue(value) {
        if (!this.node.properties) this.node.properties = {}
        this.node.properties.comment_text = value
        if (this.node.onResize) this.node.onResize()
    }

    getValue() {
        const textarea = this.node.widgets?.[this.inputName]?.element
        return textarea ? textarea.value : ""
    }

    setValue(value) {
        const textarea = this.node.widgets?.[this.inputName]?.element
        if (textarea) {
            textarea.value = value || ""
            this.#updateNodeValue(value || "")
        }
    }
}


//---
//
// Регистрация через registerCustomNodes
//
app.registerExtension({
    name: "Lo.Comment",
    registerCustomNodes() {
        // Возвращаем определение ноды
        return {
            "LoComment": {
                name: "LoComment",
                display_name: "Lo:Comment",
                category: "locode/helpers",
                description: "Нода для добавления комментариев в workflow. Работает только на фронтенде.",
                input: {},
                output: {}
            }
        }
    },

    // Перехватываем создание узла
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name !== "LoComment") return

        const onNodeCreated = nodeType.prototype.onNodeCreated
        nodeType.prototype.onNodeCreated = function() {
            const ret = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined
            this.__commentWidget = new CommentWidget(this, "comment", {}, app)
            
            try {
                const saved = this?.properties?.comment_text
                if (saved) {
                    this.__commentWidget.setValue(saved)
                }
            } catch (e) {
                console.warn("LoComment restore on create failed", e)
            }
            return ret
        }

        const onSerialize = nodeType.prototype.onSerialize
        nodeType.prototype.onSerialize = function(o) {
            const ret = onSerialize ? onSerialize.apply(this, arguments) : undefined
            try {
                if (!o.properties) o.properties = {}
                const data = this?.__commentWidget?.getValue?.()
                o.properties.comment_text = data
            } catch (e) {
                console.warn("LoComment onSerialize warning", e)
            }
            return ret
        }

        const onConfigure = nodeType.prototype.onConfigure
        nodeType.prototype.onConfigure = function(o) {
            const ret = onConfigure ? onConfigure.apply(this, arguments) : undefined
            try {
                const saved = o?.properties?.comment_text
                if (saved && this.__commentWidget) {
                    this.__commentWidget.setValue(saved)
                }
            } catch (e) {
                console.warn("LoComment onConfigure warning", e)
            }
            return ret
        }
    }
})