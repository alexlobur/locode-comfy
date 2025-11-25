
export function setObjectParams(obj, params){
    for (const key in params){
        obj[key] = params[key]
    }
}


/**
 */
export function clamp(val, min, max){
    if (min != null && val < min) return min;
    if (max != null && val > max) return max;
    return val;
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
