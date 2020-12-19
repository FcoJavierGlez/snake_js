/**
 * 
 * 
 * @author Francisco Javier González Sabariego
 */
{
    const BOARDGAME_LENGTH = 10;

    const normalizeCodeKey = codeKey => codeKey.match(/^Arrow(Up|Down|Left|Right)$/i)?.[1].toLowerCase();

    const createBoardGame = () => {
        const fragment = new DocumentFragment();
        let boardGame  = [];
        for (let i = 0; i < BOARDGAME_LENGTH; i++) {
            boardGame.push([]);
            for (let j = 0; j < BOARDGAME_LENGTH; j++) {
                let square = document.createElement("div");
                square.classList = `square empty`;
                boardGame[i].push(square);
                fragment.appendChild(square);
            }
        }
        return [boardGame,fragment];
    }
    
    const createCrono = time => {
        try {
            let crono = new Chronometer(time);
            return crono;
        } catch (error) {
            console.error(`Chronometer no pudo ser creado`);
        }
    }

    const printTimer = (display,crono) => display.innerHTML = crono == undefined ? '00:00:00' : crono.getTime();
    const printScore = (display,game) => display.innerHTML = game.getScore(true);
    
    document.addEventListener("DOMContentLoaded", () => {
        const containerMessage     = document.getElementById("message");
        const message              = containerMessage.children[0];
        const resetButton          = document.getElementById("reset");
        const board                = document.getElementById("board");
        const score                = document.getElementById("score");
        const time                 = document.getElementById("time");
        const [boardGame,fragment] = createBoardGame();
        const snake                = new SnakeGame(boardGame, localStorage.getItem('snake_max_score'));
        let crono                  = createCrono(0);
        let idRenderUI             = 0;
        
        board.appendChild(fragment);

        printScore(score,snake);
        printTimer(time,crono);

        const showMessage = () => {
            const END_GAME_MESSAGE = 
                `<p>Has obtenido ${snake.getScore()} puntos de un máximo de ${SnakeGame.getMaxScore()} en un tiempo de ${time.innerHTML}.</p>`;
            message.innerHTML = snake.getStatusGame() === 'WIN' ? 
                `<h3>¡Enhorabuena, has ganado!</h3>${END_GAME_MESSAGE}` : 
                snake.getStatusGame() === 'LOSE' ? `<h3>Lo siento, has perdido.</h3>${END_GAME_MESSAGE}` : "";
            containerMessage.classList = snake.getStatusGame() === 'WIN' ? "win" : snake.getStatusGame() === 'LOSE' ? "lose" : "hidden";
        }

        const resetGame = () => {
            snake.resetGame();
            crono = createCrono(0);
            printScore(score,snake);
            printTimer(time,crono);
            containerMessage.classList = 'hidden';
        }

        const stopRenderUI = () => clearInterval(idRenderUI);

        const renderUI = () => setInterval( 
            () => {
                if (snake.getStatusGame() !== '') {
                    localStorage.removeItem('snake_max_score');
                    localStorage.setItem('snake_max_score',SnakeGame.getMaxScore());
                    showMessage();
                    stopRenderUI();
                    return;
                }
                printScore(score,snake);
                printTimer(time,crono);
            }, 250);

        
        document.addEventListener('keydown', e => {
            if (snake.getStatusGame() !== '') return;
            if (e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "ArrowLeft" || e.code === "ArrowRight") 
                snake.setDirection( normalizeCodeKey(e.code) );
            else if (e.code === "Space" || e.code === "KeyP" || e.code === "Pause") {
                snake.togglePause();
                crono.togglePause();
                !snake.getPaused() ? (idRenderUI = renderUI()) : stopRenderUI();
            }
        });

        resetButton.addEventListener("click", resetGame);
    });
}
