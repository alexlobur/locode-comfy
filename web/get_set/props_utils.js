

/**
 *  Рисование индикатора заморозки
 */
export function drawFrozenIndicator(ctx, { centerPos=[0,0], sideHeight=12, sideWidth=2.5, fillColor="#FFFFFF99" }={}){
    ctx.save()

    // Углы поворота для 6-конечной звезды (0°, 60°, 120°)
    const angles = [0, 60, 120]
    
    // Начинаем один путь для всех вершин
    ctx.beginPath()
    
    // Добавляем все вершины в один путь
    angles.forEach(angle => {
        const angleRad = (angle * Math.PI) / 180
        const cos = Math.cos(angleRad)
        const sin = Math.sin(angleRad)
        
        // Координаты вершин до поворота (относительно центра)
        const vertices = [
            [-sideWidth/2, -sideHeight/2],
            [sideWidth/2, -sideHeight/2],
            [sideWidth/2, sideHeight/2],
            [-sideWidth/2, sideHeight/2]
        ]
        
        // Поворачиваем и перемещаем каждую вершину
        vertices.forEach(([x, y], i) => {
            // Применяем поворот
            const rotatedX = x * cos - y * sin
            const rotatedY = x * sin + y * cos
            
            // Перемещаем в центр
            const finalX = centerPos[0] + rotatedX
            const finalY = centerPos[1] + rotatedY
            
            if (i === 0) {
                ctx.moveTo(finalX, finalY)
            } else {
                ctx.lineTo(finalX, finalY)
            }
        })
        
        // Замыкаем прямоугольник
        ctx.closePath()
    })
    
    // Заливаем весь путь
    ctx.fillStyle = fillColor
    ctx.fill()
    ctx.restore()

}


/**
 *	Выдает список инпутов рефера, без учета последнего
 */
export function getSetterActiveInputs(setterNode){
    if(!setterNode) return []

    // Если заморожены, то возвращаем все инпуты
    if(setterNode.frozen){
        return setterNode.inputs
    }

    // Только один инпут
    if(setterNode.inputs.length<=1) return []

    // Возвращаем инпуты без последнего
    return setterNode.inputs.slice(0, setterNode.inputs.length-1)
}
