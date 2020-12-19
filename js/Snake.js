/**
 * @author Francisco Javier González Sabariego
 * 
 * Snake Class:
 * 
 * La clase Serpiente crea una instancia de la serpiente del juego Snake.
 * 
 * Este objeto se encarga de gestionar el movimiento, alimento, dirección y estado (vivo o muerto)
 * de la serpiente, por cada acción que se realiza cada x tiempo.
 */

const Snake = class {
    #body               = [];
    #alive              = true;
    #direction          = 'right';
    #headDirection      = 'right';

    /**
     * Crea una instancia de la clase Serpiente para el juego Snake.
     * 
     * @param {Number} boardGameLength 
     */
    constructor(boardGameLength) {
        this.#createSnakeBody(boardGameLength);
    }

    /**
     * Devuelve si la serpiente está viva.
     * 
     * @return {Boolean} 
     */
    getAlive = function () {
        return this.#alive;
    }

    /**
     * Devuelve el cuerpo de la serpiente en forma de array de coordenadas.
     * 
     * @return {Array} Devuelve el conjunto de coordenadas que conforman el cuerpo de la serpiente 
     */
    getBody = function () {
        return this.#body;
    }

    /**
     * Devuelve la dirección con la que debe renderizarse la cabeza de la serpiente.
     * 
     * @return {String} Dirección para renderizar la cabeza.
     */
    getHeadDirection = function () {
        return this.#headDirection;
    }

    /**
     * Devuelve la dirección con la que debe renderizarse la cola de la serpiente.
     * 
     * @return {String} Dirección para renderizar la cola.
     */
    getTailDirection = function () {
        const [rowTail,colTail]             = [this.#body[this.#body.length - 1][0],this.#body[this.#body.length - 1][1]];
        const [rowBeforeTail,colBeforeTail] = [this.#body[this.#body.length - 2][0],this.#body[this.#body.length - 2][1]];
        if ( this.#checkTailCrossWall(rowBeforeTail - rowTail, colBeforeTail - colTail) ) 
            return rowTail - rowBeforeTail == 0 ? (colTail < colBeforeTail ? "right" : "left") : (rowTail < rowBeforeTail ? "down" : "up");
        return rowTail - rowBeforeTail == 0 ? (colTail > colBeforeTail ? "right" : "left") : (rowTail > rowBeforeTail ? "down" : "up");
    }

    /**
     * Devuelve las coordenadas de la casilla a la que se encamina la serpiente.
     * 
     * @param {Number} boardGameLength Longitud del tablero de juego
     * @return {Array} Devuelve las coordenadas en formato de array [fila,columna];
     */
    getNextSquare = function (boardGameLength) {
        let [row,col] = [this.#body[0][0],this.#body[0][1]];
        row += this.#direction === 'up' ? -1 : this.#direction === 'down' ? 1 : 0;
        col += this.#direction === 'left' ? -1 : this.#direction === 'right' ? 1 : 0;
        return this.#adjustCoordinatesNextSquare([row,col],boardGameLength);
    }

    /**
     * Reasigna la dirección a la que se encamina la serpiente siempre que sea una dirección válida.
     * 
     * @param {String} direction La nueva dirección que se quiera dar a la serpiente.
     */
    setDirection = function (direction) {
        if (!this.#validateDirection(direction)) return;
        this.#direction = direction;
    }

    /**
     * Alimenta a la serpiente.
     * 
     * @param {Array} coordinates Array con las coordenadas de la casilla a la que avanza la serpiente. [fila,columna] 
     */
    eat = function ([row,col]) {
        this.#headDirection = this.#direction;
        this.#body.unshift([row,col]);
    }

    /**
     * Mueve a la serpiente.
     * 
     * @param {Array} coordinates Array con las coordenadas de la casilla a la que avanza la serpiente. [fila,columna] 
     */
    move = function ([row,col]) {
        if (this.#checkSnakeBiteSelf([row,col])) {  //if snake biteself then end game
            this.#alive = false;
            return;
        }
        this.eat([row,col]);
        this.#body.pop();
    }

    /**
     * Comprueba si la serpiente se muerde así misma.
     * 
     * @param {Array} coordinates Array con las coordenadas de la casilla a la que avanza la serpiente. [fila,columna]
     * @return {Boolean}          Resultado de la comprobación. True or false.
     */
    #checkSnakeBiteSelf = function ([row,col]) {
        for (let i = 1; i < this.#body.length - 1; i++)    //Except head and tail
            if (row == this.#body[i][0] && col == this.#body[i][1]) return true;
        return false;
    }

    /**
     * Ajusta las coordendas introducidas según la longitud del tablero.
     * 
     * @param {Array} coordinates       Array con las coordenadas a ajustar. [fila,columna]
     * @param {Number} boardGameLength  Longitud del tablero.
     * @return {Array}                  Coordenadas ajustadas en forma de array. [fila,columna]
     */
    #adjustCoordinatesNextSquare = function ([row,col],boardGameLength) {
        row = row < 0 ? boardGameLength - 1 : row > boardGameLength - 1 ? 0 : row;
        col = col < 0 ? boardGameLength - 1 : col > boardGameLength - 1 ? 0 : col;
        return [row,col];
    }
    
    /**
     * Valida la nueva dirección que se quiere asignar a la serpiente.
     * 
     * @param {String} direction La nueva dirección que se quiere dar a la serpiente.
     * @return {Boolean}         Resultado de la validación. True or false.
     */
    #validateDirection = function (direction) {
        if (this.#direction != this.#headDirection) return false;
        switch (direction) {
            case direction.match(/^(UP|DOWN)$/i)?.input:
                return !(this.#direction === 'down' || this.#direction === 'up');
            case direction.match(/^(LEFT|RIGHT)$/i)?.input:
                return !(this.#direction === 'right' || this.#direction === 'left');
            default:
                return false;
        }
    }

    /**
     * Comprueba si la cola de la serpiente está cruzando los límites del tablero.
     * 
     * @param {Number} rowDiff  Diferencia entre la coordenada fila de la cola y de la sección anterior del cuerpo a la misma
     * @param {Number} colDiff  Diferencia entre la coordenada columna de la cola y de la sección anterior del cuerpo a la misma
     * @return {Boolean}        Resultado de la comprobación si la cola está cruzando el límite del tablero. Ture or false.
     */
    #checkTailCrossWall = (rowDiff,colDiff) => rowDiff > 1 || rowDiff < -1 || colDiff > 1 || colDiff < -1;

    /**
     * Creación del cuerpo de la serpiente.
     * 
     * @param {Number} boardGameLength 
     */
    #createSnakeBody = function (boardGameLength) {  //Pending dinamic creation
        const row  = parseInt((boardGameLength - 1) / 2);
        const col  = parseInt((boardGameLength - 1) / 3);
        this.#body = [[row,col],[row,col - 1],[row,col - 2],[row,col - 3]];
    }
}