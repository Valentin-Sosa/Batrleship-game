import { playerAttack, computerAttack } from "./dom"

class Ship
{
    constructor(length)
    {
        this.length = length
        this.hits = 0
    }

    hit()
    {
        this.hits += 1 
    }

    isSunk()
    {
        return this.length <= this.hits
    }
}

class Gameboard
{
    constructor(c = 10,r = 10)
    {
        this.board = this.newBoard(c,r)
        this.columns = c
        this.rows = r
        this.lastMissedShot = []
        this.amountOfShip = 0
    }

    getColumns()
    {
        return this.columns
    }

    getRows()
    {
        return this.rows
    }

    newBoard(c,r)
    {
        let board = new Array(c);
        for (let i = 0; i < c; i++) {
            board[i] = new Array(r).fill(0); 
        }
        return board;
    }

    changeAxis()
    {
        this.isTheActualAxisX = !this.isTheActualAxisX
    }

    changeTheAmountOfShip(n)
    {
        this.amountOfShip += n
    }

    inssertShipIn(cordenates)
    {
        const ship = new Ship(cordenates.c - cordenates.b + 1)
        cordenates.putShip(this.board, ship)
        this.changeTheAmountOfShip(1)
    }

    thereIsShipIn(x,y)
    {
        return this.board[x][y] !== 0
    }
    
    reciveAttack(x,y)
    {
        this.board[x][y].hit()
        if(this.board[x][y].isSunk()) this.changeTheAmountOfShip(-1) 
    }

    isAllTheShipsSunk()
    {
        return this.amountOfShip === 0
    }
}

class Player
{
    constructor()
    {
        this.gameboard = new Gameboard()
        this.wayOfAttack = playerAttack
    }

    reciveAttack(x,y)
    {
        const isPosibleTheAttack = this.gameboard.thereIsShipIn(x,y)
        if(isPosibleTheAttack) this.gameboard.reciveAttack(x,y)
        return isPosibleTheAttack
    }

    addShip(cordenates)
    {
        this.gameboard.inssertShipIn(cordenates)
    }

    getGameboard()
    {
        return this.gameboard
    }

    isGameOver()
    {
        return this.gameboard.isAllTheShipsSunk()
    }

    typeOfMyCells()
    {
        return ""
    }

    getWayOfAttack()
    {
        return this.wayOfAttack
    }
}

class Computer extends Player
{
    constructor()
    {
        super()
        this.wayOfAttack = computerAttack
    }

    typeOfMyCells()
    {
        return "enemy"
    }
}

export {Ship,Gameboard, Player, Computer}