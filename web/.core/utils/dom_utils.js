/**
 *  Подключение CSS стилей
 * 
 *  @param {string} pathRel - относительный путь к CSS файлу
 *  @param {?import.meta} importMeta - Пишешь import.meta
 */
export function importCss(pathRel, importMeta=null){
    const cssPath = new URL(pathRel, importMeta.url).href
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = cssPath
    document.head.appendChild(link)
}


/**
 * Create a new element
 * 
 * @param {string} tagName - The tag name of the element
 * @param {Element} parent - The parent of the element
 * @param {[key: string]: string} styles - The styles of the element
 * @param {string?[]} classList - The class list of the element
 * @param {{ [key: string]: string }} attributes - The attributes of the element
 * @param {{ [key: string]: function }} events - Объект вида событие -> обработчик
 * @param {string|string[]|Node|Node[]|Element|Element[]} content - The content of the element
 * @returns {Element} - The new element
 */
export function createElement(tagName, { parent, styles={}, classList=[], attributes={}, content='', events={} }={}){

    // Create the element
    const element = document.createElement(tagName)

    // Add the attributes
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value)

    // Add the class list
    for (const className of classList){
        if(className) element.classList.add(className)
    } 

    // Добавление контента
    content = Array.isArray(content) ? content : [content]
    for (const item of content){
        if( typeof item == "string" ){
            element.insertAdjacentHTML('beforeend', item)
        } else {
            element.append(item)
        }
    }

    // Add the styles
    for (const [key, value] of Object.entries(styles)) element.style[key] = value

    // События
    for (const [key, value] of Object.entries(events)) element.addEventListener( key, value )

        // Add the parent
    if (parent) {
        parent.appendChild(element)
    }

    return element
}


/**
 *  Вешает обработку перетаскивания
 * 
 *  @param {Element} element
 *  @param {function(Element, Event)} onDragStart
 *  @param {function(Element, Event)} onDragMove
 *  @param {function(Element, Event)} onDragEnd
 *  @returns {Element}
 */
export function makeDraggable({ element, onDragStart, onDragMove, onDragEnd, dragDelay=300 }){
    let isDragged = false

    const startDrag = (e)=>{
        isDragged = true
        document.addEventListener("pointermove", moveDrag )
        document.addEventListener('pointerup', endDrag )
        document.addEventListener('pointercancel', endDrag )

        setTimeout(()=>{
            if(!isDragged) return
            onDragStart?.(element, e)
        }, dragDelay)
    }

    const endDrag = (e)=>{
        isDragged = false
        document.removeEventListener("pointermove", moveDrag )
        document.removeEventListener('pointerup', endDrag )
        document.removeEventListener('pointercancel', endDrag )
        onDragEnd?.(element, e)
    }

    const moveDrag = (e)=>{
        onDragMove?.(element, e)
    }

    element.addEventListener("pointerdown", startDrag )

    return element
}


/**
*   Фиксирование ширины тела страницы с учетом полосы прокрутки
*   @param {boolean} fix
*/
export function modalBodyFix(fix = true){
    if(!fix){ // восстановление
        document.body.style.width = ""
        document.body.style.overflow = ""
        return
    }
    const dw = window.innerWidth - document.body.getBoundingClientRect().width
    document.body.style.width = "calc( 100vw - "+dw+"px )"
    document.body.style.overflow = "hidden"
}


/**
 *  Запускает таймер интервал с прогрессом
 *  
 *  @param {Number} duration - продолжительность
 *  @param {Number} durationTick - частота обновления прогресса
 *  @param {function(Number)} onProgress
 *  @param onDone
 *  @private
 */
export function runTimer({ duration, onProgress, onDone, durationTick = 5 }){
    const startTime = Date.now()
    onProgress?.(0)
    // Интервал
    const intervalID = setInterval( ()=>{
        const progress = (Date.now() - startTime)/duration
        onProgress?.(progress > 1 ? 1 : progress)
        if(progress >=1){
            clearInterval(intervalID)
            onDone?.()
        }
    }, durationTick )
}



/**
 *  Блокирует дальнейшее распростанения события
 */
export function haltEvent(e, fn=null){
    e.stopPropagation()
    e.preventDefault()
    fn?.()
}
