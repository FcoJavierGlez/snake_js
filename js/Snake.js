/**
 * @author Francisco Javier González Sabariego
 */

const Snake = class {
    static #MAX_SCORE   = 0;
    static #POINTS_FOOD = 5;
    #score              = 0;
    #paused             = true;
    #idPlay             = 0;
    #boardGame          = [];
    #body               = [];
    #alive              = true;
    #endGame            = false;
    #direction          = 'right';

    constructor(boardGame) {
        //const row = parseInt((boardGame.length - 1) / 2);
        //const col = parseInt((boardGame.length - 1) / 3);
        //this.#body      = [[row,col],[row,col - 1],[row,col - 2],[row,col - 3]];
        this.#boardGame = boardGame;
        this.#createSnakeBody();
        this.#renderSnake();
        this.#renderFood();
    }

    static getMaxScore = function (format = false) {
        return format ? Snake.#formatScore(Snake.#MAX_SCORE) : Snake.#MAX_SCORE;
    }
    getScore = function (format = false) {
        return format ? this.#formatScore(this.#score) : this.#score;
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
    getAlive = function () {
        return this.#alive;
    }
    getEndGame = function () {
        return this.#endGame;
    }

    setDirection = function (direction) {
        if (!this.#validateDirection(direction)) return;
        this.#direction = direction;
    }

    togglePause = function () {
        if (!this.#alive || this.#endGame) return;
        this.#paused = !this.#paused;
        this.#paused ? (this.#pause()) : (this.#idPlay = this.#play(this));
    }

    resetGame = function() {
        this.#score              = 0;
        this.#idPlay             = 0;
        this.#paused             = true;
        this.#alive              = true;
        this.#endGame            = false;
        this.#direction          = 'right';
        this.#createSnakeBody();
        this.#resetBoardGame();
        this.#renderSnake();
        this.#renderFood();
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
            if (snake.#checkSnakeBiteSelf([nextRow,nextCol])) 
                snake.#finishGame(true);
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
        this.#score += Snake.#POINTS_FOOD;
        if ( this.#body.length === this.#boardGame.length ** 2) {
            this.#finishGame(false);
            return;
        }
        this.#renderFood();
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

    #finishGame = function (dead = false) {
        this.#endGame    = true;
        Snake.#MAX_SCORE = this.#score > Snake.#MAX_SCORE ? this.#score : Snake.#MAX_SCORE;
        this.#pause();
        if (dead) this.#alive = false;
    }

    #formatScore = score => score < 10 ? `00${score}` : score < 100 ? `0${score}` : score

    #validateDirection = function (direction) {
        const headDirection = this.#boardGame[this.#body[0][0]][this.#body[0][1]].classList.value.match(/^square head(\s(\w+)?)$/)?.[2];
        if (this.#direction != headDirection) return false;
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
        let nameClass = '';
        do {
            row = parseInt(Math.random() * this.#boardGame.length);
            col = parseInt(Math.random() * this.#boardGame.length);
        } while ((nameClass = this.#boardGame[row][col].classList.value) == nameClass.match(/^square (snake|head)/)?.input);
        this.#boardGame[row][col].classList = `square food`;
    }
    #renderSnake = function () {
        this.#body.forEach( (e,i) => this.#boardGame[e[0]][e[1]].classList = i === 0 ? `square head ${this.#direction}` : `square snake`);
    }

    #resetBoardGame = function () {
        for (let i = 0; i < this.#boardGame.length; i++) 
            for (let j = 0; j < this.#boardGame.length; j++) 
                this.#boardGame[i][j].classList = `square empty`;
    }

    #createSnakeBody = function () {
        const row  = parseInt((this.#boardGame.length - 1) / 2);
        const col  = parseInt((this.#boardGame.length - 1) / 3);
        this.#body = [[row,col],[row,col - 1],[row,col - 2],[row,col - 3]];
    }
}