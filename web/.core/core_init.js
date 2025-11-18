import {importCss} from "./utils/dom_utils.js"
import Logger from "./utils/Logger.js"

let _inited = false

/**---
 * 
 *  Базовая инициализация
 *  @returns 
 */
export default function coreInit(){
    if(_inited) return

    // Подключаем CSS стили
    importCss(".assets/css/styles.css", import.meta)

    _inited = true
    Logger.debug("Locode: coreInited")

}
