/***
 *
 *  Класс ChangeNotifier
 *  @copyright LoCode
 *
*/
export class ChangeNotifier {

    /**
     *  Список слушателей
     *  @type {function(Object)[]}
     */
    #listeners = []


    /**
     *  Добавление слушателя
     * 
     *  @param {function(Object)} listener
     */
    addListener(listener){
        this.#listeners.push(listener)
    }


    /**
     *  Удаление слушателя по функции вызова, либо идентификатору
     * 
     *  @param {function} listener
     */
    removeListener( listener ){
        const index = this.#listeners.findIndex( item => item === listener )
        if (index>-1) this.#listeners.splice(index, 1)
    }


    /**
     *  Оповещение слушателей
     * 
     *  @param {{}} eventData — Данные события
     *  @protected
     */
    notifyListeners(eventData){
        for (const listener of this.#listeners) listener?.call(this, eventData)
    }

}

