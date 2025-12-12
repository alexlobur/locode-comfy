import { app } from "../../../scripts/app.js"
import { loadScript, createElement, haltEvent } from "../.core/utils/dom_utils.js"
import { DocsNodeItem } from "./DocsNodeItem.js"
import { clamp } from "../.core/utils/base_utils.js"


/**---
 *
 *	DocsContentWidget - Кастомный виджет с контентом
 */
export class DocsContentWidget {

	#node
	#md = null
	#dom = {
		parent: null,
		text: null,
		textarea: null,
		articlesMenu: null,
	}

	#articleIndex=0
	#articles = [ new DocsNodeItem( { title: "Untitled", text: "Put your text here..." } ) ]

	get currentArticle() { return this.#articles[this.#articleIndex] }


	/**
	 * Элемент виджета
	 */
	get element() { return this.#dom.parent }


	/**
	 *	@param {LGraphNode} node - Узел
	 *	@param {string} name - Имя виджета
	 */
	constructor(node, name = "content") {
		this.#node = node
		this.#createElement(name)

		// Загружаем markdown-it
		loadScript( new URL("../.core/utils/markdown-it.min.js", import.meta.url).href, {
			onLoad: () => {
				this.#md = window.markdownit({ linkify: true, typographer: true })
				this.setState()
			}
		})

		// Добавляем виджет к узлу
		this.#node.addDOMWidget(name, "STRING", this.#dom.parent, { getValue: this.getValue, setValue: this.setValue })
		this.setState()
	}


	/**
	 *	Обновление состояния виджета
	 */
	setState({ editMode=false, articleIndex=null }={}){
		// Устанавливаем индекс статьи, если он передан
		if(articleIndex != null) this.#articleIndex = articleIndex

		// Приводим индекс статьи к диапазону
		this.#articleIndex = clamp(this.#articleIndex, 0, this.#articles.length - 1)

		// Устанавливаем класс для режима редактирования
		this.#dom.parent.classList.toggle("edit", editMode)

		// Обновляем значение textarea, если оно отличается от текста текущей статьи
		if(this.#dom.textarea.value !== this.currentArticle.text){
			this.#dom.textarea.value = this.currentArticle.text
		}

		// Обновляем текст текстового элемента
		this.#dom.text.innerHTML = this.#md?.render(this.currentArticle.text??"") ?? this.currentArticle.text

		// Обновляем меню статей
		this.#buildArticlesMenu()
	}


	/* ACTIONS */

	addArticle = () => {
		app.extensionManager.dialog.prompt({
			title: "New Article",
			message: "Enter the title of the article",
			defaultValue: "Untitled"
		}).then(result => {
			if(result !== null) {
				this.#articles.push(new DocsNodeItem({ title: result }))
				this.setState({ articleIndex: this.#articles.length - 1 })
			}
		})

	}


	editArticleTitle = (index) => {
		app.extensionManager.dialog.prompt({
			defaultValue: this.#articles[index].title
		}).then(result => {
			if(result !== null) {
				this.#articles[index] = this.#articles[index].copyWith({ title: result })
				this.setState()
			}
		})
	}


	moveArticle = (index, direction) => {
		const newIndex = index + direction
		if(newIndex < 0 || newIndex >= this.#articles.length) return
		const article = this.#articles[index]
		this.#articles[index] = this.#articles[newIndex]
		this.#articles[newIndex] = article
		this.setState()
	}


	deleteArticle = (index) => {
		// Если статья пустая, то удаляем ее
		if(this.#articles[index].text.trim()==""){
			this.#articles.splice(index, 1)
			this.setState()
			return
		}
		// Если статья не пустая, то показываем диалог подтверждения
		app.extensionManager.dialog.confirm({
			title: "Delete Article",
			message: `The article "${this.#articles[index].title}" contains text.\nAre you sure you want to delete it?`,
			type: "delete"
		}).then(result => {
			if(result) {
				this.#articles.splice(index, 1)
				this.setState()
			}
		})
	}


	/* BUILD ELEMENTS */

	/**
	 * Создаем элемент
	 */
	#createElement(name) {

		// Создаем элемент для меню статей
		this.#dom.articlesMenu = createElement("div", {
			classList: ["articles-menu"],
			events: {
				wheel: (event) => {
					event.preventDefault();
					event.stopPropagation();
					app.canvas.processMouseWheel(event)
				},
			}
		})

		// Создаем элемент для markdown текста
		this.#dom.text = createElement("div", {
			classList: [ "text", "locode-markdown", "locode-scrollbar" ],
			events: {
				click: (event) => {
					event.preventDefault()
					event.stopPropagation()
					this.setState({ editMode: true })
					this.#dom.textarea.focus()
				},
			},
		});

		// Создаем элемент для textarea
		this.#dom.textarea = createElement("textarea", {
			events: {
				change: (_) => {
					this.#articles[this.#articleIndex] = this.currentArticle.copyWith({ text: this.#dom.textarea.value })
					this.setState({ editMode: false })
				},
				blur: (_) => this.setState({ editMode: false })
			},
		})

		// Создаем элемент для виджета
		this.#dom.parent = createElement("div", {
			classList: ["lo-docs-content"],
			content: [
				this.#dom.articlesMenu,
				this.#dom.text,
				this.#dom.textarea,
			],
			events: {
				wheel: (event) => {	// Это чтобы работал зум на канвасе при нажатии shift
					if (event.shiftKey) {
						event.preventDefault();
						event.stopPropagation();
						app.canvas.processMouseWheel(event)
					}
				},
			}
		})

	}


	/**
	 *	Построение меню статей
	 */
	#buildArticlesMenu() {

		// Создание элементов меню
		const items = this.#articles.map((article, index) => {
			const item = createElement("div", {
				classList: ["article-item", index === this.#articleIndex ? "active" : ""],
				content: `
					<span class="title">${article.title}</span>
					<span class="actions">
						<i class="pi pi-angle-up" name="up"></i>
						<i class="pi pi-angle-down" name="down"></i>
						<i class="pi pi-times" name="delete"></i>
					</span>
				`,
				events: { click: () => this.setState({ articleIndex: index }) }
			})

			// Обработка событий
			item.querySelector("[name='up']")?.addEventListener("click",		(e) => haltEvent(e, this.moveArticle(index, -1)) )
			item.querySelector("[name='down']")?.addEventListener("click",	(e) => haltEvent(e, this.moveArticle(index, 1)) )
			item.querySelector("[name='delete']")?.addEventListener("click",	(e) => haltEvent(e, this.deleteArticle(index)) )

			return item
		})

		// кнопка добавления статьи
		items.push(
			createElement( "button", {
				classList: ["add", "pi", "pi-plus"],
				events: {
					click: (e) => haltEvent(e, this.addArticle())
				},
			})
		)

		this.#dom.articlesMenu.replaceChildren(
			createElement( "div", {
				classList: [ "current-article" ],
				content: `
					<span>${this.currentArticle.title}</span>
					<i class="pi pi-pencil" name="edit"></i>
					<i class="pi pi-angle-down" name="dropdown"></i>
				`,
				events: {
					click: (e) => haltEvent(e, this.editArticleTitle(this.#articleIndex))
				}
			}),
			createElement( "div", {
				classList: [ "articles-list" ],
				content: items
			}),
		)

	}


	/* WIDGET GET/SET VALUE */

	/**
	 *	Получение значения виджета
	 */
	getValue = () => ({
		articleIndex: this.#articleIndex,
		articles: this.#articles.map(article => article.toJson()),
	})

	/**
	 *	Установка значения виджета
	 */
	setValue = (value) => {
		this.#articleIndex = value?.articleIndex ?? this.#articleIndex
		this.#articles = value?.articles?.map(article => DocsNodeItem.fromJson(article)) ?? this.#articles
		this.setState()
	}

}
