import { app } from "../../../scripts/app.js"
import { listToNamedObject } from "../.core/utils/base_utils.js"
import Logger from "../.core/utils/Logger.js"


// Конфиг узла
const NODE_CFG = {
    type:       "LoSetVideoProps",
    font:       "400 11px Arial, sans-serif",
    color:      "#FFFFFF66",
    align:      "left",
    lineHeight: 15,
    pos:        [ 8, 4 ],
}


/**
 * Регистрация расширения
 * 
 * @param {*} nodeType 
 * @param {*} nodeData 
 * @param {*} appInst 
 */
app.registerExtension({
    name: "locode.SetVideoProps",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeType.comfyClass !== NODE_CFG.type) return   // Проверяем, что класс узла соответствует нужному типу

        /**
         *  Переопределение рисования оверлея
         */
        const _onDrawForeground = nodeType.prototype.onDrawForeground
        nodeType.prototype.onDrawForeground = function (ctx) {
            const ret = _onDrawForeground?.apply(this, arguments)

            // Рассчитать размеры видео
            const videoProps = calculate(this)
            if (!videoProps) return

            // Вывести строки оверлея
            drawOverlay(ctx, videoProps)

            return ret
        }

    },
})


//---
//
//  Вспомогательные функции
//
//---


/**
 *  Отрисовка оверлея
 *  @param {CanvasRenderingContext2D} ctx 
 *  @param {Object} videoProps 
 *  @returns 
 */
function drawOverlay(ctx, videoProps){
    ctx.save()
    ctx.font = NODE_CFG.font
    ctx.fillStyle = NODE_CFG.color
    ctx.textAlign = NODE_CFG.align

    // Рассчет количества пикселей
    const pixels = videoProps.width && videoProps.height ? videoProps.width * videoProps.height : null
    const pixelsStr = pixels > 1000000
        ? `${(pixels / 1000000).toFixed(2)}Mpx`
        : pixels > 1000
            ? `${(pixels / 1000).toFixed(1)}Kpx`
            : `${pixels??"?"}px`

    // Текст оверлея
    const text = `
        ${videoProps.width??"?"} x ${videoProps.height??"?"}
        ${pixelsStr}
        duration: ${videoProps.duration??"?"}s
        fps: ${videoProps.fps??"?"}
        frames: ${videoProps.frames??"?"}
    `
    // Разбиение текста на строки
    const lines = text.split("\n").map(line => line.trim())

    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], NODE_CFG.pos[0], NODE_CFG.pos[1] + i * NODE_CFG.lineHeight)
    }

    ctx.restore()
}


/**
 *  Рассчет размеров видео
 *  @param {Object} node 
 *  @returns 
 */
function calculate(node){

    const inputs    = listToNamedObject(node.inputs)
    const widgets   = listToNamedObject(node.widgets)

    const width     = inputs.width.isConnected ? null : Number(widgets.width.value ?? 0)
    const height    = inputs.height.isConnected ? null : Number(widgets.height.value ?? 0)
    const frames    = inputs.frames.isConnected ? null : Number(widgets.frames.value ?? 0)
    const fps       = inputs.fps.isConnected ? null : Number(widgets.fps.value ?? 0)

    // Вычисление финальной длительности
    const duration = frames && fps ? Math.round((frames / fps) * 100) / 100 : null

    // Вернуть результат
    return { width, height, frames, fps, duration }
}

