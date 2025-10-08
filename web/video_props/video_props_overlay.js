import { app } from "../../../scripts/app.js";


// Простая функция вычисления кадров и финальной длительности, дублирующая логику бэкенда
function computeFrames(duration, fps) {
    const frames = 1 + Math.ceil((duration * fps) / 4) * 4;
    const durationFinal = Math.round((frames / fps) * 100) / 100;
    return { frames, durationFinal };
}

// Безопасное чтение значения из виджета по имени
function getWidgetValueByName(node, name, def = null) {
    try {
        const w = node.widgets?.find?.(w => w.name === name);
        return w?.value ?? def;
    } catch (e) {
        return def;
    }
}

// Рендер текста со стилями
function drawText(ctx, text, x, y, opts = {}) {
    const { color = "#9aa0a6", font = "12px sans-serif", align = "left" } = opts;
    ctx.save();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
    ctx.restore();
}

app.registerExtension({
    name: "LoSetVideoPropsOverlay",
    async beforeRegisterNodeDef(nodeType, nodeData, appInst) {
        if (nodeData.name !== "LoSetVideoProps") return;

        const originalOnDrawForeground = nodeType.prototype.onDrawForeground;
        nodeType.prototype.onDrawForeground = function (ctx) {
            // Вызов оригинала, если был
            if (originalOnDrawForeground) originalOnDrawForeground.apply(this, arguments);

            // Считываем значения из виджетов
            const width = Number(getWidgetValueByName(this, "width", 0)) || 0;
            const height = Number(getWidgetValueByName(this, "height", 0)) || 0;
            const duration = Number(getWidgetValueByName(this, "duration", 0)) || 0;
            const fps = Number(getWidgetValueByName(this, "fps", 0)) || 0;

            // Проверка валидности значений
            if (width <= 0 || height <= 0 || duration <= 0 || fps <= 0) return;

            const { frames, durationFinal } = computeFrames(duration, fps);

            // Формируем строки
            const lines = [
                `size: ${width}×${height}`,
                `duration: ${duration}s`,
                `fps: ${fps}`,
                `frames: ${frames} → ${durationFinal}s`,
            ];

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


