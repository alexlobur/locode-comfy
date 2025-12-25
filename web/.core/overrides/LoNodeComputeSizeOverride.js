/**
 *  Переопределение размера узла
 */
export class LoNodeComputeSizeOverride {

    /**
     *  Переопределение расчета минимального размера узла
     *  
     *  при наличии виджета ширина должна учитывать коэффициент 1.5
     * 
     *  @param {LGraphNode} proto
     *  @param {number|undefined} minWidth
     *      Минимальная ширина. Если не указано, то переопределение не производится
     *  @param {boolean} overrideWidth
     *      Если true, ширина заменяется на указанное значение,
     *      иначе указывается как минимальная перед рассчетом
     *  @returns {void}
     */
    override(proto, { minWidth=undefined, overrideWidth=false}={}){

        // если не указана минимальная ширина, то переопределение не производится
        if(!minWidth) return

        const NODE_WIDTH = LiteGraph.NODE_WIDTH
        const _computeSize = proto.computeSize

        proto.computeSize = function(){
            // ставим минимальную ширину узла
            if(!overrideWidth) LiteGraph.NODE_WIDTH = minWidth

            // вызываем оригинальный метод расчета размера
            const ret = _computeSize?.apply(this, arguments)

            // возвращаем минимальную ширину узла
            LiteGraph.NODE_WIDTH = NODE_WIDTH

            // переопределяем ширину узла
            if(overrideWidth) ret[0] = minWidth

            // возвращаем результат
            return ret
        }
    }

}