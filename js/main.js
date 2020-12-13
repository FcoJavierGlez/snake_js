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
    const resetGame = () => {
        /* Game.reset();
        Game.render(); */
    }
    
    document.addEventListener("DOMContentLoaded", () => {
        const containerMessage     = document.getElementById("message");
        const message              = containerMessage.children[0];
        const resetButton          = document.getElementById("reset");
        const board                = document.getElementById("board");
        const score                = document.getElementById("score");
        const [boardGame,fragment] = createBoardGame();
        let idRenderUI             = 0;
        const snake = new Snake(boardGame);
        board.appendChild(fragment);

        const showMessage = () => {
            message.innerHTML = snake.getEndGame() && snake.getAlive() ? 
                `<h3>¡Enhorabuena, has ganado!</h3><p>Has obtenido ${snake.getScore()} puntos de un máximo de ${Snake.getMaxScore()}.</p>` : 
                snake.getEndGame() && !snake.getAlive() ? `<h3>Lo siento, has perdido.</h3><p>Has obtenido ${snake.getScore()} puntos de un máximo de ${Snake.getMaxScore()}.</p>` : "";
            containerMessage.classList = snake.getEndGame() && snake.getAlive() ? "win" : snake.getEndGame() && !snake.getAlive() ? "lose" : "hidden";
        }

        const stopRenderUI = () => clearInterval(idRenderUI);

        const renderUI = () => setInterval( 
            () => {
                if (!snake.getAlive() || snake.getEndGame()) {
                    showMessage();
                    stopRenderUI();
                    return;
                }
                score.innerHTML = snake.getScore(true);
                console.log('render')
            }, 250);

        score.innerHTML = snake.getScore(true);
        
        document.addEventListener('keydown', e => {
            if (!snake.getAlive() || snake.getEndGame()) return;
            if (e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "ArrowLeft" || e.code === "ArrowRight") 
                snake.setDirection( normalizeCodeKey(e.code) );
            else if (e.code === "Space" || e.code === "KeyP" || e.code === "Pause") {
                snake.togglePause();
                !snake.getPaused() ? (idRenderUI = renderUI()) : stopRenderUI();
            }
        });

        //resetButton.addEventListener("click", resetGame);
    });
}
