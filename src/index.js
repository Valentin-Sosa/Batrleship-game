import { Game } from "./dom";
import './style.css'

function game()
{
    const newGame = new Game()
    newGame.startGame()
    newGame.playGame()
}

game()