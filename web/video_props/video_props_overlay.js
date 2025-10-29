import { app } from "../../../scripts/app.js";



/**
 * Регистрация расширения
 * 
 * @param {*} nodeType 
 * @param {*} nodeData 
 * @param {*} appInst 
 */
app.registerExtension({
    name: "LoSetVideoPropsOverlay",
    async beforeRegisterNodeDef(nodeType, nodeData, appInst) {

        // Проверяем, что имя узла соответствует нужному типу
        if (nodeData.name !== "LoSetVideoProps") return;
        
        // Сохраняем оригинальные методы
        const originalOnDrawForeground = nodeType.prototype.onDrawForeground;
        const originalOnExecuted = nodeType.prototype.onExecuted;

        // Пересчёт и сохранение данных оверлея из текущих значений виджетов
        function updateOverlayFromWidgets() {
            const width = Number(getWidgetValueByName(this, "width", 0)) || 0;
            const height = Number(getWidgetValueByName(this, "height", 0)) || 0;
            const duration = Number(getWidgetValueByName(this, "duration", 0)) || 0;
            const fps = Number(getWidgetValueByName(this, "fps", 0)) || 0;
            if (width > 0 && height > 0 && duration > 0 && fps > 0) {
                this.__lo_overlayLines = buildOverlayLines(width, height, duration, fps);
            } else {
                this.__lo_overlayLines = null;
            }
        }

        //---
        // Вызывается после выполнения узла: обновляем оверлей по пришедшим параметрам и перерисовываем
        nodeType.prototype.onExecuted = function () {
            // DEBUG
            console.debug("onExecuted", this, arguments);

            try {
                updateOverlayFromWidgets.call(this);
                this.setDirtyCanvas(true, true);
            } catch (e) {
                //
            }
            if (originalOnExecuted) return originalOnExecuted.apply(this, arguments);
        };

        //---
        // Вызывается перед рисованием оверлея
        nodeType.prototype.onDrawForeground = function (ctx) {

            // Вызов оригинала, если был
            if (originalOnDrawForeground) originalOnDrawForeground.apply(this, arguments);

            // Если уже есть рассчитанные строки (например, после onExecuted) — используем их
            let lines = this.__lo_overlayLines;
            // Иначе, пробуем посчитать из текущих значений виджетов (живой предпросмотр)
            if (!lines) {
                const width = Number(getWidgetValueByName(this, "width", 0)) || 0;
                const height = Number(getWidgetValueByName(this, "height", 0)) || 0;
                const duration = Number(getWidgetValueByName(this, "duration", 0)) || 0;
                const fps = Number(getWidgetValueByName(this, "fps", 0)) || 0;
                if (width > 0 && height > 0 && duration > 0 && fps > 0) {
                    lines = buildOverlayLines(width, height, duration, fps);
                }
            }

            if (!lines) return;

            // Позиционирование: рисуем у нижнего края, с отступами
            const padding = 8;
            const lineHeight = 15;
            const x = padding;
            const y = padding*2.5;

            // Текст (правое выравнивание в подложке)
            for (let i = 0; i < lines.length; i++) {
                drawText(ctx, lines[i], x, y + i * lineHeight, { align: "left" });
            }

        };

    },
});



//---
//
//  Вспомогательные функции
//
//---


/**
 * Вычислить количество кадров и финальную длительность
 * @param {*} duration 
 * @param {*} fps 
 * @returns 
 */
function computeFrames(duration, fps) {
    const frames = 1 + Math.ceil((duration * fps) / 4) * 4;
    const durationFinal = Math.round((frames / fps) * 100) / 100;
    return { frames, durationFinal };
}


/**
 * Безопасное чтение значения из виджета по имени
 * @param {*} node 
 * @param {*} name 
 * @param {*} def 
 * @returns 
 */
function getWidgetValueByName(node, name, def = null) {
    console.debug(node, name, def);
    try {
        const w = node.widgets?.find?.(w => w.name === name);
        return w?.value ?? def;
    } catch (e) {
        return def;
    }
}


/**
 * Рендер текста со стилями
 * @param {*} ctx 
 * @param {*} text 
 * @param {*} x 
 * @param {*} y 
 * @param {*} opts 
 */
function drawText(ctx, text, x, y, opts = {}) {
    const { color = "#9aa0a6", font = "12px sans-serif", align = "left" } = opts;
    ctx.save();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
    ctx.restore();
}


/**
 * Построить строки оверлея из числовых значений
 * @param {*} width 
 * @param {*} height 
 * @param {*} duration 
 * @param {*} fps 
 * @returns 
 */
function buildOverlayLines(width, height, duration, fps) {
    const pixels = width * height;
    const { frames, durationFinal } = computeFrames(duration, fps);
    const pixelsStr = pixels > 1000 * 1000 ? `${(pixels / 1000 / 1000).toFixed(2)}Mpx` : `${pixels}px`;
    return [
        `size: ${width}x${height} ${pixelsStr}`,
        `duration: ${duration}s`,
        `fps: ${fps}`,
        `frames: ${frames} → ${durationFinal}s`,
    ];
}

