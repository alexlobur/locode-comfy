/**
 *  Сервис для ведения логов
 */
class _Logger{

    #active = true
    #title = ''
    #titleStyle = ''
    #scope = []

    #inited = false
    get inited (){ return this.#inited }

    /**
     *
     * @param {boolean} [active=true] Активен
     * @param {string} title Начальная часть, аббривеатура.
     * @param {string} titleStyle Стиль CSS. Пример: `background-color: hsla(276, 87%, 49%, 1); color: #FFF; padding: 2px; border-radius: 4px; font-weight: 700; font-size: 10px;`
     * @param {string[]} scope Список типов выводимых логгов, если не задан - будут все.
     */
    init({ active=true, title='', titleStyle='', scope=[] }={}){
        this.#active = active
        this.#title = title
        this.#titleStyle = titleStyle
        this.#scope = scope
        this.#inited = true
    }

    get log() { return this.#getConsoleMethod("log") }
    get warn() { return this.#getConsoleMethod("warn") }
    get error() { return this.#getConsoleMethod("error") }
    get debug() { return this.#getConsoleMethod("debug") }

    get table(){
        if(!this.#allow('table')) return () => {}
        return console.table.bind(console)
    }

    #getConsoleMethod(method) {
        if (!this.#allow(method) || !console[method]) return () => {};
        // Бинд консоли заданного метода
        const prefix = this.#title ? `%c${this.#title}` : ""
        const style = this.#titleStyle || ""
        return console[method].bind(console, prefix, style)
    }

    /**
     *  Проверка возможности вывода
     *  @param {string} type
     */
    #allow(type){
        return ( this.#active && (this.#scope.length===0 || this.#scope.includes(type)) )
    }

}


const Logger = new _Logger()

if(!Logger.inited){
    Logger.init({
        active: true,
        title: "LO",
        titleStyle: "background-color: hsla(276, 87%, 49%, 1); color: #FFF; padding: 2px; border-radius: 4px; font-weight: 700; font-size: 10px;"
    })
}

export default Logger
