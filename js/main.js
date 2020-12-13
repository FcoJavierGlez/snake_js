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
        //console.log(boardGame);
        return [boardGame,fragment];
    }
    const resetGame = () => {
        /* Game.reset();
        Game.render(); */
    }
    
    document.addEventListener("DOMContentLoaded", () => {
        const containerMessage   = document.getElementById("message");
        const message            = containerMessage.children[0];
        const resetButton        = document.getElementById("reset");
        const board              = document.getElementById("board");
        const score              = document.getElementById("score");
        const [boardGame,fragment] = createBoardGame();
        const snake = new Snake(boardGame);

        //console.log( snake.getBody() );
        board.appendChild(fragment);

        const showMessage = () => {
            score.innerHTML   = snake.getScore();
            /* message.innerHTML = Game.getWin() ? "¡Enhorabuena, has ganado!" : Game.getLose() ? "Lo siento, has perdido." : "";
            containerMessage.classList = Game.getWin() ? "win" : Game.getLose() ? "lose" : "hidden"; */
        }

        score.innerHTML = snake.getScore();

        document.addEventListener('keydown', e => {
            if (e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "ArrowLeft" || e.code === "ArrowRight") 
                snake.setDirection( normalizeCodeKey(e.code) );
            else if (e.code === "Space" || e.code === "KeyP" || e.code === "Pause")
                snake.togglePause();
        })

        /* document.addEventListener("click",showMessage);
        document.addEventListener("contextmenu",showMessage);

        resetButton.addEventListener("click",resetGame); */
    });
}
