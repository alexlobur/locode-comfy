/**
 *  Подключение CSS стилей
 * 
 *  @param {string} pathRel - относительный путь к CSS файлу
 *  @param {?import.meta} importMeta - Пишешь import.meta
 */
export function importCss(pathRel, importMeta=null){
    // Определение пути
    const cssPath = new URL(pathRel, importMeta.url).href
    // если уже грузили - скип
    if(CSS_PATHS.includes(cssPath)) return

    // Подключение
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = cssPath
    document.head.appendChild(link)

    // Добавление в загруженные
    CSS_PATHS.push(cssPath)
}
const CSS_PATHS = []


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


/**
 *  Пишет многострочный текст на канве, учитывая ручные переносы строк.
 *
 *  @param {CanvasRenderingContext2D} ctx   Контекст канвы, в котором будет рисоваться текст.
 *  @param {string} text                    Исходный текст, допускающий переносы `\n`.
 *  @param {number} marginLeft              Координата X первой строки.
 *  @param {number} marginTop               Координата Y первой строки.
 *  @param {number} maxWidth                Максимальная ширина строки.
 *  @param {number|null} lineSpacing        Межстрочный интервал.
 *  @param {boolean} calcOnly               Только посчет без вывода
 *  @returns {{width: number, height: number}}  Итоговая высота и ширина блока текста.
 */
export function wrapCanvasText( ctx, text, maxWidth, { marginLeft=0, marginTop=0, lineSpacing=1.25, calcOnly=false }){

    // Вычисляем высоту строки
    const metrics = ctx.measureText("M")
    const lineHeight = metrics.fontBoundingBoxDescent * lineSpacing

    let cursorY = marginTop
    const result = { width: 0, height: 0 }

    /**
     * Фиксирует текущую строку на канве и смещает курсор на следующую.
     * @param {string} line Строка, которую нужно нарисовать.
     */
    const commitLine = (line) => {
        const m = ctx.measureText(line)
        // обновление результирущих данных
        result.width = Math.max(result.width, m.width)
        result.height = m.actualBoundingBoxDescent + cursorY - marginTop
        if(!calcOnly) ctx.fillText(line, marginLeft, cursorY)
        cursorY += lineHeight
    }

    const paragraphs = String(text ?? "").split(/\r?\n/)
    for (const paragraph of paragraphs){
        let line = ""
        const words = paragraph.trim().split(" ")

        for (const word of words){
            const testLine = line + word
            const testWidth = ctx.measureText(testLine).width

            // Переносим строку на новую линию, если достигли ограничения по ширине.
            if (testWidth > maxWidth && line !== ""){
                commitLine(line)
                line = word + " "
            } else {
                line = testLine + " "
            }
        }
        // Добавляем завершающую строку параграфа (возможно пустую).
        commitLine(line.trimEnd())
    }

    result.height -= metrics.actualBoundingBoxAscent

    return result
}