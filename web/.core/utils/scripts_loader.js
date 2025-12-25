/**
 *  Загрузчик скриптов (by GPT-5.1)
 * 
 */
class _ScriptsLoader {

    #promises = new Map()
    #loaded = new Set()

    /**
     *  Загрузка скрипта
     * 
     *  @param {string} src - путь к скрипту
     *  @param {{ async: boolean, onLoad: function, onError: function }} options - Опции
     *  @returns {Promise<void>}
     */
    load( src, { async=true, onLoad=null, onError=null }={} ){

        // Уже загружен
        if( this.#loaded.has(src) ){
            onLoad?.()
            return Promise.resolve()
        }

        // Уже загружается
        if( this.#promises.has(src) ){
            const existingPromise = this.#promises.get(src)
            existingPromise.then( () => onLoad?.() ).catch( () => onError?.() )
            return existingPromise
        }

        // Создаем новый промис загрузки
        const promise = new Promise( (resolve, reject) => {

            // Если скрипт уже есть в DOM — подписываемся на события
            const domScript = document.querySelector(`script[src="${src}"]`)
            if(domScript){
                if(domScript.dataset.loaded === 'true' || domScript.readyState === 'complete'){
                    this.#loaded.add(src)
                    onLoad?.()
                    resolve()
                    return
                }
                domScript.addEventListener('load', () => {
                    domScript.dataset.loaded = 'true'
                    this.#loaded.add(src)
                    onLoad?.()
                    resolve()
                }, { once:true })
                domScript.addEventListener('error', () => {
                    onError?.()
                    reject(new Error(`Failed to load script: ${src}`))
                }, { once:true })
                return
            }

            // Подключение скрипта
            const script = document.createElement('script')
            script.src = src
            script.async = async
            script.onload = () => {
                script.dataset.loaded = 'true'
                this.#loaded.add(src)
                onLoad?.()
                resolve()
            }
            script.onerror = () => {
                script.remove()
                onError?.()
                reject(new Error(`Failed to load script: ${src}`))
            }
            document.head.appendChild(script)
        })

        this.#promises.set(src, promise)
        promise.finally( () => this.#promises.delete(src) )

        return promise
    }

}

const ScriptsLoader = new _ScriptsLoader()
export default ScriptsLoader