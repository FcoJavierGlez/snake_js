/**
 * @author Francisco Javier González Sabariego
 * 
 * SnakeGame Class:
 * 
 * La clase SnakeGame permite crear un objeto encargado del funcionamiento del juego Snake.
 * 
 */

const SnakeGame = class {
    static #POINTS_FOOD         = 5;    //Constant
    static #POINTS_SPECIAL_FOOD = 15;   //Constant
    static #MAX_SCORE           = 0;
    #score     = 0;
    #idPlay    = 0;
    #boardGame = [];
    #snake     = null;

    /**
     * Constructor de la clase SnakeGame
     * 
     * @param {Array} boardGame Array bidimensional del conjunto de elementos del árbol DOm que conforman el tablero de juego
     * @param {Number} maxScore La puntuación máxima acumulada en una cookie en el navegador.
     */
    constructor(boardGame,maxScore) {
        SnakeGame.#MAX_SCORE = maxScore == undefined ? SnakeGame.#MAX_SCORE : maxScore;
        this.#snake     = new Snake(boardGame.length);
        this.#boardGame = boardGame;
        this.#resetBoardGame();
        this.#renderSnake();
        this.#createFood();
    }

    /**
     * Devuelve la puntuación máxima alcanzada en alguna partida.
     * 
     * @param {Boolean} format Opcional: Booleano para solicitar la puntuación formateada '005' ó '5'
     * @return {String}        Puntuación máxima acumulada.
     */
    static getMaxScore = function (format = false) {
        return format ? SnakeGame.#formatScore(SnakeGame.#MAX_SCORE) : SnakeGame.#MAX_SCORE;
    }

    /**
     * Devuelve la puntuación actual.
     * 
     * @param {Boolean} format Opcional: Booleano para solicitar la puntuación formateada '005' ó '5'
     * @return {String}        Puntuación actual.
     */
    getScore = function (format = false) {
        return format ? this.#formatScore(this.#score) : this.#score;
    }

    /**
     * Devuelve si el juego está actualmente pausado.
     * 
     * @return {Boolean} Si el juego está pausado. True or false.
     */
    getPaused = function () {
        return this.#idPlay == 0;
    }

    /**
     * Devuelve el estado del juego: Ganado, perdido o sin finalizar.
     * 
     * @return {String} Estado del juego: Ganado = 'WIN' | Perdido = 'LOSE' | Sin finalizar = ''
     */
    getStatusGame = function () {
        return this.#snake.getBody().length == this.#boardGame.length ** 2 ? 'WIN' : !this.#snake.getAlive() ? 'LOSE' : '';
    }

    /**
     * Asigna la nueva dirección a la que queramos orientar a la serpiente  siempre que el juego esté en marcha.
     * Sólo aceptará las siguientes entradas: 'up','down','left' y 'right'.
     * 
     * @param {String} direction La nueva dirección que queramos asignar a la serpiente.
     *                           Sólo acepta: 'up','down','left' y 'right'.
     */
    setDirection = function (direction) {
        direction = direction.toLowerCase();
        if (this.#idPlay == 0) return;
        if ( !(direction == 'up' || direction == 'down' || direction == 'left' || direction == 'right') ) return;
        this.#snake.setDirection(direction);
    }

    /**
     * Pausa o reanuda el juego.
     */
    togglePause = function () {
        if (this.getStatusGame() !== '') return;
        this.#idPlay == 0 ? (this.#idPlay = this.#play()) : this.#pause();
        this.#togglePauseFoodTimer();
    }

    /**
     * Reinicia el juego una vez terminado.
     */
    resetGame = function() { //Pending
        this.#score    = 0;
        this.#idPlay   = 0;
        this.#snake    = new Snake(this.#boardGame.length);
        this.#resetBoardGame();
        this.#renderSnake();
        this.#createFood();
    }

    /**
     * Pone en marcha el juego.
     */
    #play = function () { 
        let game = this;
        return setInterval( function () {
            const [nextRow,nextCol] = game.#snake.getNextSquare(game.#boardGame.length);
            if (game.#boardGame[nextRow][nextCol].food == null) {
                game.#snake.move([nextRow,nextCol]);
                game.#renderBoardGame();
            }
            else {
                const points = game.#feedSnake([nextRow,nextCol]);
                game.#renderBoardGame();
                if (!(points == SnakeGame.#POINTS_SPECIAL_FOOD)) //if snake hasn't just eaten a special food
                    game.#createFood();
                if (game.#checkCreateSpecialFood()) 
                    game.#createFood(true);
                game.#pause();
                game.#idPlay = game.#play();
            }
            if (game.getStatusGame() != '')
                game.#finishGame();
        }, 600 - game.#snake.getBody().length * 5);
    }

    /**
     * Pausa el juego.
     */
    #pause = function() {
        clearInterval(this.#idPlay);
        this.#idPlay = 0;
    }

    /**
     * Da de comer a la serpiente.
     * 
     * @param {Array} coordinates Inserta las coordenadas de la casilla donde está el alimento.
     * 
     * @return {Number}           La puntuación correspondiente al valor del alimento.
     */
    #feedSnake = function([nextRow,nextCol]) {
        let points = 0;
        this.#score += (points = this.#boardGame[nextRow][nextCol].food.eated()) == undefined ? SnakeGame.#POINTS_SPECIAL_FOOD : points;
        this.#snake.eat([nextRow,nextCol]);
        return points == undefined ? SnakeGame.#POINTS_SPECIAL_FOOD : points;
    }

    /**
     * Comprueba si debe crearse una comida especial.
     * 
     * @return {Boolean} Resultado de la comprobación. True or false.
     */
    #checkCreateSpecialFood = function() {
        return this.#snake.getBody().length % 8 == 0 && this.#snake.getBody().length <= this.#boardGame.length ** 2 - 2
    }

    /**
     * Crea un nuevo alimento en el juego. Éste alimento puede ser especial, 
     * con un temporizador interno y una puntuación mayor del alimento normal.
     * 
     * Por defecto siempre será normal. Para crear un alimento especial 
     * pasar booleano 'true' como parámetro. 
     * 
     * @param {Boolean} special Opcional: Booleano para crear un alimento especial. True = especial, false = normal.
     */
    #createFood = function(special = false) {
        let [row,col] = [undefined,undefined];
        do {
            row = parseInt(Math.random() * this.#boardGame.length);
            col = parseInt(Math.random() * this.#boardGame.length);
        } while (this.#boardGame[row][col].className !== 'square empty');
        this.#boardGame[row][col].food = special ? 
            new Food(this.#boardGame[row][col],SnakeGame.#POINTS_SPECIAL_FOOD,'food',3 + parseFloat( (Math.random() * 3).toFixed(1) )) : 
            new Food(this.#boardGame[row][col],SnakeGame.#POINTS_FOOD,'food');
    }

    /**
     * Pausa los temporaizadores de los alimentos que haya en el tablero.
     */
    #togglePauseFoodTimer = function() {
        for (let i = 0; i < this.#boardGame.length; i++) 
            for (let j = 0; j < this.#boardGame.length; j++) 
                this.#boardGame[i][j].food?.togglePause();
    }

    /**
     * Finaliza el juego.
     */
    #finishGame = function () {
        SnakeGame.#MAX_SCORE = this.#score > SnakeGame.#MAX_SCORE ? this.#score : SnakeGame.#MAX_SCORE;
        this.#pause();
        this.#togglePauseFoodTimer();
    }

    /**
     * Devuelve la puntación pasada como parámetro en formato de 3 dígitos.
     * 
     * @param {Number} score Puntuación a formatear.
     * 
     * @return {String}      Puntuación formateada input: '5' -> output: '005'
     */
    #formatScore = score => score < 10 ? `00${score}` : score < 100 ? `0${score}` : score

    /**
     * Renderiza el tablero de juego.
     */
    #renderBoardGame = function() {
        for (let i = 0; i < this.#boardGame.length; i++) 
            for (let j = 0; j < this.#boardGame.length; j++) {
                if (this.#boardGame[i][j].food != null) continue;
                this.#boardGame[i][j].classList = `square empty`;
            }
        this.#renderSnake();
    }

    /**
     * Renderiza la serpiente dentro del tablero
     */
    #renderSnake = function () {
        this.#snake.getBody().forEach( (e,i) => this.#boardGame[e[0]][e[1]].classList = i == 0 ? `square head ${this.#snake.getHeadDirection()}` : 
            i == this.#snake.getBody().length - 1 ? `square tail ${this.#snake.getTailDirection()}` : `square snake`);
    }

    /**
     * Resetea el tablero de juego.
     */
    #resetBoardGame = function () {
        for (let i = 0; i < this.#boardGame.length; i++) 
            for (let j = 0; j < this.#boardGame.length; j++) {
                this.#boardGame[i][j].food?.eated();
                this.#boardGame[i][j].classList = `square empty`;
            }
    }
}