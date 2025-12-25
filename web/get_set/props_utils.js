
/**
 *  Утилиты для работы с свойствами узлов
 *  TODO: Перенести методы сюда
 */
export const PropsUtils = Object.freeze({


    /**
     *	Обновление выходов на основе узла-сеттера
    * 
    *  @param {LGraphNode} node - узел для обновления
    *  @param {LGraphNode} referNode - узел-сеттер
    *  @param {boolean} fitSize - обновлять размер узла
    *  @param {string[]} propertiesScope - свойства, которые нужно обновить
    *  @param {(output, input, index)=>void} onOutputUpdated - callback для обработки обновления выхода
    *  @returns {LGraphNode} - узел после обновления
    */
    updateOutputsFromRefer: (node, referNode, {
        fitSize=false,
        propertiesScope=['name', 'localized_name', 'label', 'type'],
        onOutputUpdated=null,
        ouputStartIndex=0,
    }={}) => {
        // если сеттера нет, то не обновляем выходы
        if(!referNode) return

        // получение активных инпутов сеттера
        const setterInputs = PropsUtils.getSetterActiveInputs(referNode)

        // обновление выходов на основе активных инпутов сеттера
        for (let inputIndex = 0; inputIndex < setterInputs.length; inputIndex++){

            // получение инпута, входа и индекса выхода
            const input = setterInputs[inputIndex]
            const outputIndex = ouputStartIndex + inputIndex
            const output = !node.outputs[outputIndex]
                ? node.addOutput(`out_${outputIndex}`, input.type)
                : node.outputs[outputIndex]

            // обновление свойств выхода
            propertiesScope.forEach(property => output[property] = input[property])

            // вызов callback
            onOutputUpdated?.call(node, output, input, outputIndex)
        }

        // удаление выходов, которые выходят за границы
        while(node.outputs[setterInputs.length+ouputStartIndex]!=null){
            node.removeOutput(setterInputs.length+ouputStartIndex)
        }

        // обновление размера узла
        if(fitSize) node.setSize(node.computeSize())

        // возвращение узла
        return node
    },


    /**
     *	Выдает список инпутов рефера
     *
     *  - Если заморожены, то возвращаем все инпуты
     *  - Если не заморожены, то возвращаем инпуты без последнего
     *  @param {LGraphNode} setterNode - узел-сеттер
     *  @returns {INodeInputSlot[]} - список инпутов рефера
    */
    getSetterActiveInputs: (setterNode) => {
        if(!setterNode) return []

        // Если заморожены, то возвращаем все инпуты
        if(setterNode.frozen) return setterNode.inputs

        // Только один инпут
        if(setterNode.inputs.length<=1) return []

        // Возвращаем инпуты без последнего
        return setterNode.inputs.slice(0, setterNode.inputs.length-1)
    },


    /**
     *  Рисование индикатора заморозки
     */
    drawFrozenIndicator: (ctx, { centerPos=[0,0], sideHeight=12, sideWidth=2.5, fillColor="#FFFFFF99" }={}) => {
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

    },


    /**
     *  Расчет ширины текста слота
     */
    computeSlotTextWidth: (text, fontStyle) => {
        return LGraphCanvas._measureText?.(text, fontStyle) ?? LiteGraph.NODE_TEXT_SIZE * (text?.length ?? 0) * 0.6
    }

})


