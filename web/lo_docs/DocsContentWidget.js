import { app } from "../../../scripts/app.js"
import { createElement, haltEvent } from "../.core/utils/dom_utils.js"
import { DocsNodeItem } from "./DocsNodeItem.js"


/**---
 *
 *	DocsContentWidget - Кастомный виджет с контентом
 */
export class DocsContentWidget {

	#node
	#dom = {
		parent: null,
		text: null,
		textarea: null,
		pagesMenu: null,
	}

	#pageIndex
	#pages = [ new DocsNodeItem() ]

	get currentPage() { return this.#pages[this.#pageIndex] }


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

		// Добавляем виджет к узлу
		this.#node.addDOMWidget(name, "STRING", this.#dom.parent, { getValue: this.getValue, setValue: this.setValue })
	}


	/**
	 *	Обновление состояния виджета
	 */
	setState({ editMode=false, pageIndex=null }={}){
		// Устанавливаем индекс страницы, если он передан
		if(pageIndex != null) this.#pageIndex = pageIndex

		// Устанавливаем класс для режима редактирования
		this.#dom.parent.classList.toggle("edit", editMode)

		// Обновляем значение textarea, если оно отличается от текста текущей страницы
		if(this.#dom.textarea.value !== this.currentPage.text){
			this.#dom.textarea.value = this.currentPage.text
		}

		// Обновляем текст текстового элемента
		this.#dom.text.textContent = this.currentPage.text

		// Обновляем меню страниц
		this.#buildPagesMenu()
	}


	/* ACTIONS */

	editPageTitle = (index) => {
	}

	movePage = (index, direction) => {
	}

	deletePage = (index) => {
	}


	/* BUILD ELEMENTS */

	/**
	 * Создаем элемент
	 */
	#createElement(name) {

		// Создаем элемент для меню страниц
		this.#dom.pagesMenu = createElement("div", {
			classList: ["pages-menu"],
			events: {
				wheel: (event) => {
					event.preventDefault();
					event.stopPropagation();
					app.canvas.processMouseWheel(event)
				},
			}
		})

		// Создаем элемент для текста
		this.#dom.text = createElement("div", {
			classList: ["text"],
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
					this.#pages[this.#pageIndex] = this.currentPage.copyWith({ text: this.#dom.textarea.value })
					this.setState({ editMode: false })
				},
				blur: (_) => this.setState({ editMode: false })
			},
		})

		// Создаем элемент для виджета
		this.#dom.parent = createElement("div", {
			classList: ["lo-docs-content"],
			content: [
				this.#dom.pagesMenu,
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
	 *	Построение меню страниц
	 */
	#buildPagesMenu() {

		// Создание элементов меню
		const items = this.#pages.map((page, index) => {
			const item = createElement("div", {
				classList: ["page-item", index === this.#pageIndex ? "active" : ""],
				content: `
					<span class="title">${page.title}</span>
					<span class="actions">
						<i class="actions-hover pi pi-ellipsis-v"></i>
						<div class="actions-menu">
							<i class="pi pi-pencil" name="edit"></i>
							<i class="pi pi-angle-up" name="up"></i>
							<i class="pi pi-angle-down" name="down"></i>
							<i class="pi pi-times" name="delete"></i>
						</div>
					</span>
				`,
				events: { click: () => this.setState({ pageIndex: index }) }
			})

			// Обработка событий
			item.querySelector("[name='edit']").addEventListener("click",	(e) => haltEvent(e, this.editPageTitle(index)) )
			item.querySelector("[name='up']").addEventListener("click",		(e) => haltEvent(e, this.movePage(index, -1)) )
			item.querySelector("[name='down']").addEventListener("click",	(e) => haltEvent(e, this.movePage(index, 1)) )
			item.querySelector("[name='delete']").addEventListener("click",	(e) => haltEvent(e, this.deletePage(index)) )

			return item
		})

		// добавление кнопки добавить
		items.push(
			createElement( "button", {
				classList: ["add", "pi", "pi-plus"],
				events: {
					click: () => {
						this.#pages.push(new DocsNodeItem())
						this.setState({ pageIndex: this.#pages.length - 1 })
					},
				},
			})
		)
		this.#dom.pagesMenu.replaceChildren(...items)
	}


	/* WIDGET GET/SET VALUE */

	/**
	 *	Получение значения виджета
	 */
	getValue = () => ({
		pageIndex: this.#pageIndex,
		pages: this.#pages.map(page => page.toJson()),
	})

	/**
	 *	Установка значения виджета
	 */
	setValue = (value) => {
		this.#pageIndex = value?.pageIndex ?? this.#pageIndex
		this.#pages = value?.pages?.map(page => DocsNodeItem.fromJson(page)) ?? this.#pages
		this.setState()
	}

}
