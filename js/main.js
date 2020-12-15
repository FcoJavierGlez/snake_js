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

    //const printTimer = (time,crono) => time.innerHTML = crono == undefined ? '00:00:00' : crono.getTime();
    
    document.addEventListener("DOMContentLoaded", () => {
        const containerMessage     = document.getElementById("message");
        const message              = containerMessage.children[0];
        const resetButton          = document.getElementById("reset");
        const board                = document.getElementById("board");
        const score                = document.getElementById("score");
        const time                 = document.getElementById("time");
        const [boardGame,fragment] = createBoardGame();
        const snake                = new Snake(boardGame);
        let crono                  = createCrono(0);
        let idRenderUI             = 0;
        
        board.appendChild(fragment);

        time.innerHTML = crono == undefined ? '00:00:00' : crono.getTime();

        const showMessage = () => {
            const END_GAME_MESSAGE = 
                `<p>Has obtenido ${snake.getScore()} puntos de un máximo de ${Snake.getMaxScore()} en un tiempo de ${crono.getTime()}.</p>`;
            message.innerHTML = snake.getEndGame() && snake.getAlive() ? 
                `<h3>¡Enhorabuena, has ganado!</h3>${END_GAME_MESSAGE}` : 
                snake.getEndGame() && !snake.getAlive() ? `<h3>Lo siento, has perdido.</h3>${END_GAME_MESSAGE}` : "";
            containerMessage.classList = snake.getEndGame() && snake.getAlive() ? "win" : snake.getEndGame() && !snake.getAlive() ? "lose" : "hidden";
        }

        const resetGame = () => {
            snake.resetGame();
            crono = createCrono(0);
            score.innerHTML = snake.getScore(true);
            time.innerHTML = crono == undefined ? '00:00:00' : crono.getTime();
            containerMessage.classList = 'hidden';
        }

        const stopRenderUI = () => clearInterval(idRenderUI);

        const renderUI = () => setInterval( 
            () => {
                if (!snake.getAlive() || snake.getEndGame()) {
                    showMessage();
                    stopRenderUI();
                    return;
                }
                time.innerHTML  = crono == undefined ? '00:00:00' : crono.getTime();
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
                crono.togglePause();
                !snake.getPaused() ? (idRenderUI = renderUI()) : stopRenderUI();
            }
        });

        resetButton.addEventListener("click", resetGame);
    });
}
