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


