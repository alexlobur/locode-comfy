/**
 * Класс для управления событиями Set/Get узлов
 * Реализует паттерн EventEmitter
 */
export class EventEmitter {


	/**
	 * Единое хранилище слушателей событий (включая одноразовые)
	 * Порядок вызова = порядок регистрации
	 * @type {{eventName: (string|null), callback: Function, once: boolean}[]}
	 */
	#listeners = []


	/**
	 * Добавление слушателя
	 * 
	 * @param {?string} eventName
	 * @param {(eventName: (string|null), data: *) => void} callback - Обработчик события, вызывается как (eventName, data)
	 * @param {boolean} once
	 * @returns {Function} функция отписки
	 */
	#addListener(eventName, callback, once){
		if (typeof callback !== 'function') {
			console.warn(`EventEmitter.${once ? "once" : "on"}: callback должен быть функцией для события "${eventName}"`)
			return () => {}
		}
		this.#listeners.push({ eventName, callback, once })
		return () => this.off(eventName, callback)
	}


	/**
	 * Подписка на событие
	 * 
	 * @param {?string} eventName - Имя события (или NULL для всех событий)
	 * @param {(eventName: (string|null), data: *) => void} callback - Обработчик, вызывается как (eventName, data)
	 * @returns {Function} - Функция для отписки
	 */
	on(eventName, callback){
		return this.#addListener(eventName, callback, false)
	}


	/**
	 * Подписка на все события
	 * 
	 * @param {(eventName: string, data: *) => void} callback - Обработчик, вызывается как (eventName, data) для каждого события
	 * @returns {Function} - Функция для отписки
	 */
	onAny(callback){
		return this.#addListener(null, callback, false)
	}


	/**
	 * Подписка на одноразовое событие
	 * 
	 * @param {?string} eventName - Имя события (или NULL для всех событий)
	 * @param {(eventName: (string|null), data: *) => void} callback - Обработчик, вызывается как (eventName, data) один раз
	 * @returns {Function} - Функция для отписки
	 */
	once(eventName, callback){
		return this.#addListener(eventName, callback, true)
	}


	/**
	 * Отписка от события
	 * 
	 * @param {?string} eventName - Имя события или NULL
	 * @param {(eventName: (string|null), data: *) => void} callback - Та же функция, что была передана в on/onAny/once
	 */
	off(eventName, callback){
		// удалить только конкретную функцию
		this.#listeners = this.#listeners.filter(
			l => !(l.eventName === eventName && l.callback === callback)
		)
	}


	/**
	 * Вызов события
	 * 
	 * @param {string} eventName - Имя события
	 * @param {*} data - Данные события
	 */
	emit(eventName, data = null) {
		// Внешний код не должен вызывать событие NULL
		if (!eventName){
			console.warn('EventEmitter.emit: событие NULL зарезервировано для внутренних нужд и не может вызываться напрямую')
			return
		}
		this.#callListeners(eventName, data)
	}


	/**
	 *	Оповещение слушателей
	 */
	#callListeners(eventName, data){
		for (const listener of this.#listeners){
			// поверка слушателя
			if(listener.eventName!==null && listener.eventName !== eventName){
				continue
			}
			// вызов колбэк-функции
			try {
				listener.callback(eventName, data)
			} catch (error) {
				console.error(`${this} ошибка в обработчике события: "${eventName}"`, error)
			}
			// Обнуление разового слушателя
			if (listener.once) listener.callback = null
		}
		// Фильтрация удаленных слушателей
		this.#listeners = this.#listeners.filter( listener => listener.callback!=null )
	}


	/**
	 * Удаление всех слушателей для события
	 * 
	 * @param {string} eventName - Имя события (опционально, если не указано - удаляются все)
	 */
	removeAllListeners(eventName = null){
		if (eventName) {
			this.#listeners = this.#listeners.filter(l => l.eventName !== eventName)
		} else {
			this.#listeners = []
		}
	}


	/**
	 * Получить список всех событий со слушателями
	 * 
	 * @returns {string[]} - Массив имен событий
	 */
	eventNames() {
		return Array.from(
			new Set(this.#listeners.map(l => l.eventName))
		)
	}

}

