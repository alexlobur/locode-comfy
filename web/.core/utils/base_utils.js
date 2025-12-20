/**
 *  Создает уникальное имя на основе списка имен
 *  
 *  @param {String} name - начальное имя
 *  @param {String[]} names - список имен
 *  @param {?String} pattern - паттерн вида: "{name}{index}"
 *  @param {?int} excludeIndex - исключить этот индекс из списка
 */
export function makeUniqueName( name, names, { pattern="{name}_{index}", excludeIndex=null }={}){
    if(excludeIndex!=null) names.splice(excludeIndex, 1)

    let index=1
    let newName = name
    const maxIndex = 999

    while (names.includes(newName)){
        newName = pattern
            .replace("{name}", name)
            .replace("{index}", index)
        index++
        if(index>maxIndex) throw new Error("Max Index Exceeded!");
    }
    return newName
}


/**
 *  Устанавливает параметры объекта
 *  @param {*} obj 
 *  @param {*} params 
 */
export function setObjectParams(obj, params){
    for (const key in params){
        obj[key] = params[key]
    }
}


/**
 * Обрезка значения до границ
 */
export function clamp(val, min, max){
    if (min != null && val < min) return min
    if (max != null && val > max) return max
    return val
}


/**
 *  Создает уникальный UID
 *  @param {Number} length 
 */
export function genUid(length = 8){
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let uid = ""
    for (let i = 0; i < length; i++){
        const index = Math.floor(Math.random() * chars.length)
        uid += chars[index]
    }
    return uid
}


/**
 *  Принимает список объектов, у который есть параметр `name`,
 *  Возвращает именованный объект с ключами из `name`
 *  
 *  @param {*[]} namedList
 */
export function listToNamedObject( namedList ){
    const resut = {}
    for (const item of namedList){
        resut[item.name] = item
    }
    return resut
}


/**
 *  Наблюдение за свойством объекта.
 *  
 *  - Определяет свойство как геттер/сеттер.
 *  - Вешает слушатель на изменения.
 *
 *  @param {object} object - объект
 *  @param {string} property - имя свойства для наблюдения
 *  @param {function(prevValue: any, newValue: any)=>any} beforeSet - функция для обработки перед установкой значения
 *  @param {function(value: any)=>void} onChanged - функция для обработки изменений
 *  @param {string} propertyStorageName - имя свойства для хранения значения (по умолчанию `_${property}`)
 *  @returns {object}
 */
export function watchProperty(object, property, { propertyStorageName=null, beforeSet, onChanged }={}){

    // имя свойства для хранения значения
    propertyStorageName = propertyStorageName??`_${property}`

    // если свойство уже наблюдается, то выходим
    if(object[propertyStorageName]) return object

    // сохраняем предыдущее значение
    object[propertyStorageName] = object[property]

    // определяем свойство как геттер/сеттер
    Object.defineProperty( object, property, {
        // сеттер
        set(value){
            object[propertyStorageName] = beforeSet!==undefined ? beforeSet(object[propertyStorageName], value) : value
            onChanged?.(value)
        },
        // геттер
        get(){
            return object[propertyStorageName]
        }
    })
    return object
}
