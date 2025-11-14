import {importCss} from "./utils/dom_utils.js"

let _inited = false

/**---
 * 
 *  Базовая инициализация
 *  @returns 
 */
export function coreInit(){
    if(_inited) return

    // Подключаем CSS стили
    importCss(".assets/css/styles.css", import.meta)

    _inited = true
}

