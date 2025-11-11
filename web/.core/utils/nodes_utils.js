

/**
 *  Принимает список объектов, у который есть параметр `name`,
 *  Возвращает именованный объект.
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


/**
 *  Пишет многострочный текст на Канве
 * 
 *  @param {*} ctx 
 *  @param {*} text 
 *  @param {*} marginLeft 
 *  @param {*} marginTop 
 *  @param {*} maxWidth 
 *  @param {*} lineHeight 
 */
export function wrapText(ctx, text, marginLeft, marginTop, maxWidth, lineHeight){
    var words = text.split(" ")
    var countWords = words.length
    var line = ""
    for (var n = 0; n < countWords; n++) {
        var testLine = line + words[n] + " "
        var testWidth = ctx.measureText(testLine).width
        if (testWidth > maxWidth) {
            ctx.fillText(line, marginLeft, marginTop)
            line = words[n] + " "
            marginTop += lineHeight
        }
        else {
            line = testLine
        }
    }
    ctx.fillText(line, marginLeft, marginTop)
}