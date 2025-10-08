/**
 * Класс для утилит Locode
 */
export class LocodeUtils {

/**
 *  Подключение CSS стилей
 * 
 *  @param {string} pathRel - относительный путь к CSS файлу
 *  @param {?import.meta} importMeta - import.meta
 */
    static css(pathRel, importMeta=null){
        console.debug("css", pathRel, importMeta);
        const cssPath = new URL(pathRel, importMeta.url).href;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = cssPath;
        document.head.appendChild(link);
    }


    /**
     * Создание элемента
     * 
     * @param {string} tagName - название тега
     * @param {string} className - класс
     * @param {string} style - стили
     * @param {string} content - текст
     * @param {string} id - id
     * @param {HTMLElement} parent - родительский элемент
     * @param {{ [key: string]: function }} listeners - обработчики событий
     * @param {{ [key: string]: string }} attributes - атрибуты
     * @returns {HTMLElement}
     */
    static createElement( tagName, { className="", style="", id="", content=null, parent=null, listeners={}, attributes={} }={}){
        const element = document.createElement(tagName);
        element.className = className;
        element.id = id;
        element.style.cssText = style;
        // element.textContent = content;
        element.innerHTML = content;

        // Добавляем обработчики событий
        for (const [key, value] of Object.entries(listeners)) {
            element.addEventListener(key, value);
        }

        // Добавляем атрибуты
        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
        }

        // Добавляем родительский элемент
        if (parent) {
            parent.appendChild(element);
        }
        return element;
    }

}
