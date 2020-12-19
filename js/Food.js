/**
 * @author Francisco Javier González Sabariego
 * 
 * Food Class:
 * 
 * La clase Food crea un elemento comida para el juego Snake:
 * 
 * Puede ser de dos tipos, una comida normal que permanece en el tablero hasta ser comida, 
 * o de tipo especial (de mayor valor) que posee un tiempo de duración y que, de no ser
 * consumida antes de acabar su tiempo, acabará desapareciendo.
 */
class Food {
    static #CLASS_NORMAL_FOOD  = 'square food';
    static #CLASS_SPECIAL_FOOD = 'square special-food';
    #points   = 0;
    #time     = 0;
    #idRender = 0;
    #element  = null;
    #nameThis = '';

    /**
     * Crea un objeto de la clase Food.
     * 
     * @param {Element} element Elemento del árbol DOM en el que está insertado este objeto
     * @param {Number} score    Los puntos que vale este objeto
     * @param {String} nameObj  Nombre dado al atributo en el que está almacenado este objeto
     * @param {Number} time     OPCIONAL: El tiempo en segundos que durará este objeto. 
     *                          Por defecto vale -1, es decir, nunca desaparece por agotar tiempo.
     */
    constructor(element,score,nameObj,time = -1) {
        this.#element  = element;
        this.#points   = score;
        this.#nameThis = nameObj;
        this.#time     = time;
        this.#idRender = this.#render();
    }

    /**
     * Nombre dado al atributo en el que está almacenado este objeto
     * 
     * @return {String} Nombre del atributo en el elemento donde se almacena el objeto food
     */
    getName = function() {
        return this.#nameThis;
    }

    /**
     * El alimento es comido (o eliminado por agotarse su tiempo de existencia)
     */
    eated = function() {
        const points = this.#points;
        let obj = Object.values(this.#element).find( e => e instanceof Food );
        if (obj == undefined ) return;
        clearInterval(this.#idRender);
        this.#element.classList = 'square empty';
        this.#element[obj.getName()] = null;
        return points;
    }

    /**
     * Pausa o reanuda el juego.
     */
    togglePause = function() {
        this.#idRender > 0 ? (this.#pauseRender()) : (this.#idRender = this.#render());
    }

    /**
     * El alimento se renderiza
     */
    #render = function() {
        let food = this;
        return setInterval(
            () => {
                food.#element.classList = food.#time < 0 ? Food.#CLASS_NORMAL_FOOD : Food.#CLASS_SPECIAL_FOOD;
                food.#time = (food.#time -= food.#time > 0 ? 0.1 : 0).toFixed(1);
                if (food.#time == 0) food.eated();
            }, 100);
    }

    /**
     * Pausa el renderizado del alimento
     */
    #pauseRender = function() {
        clearInterval(this.#idRender);
        this.#idRender = 0;
    }
}