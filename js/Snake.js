/**
 * @author Francisco Javier González Sabariego
 */

const Snake = class {
    static #MAX_SCORE   = 0;
    static #POINTS_FOOD = 10;
    #score              = 0;
    #paused             = true;
    #idPlay             = 0;
    #boardGame          = [];
    #body               = [];
    #alive              = true;
    #endGame            = false;
    #direction          = 'right';

    constructor(boardGame) {
        const row = parseInt((boardGame.length - 1) / 2);
        const col = parseInt((boardGame.length - 1) / 3);
        this.#boardGame = boardGame;
        this.#body      = [[row,col],[row,col - 1],[row,col - 2],[row,col - 3]];
        this.#renderSnake();  // Unir en un método???
        this.#renderFood();   // Unir en un método???
    }

    static getMaxScore = function () {
        return Snake.#formatScore(Snake.#MAX_SCORE);
    }
    getScore = function () {
        return this.#formatScore(this.#score);
    }
    getPaused = function () {
        return this.#paused;
    }
    getBody = function () {
        return this.#body;
    }
    getDirection = function () {
        return this.#direction;
    }

    setDirection = function (direction) {
        if (!this.#validateDirection(direction)) return;
        if ( this.#checkSnakeBiteSelf(this.#getNextSquare(direction)) ) return;
        this.#direction = direction;
    }

    togglePause = function () {
        if (!this.#alive || this.#endGame) return;
        this.#paused = !this.#paused;
        this.#paused ? (this.#pause()) : (this.#idPlay = this.#play(this));
    }

    #checkSnakeBiteSelf = function ([row,col]) {
        const [tailRow,tailCol] = this.#body[this.#body.length - 1];
        return this.#boardGame[row][col].classList == 'square snake' && !(row === tailRow && col === tailCol);
    }

    #adjustCoordinatesNextSquare = function ([row,col]) {
        row = row < 0 ? this.#boardGame.length - 1 : row > this.#boardGame.length - 1 ? 0 : row;
        col = col < 0 ? this.#boardGame.length - 1 : col > this.#boardGame.length - 1 ? 0 : col;
        return [row,col];
    }

    #getNextSquare = function (direction) {
        let [row,col] = [this.#body[0][0],this.#body[0][1]];
        row += direction === 'up' ? -1 : direction === 'down' ? 1 : 0;
        col += direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
        return this.#adjustCoordinatesNextSquare([row,col]);
    }

    #play = function (ref) { 
        let snake = ref;
        return setInterval( function () {
            const [nextRow,nextCol] = snake.#getNextSquare(snake.#direction);
            if (snake.#checkSnakeBiteSelf([nextRow,nextCol])) {
                snake.#endGame = true;
                snake.#alive   = false;
                snake.#pause();
            }
            else if (snake.#boardGame[nextRow][nextCol].classList == 'square food') snake.#eat([nextRow,nextCol]);
            else snake.#move([nextRow,nextCol]);
        }, 600 - snake.#body.length * 5);
    }

    #pause = () => clearInterval(this.#idPlay);

    #eat = function ([row,col]) {
        let [neckRow,neckCol] = [this.#body[0][0],this.#body[0][1]];
        this.#body.unshift([row,col]);
        this.#boardGame[row][col].classList = `square head ${this.#direction}`;
        this.#boardGame[neckRow][neckCol].classList = `square snake`;
        this.#renderFood();
        this.#score += Snake.#POINTS_FOOD;
        this.#pause();
        this.#idPlay = this.#play(this);
    }

    #move = function ([row,col]) {
        let [tailRow,tailCol] = [0,0];
        this.#body.unshift([row,col]);
        [tailRow,tailCol] = this.#body.pop();
        this.#boardGame[tailRow][tailCol].classList = `square empty`;
        this.#renderSnake();
    }

    #formatScore = score => score < 10 ? `00${score}` : score < 100 ? `0${score}` : score

    #validateDirection = function (direction) {
        switch (direction) {
            case direction.match(/^(UP|DOWN)$/i)?.input:
                return !(this.#direction === 'down' || this.#direction === 'up');
            case direction.match(/^(LEFT|RIGHT)$/i)?.input:
                return !(this.#direction === 'right' || this.#direction === 'left');
            default:
                return false;
        }
    }

    #renderFood = function () {
        let row = undefined;
        let col = undefined;
        do {
            row = parseInt(Math.random() * this.#boardGame.length);
            col = parseInt(Math.random() * this.#boardGame.length);
        } while (this.#boardGame[row][col].classList == 'square snake');
        this.#boardGame[row][col].classList = `square food`;
    }
    #renderSnake = function () {
        this.#body.forEach( (e,i) => i === 0 ? this.#boardGame[e[0]][e[1]].classList = `square head ${this.#direction}` : this.#boardGame[e[0]][e[1]].classList = `square snake`);
    }
}