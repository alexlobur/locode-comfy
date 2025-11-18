

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
    //const effectiveLineHeight = ((metrics.fontBoundingBoxAscent ?? 0) + (metrics.fontBoundingBoxDescent ?? 0))*1.25
    // const effectiveLineHeight = metrics.fontBoundingBoxDescent*lineSpacing
    const lineHeight = metrics.actualBoundingBoxDescent * lineSpacing

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

    return result
}

