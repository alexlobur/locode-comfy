/**
 *  Подключение CSS стилей
 * 
 *  @param {string} pathRel - относительный путь к CSS файлу
 *  @param {?import.meta} importMeta - import.meta
 */
export function importCss(pathRel, importMeta=null){
    console.debug("css", pathRel, importMeta);
    const cssPath = new URL(pathRel, importMeta.url).href;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = cssPath;
    document.head.appendChild(link);
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
