import { Player , Computer} from "./logic"


const axisY =
{
    wayOfPutShip:(board,ship,a,i) => board[a][i] = ship,
    wayOfDraw : (a,i) => `[data-x="${a}"][data-y="${i}"]`,
    getParticularCell: (id,x,y, i) => document.querySelector(`#${id} > [data-x="${x}"][data-y="${Math.min(y+i,9)}"]`)
}

const axisX = 
{
    wayOfPutShip: (board,ship,a,i) =>{ board[i][a] = ship},
    wayOfDraw : (a,i) => `[data-x="${i}"][data-y="${a}"]`,
    getParticularCell: (id,x,y, i) => document.querySelector(`#${id} > [data-x="${Math.min(x+i,9)}"][data-y="${y}"]`)
}


class DomShip
{
    constructor(axis,a,b,c)
    {
        this.axis = axis
        this.a = a
        this.b = b
        this.c = c
    }

    putShip(board,ship)
    {
        for(let i = this.b; i<=this.c; i++)
        {
            this.axis.wayOfPutShip(board,ship,this.a,i)
        }
    }

    getAtributeByAxis(i)
    {
        return this.axis.wayOfDraw(this.a,i)
    }
}


class Game
{
    constructor()
    {
        this.playerboard = new DomGameboard("player", new Player())
        this.computerboard = new DomGameboard("computer", new Computer())
        this.choiceboard = new DomGameboard("choice-board", new Player())
        this.endgameModal = document.getElementById("end-game")
        this.startgameModal = document.getElementById("start-game")
        this.rotateBtn = document.getElementById("rotate-btn")
    }

    showEndgameModal(winner)
    {
        const winnerText = document.getElementById("winner")
        const newGameBtn = document.getElementById("new-game")
        this.endgameModal.showModal()
        winnerText.textContent = `The winner is ${winner}`
        newGameBtn.addEventListener("click",()=> this.restartGame())
    }
    
    checkStatusGame()
    {
        if(this.playerboard.getPlayer().isGameOver()) this.showEndgameModal("Computer")
        else if(this.computerboard.getPlayer().isGameOver()) this.showEndgameModal("Player")
    }


    startGame()
    {
        this.playerboard.generateGameboard()
        this.computerboard.generateGameboard()

        this.startPlayerChoice()
        this.putComputerRandomShips()
    }

    setNewChoiceboard()
    {
        this.choiceboard = new DomGameboard("choice-board", new Player())
    }

    startPlayerChoice()
    {
        this.rotateBtn.addEventListener("click", ()=> this.choiceboard.changeAxis())
        this.startgameModal.showModal()
        this.choiceboard.generateGameboard()
        this.choiceboard.getCells().forEach(cell => cell.addEventListener("mouseover", e =>{
            this.drawTemporalShip(e.target)
        }))
    
    }

    drawTemporalShip(cell)
    {
        const preselected = [cell]
        const x = this.choiceboard.getX(cell)
        const y = this.choiceboard.getY(cell)
        const size = this.choiceboard.getCurrentSizeShip()
        for(let i = 1; i< size; i++)
        {
            const cell = this.choiceboard.getActualAxis().getParticularCell("choice-board",x,y,i)
            preselected.push(cell)
        }
        preselected.forEach(c => c.classList.add("preselected"))
        cell.addEventListener("mouseout", () => preselected.forEach(c => c.classList.remove("preselected")))
        cell.addEventListener("click",()=>{ if(this.isNotBusy(preselected)) this.selectShip(preselected)})
        if(size === 0) this.finishChoice()
    }

    selectShip(cellList)
    {
        const firstCell = cellList.at(0)
        const lastCell = cellList.at(-1)
        const corFirstCell = this.choiceboard.getCordenates(firstCell)
        const corLastCell = this.choiceboard.getCordenates(lastCell)
        if(corFirstCell.y === corLastCell.y && this.choiceboard.getActualAxis() === axisX) this.choiceboard.createShip(new DomShip(axisX,corFirstCell.y, corFirstCell.x, corLastCell.x))
        else if(corFirstCell.x === corLastCell.x && this.choiceboard.getActualAxis() === axisY) this.choiceboard.createShip(new DomShip(axisY, corFirstCell.x, corFirstCell.y, corLastCell.y))
    }

    finishChoice()
    {
        this.playerboard.setDomShips(this.choiceboard.getDomShips())
        this.startgameModal.close()
        this.playerboard.putAllDomShips()
    }

    isNotBusy(cellList)
    {
        console.log(cellList)
        return cellList.every(cell => !cell.classList.contains("ship"))
    }

        putComputerRandomShips() {
            const randomDomShips = [];
            const occupiedCells = new Set(); // Guardará las celdas ocupadas por barcos
        
            const shipSizes = [5, 4, 3, 3, 2];
        
            for (let size of shipSizes) {
                let validShip;
                do {
                    validShip = this.generateValidShip(size, occupiedCells);
                } while (!validShip); // Se repite hasta encontrar una posición válida
        
                randomDomShips.push(validShip);
            }
        
            console.log(randomDomShips);
            this.computerboard.setDomShips(randomDomShips);
            this.computerboard.putAllDomShips();
        }
        
        generateValidShip(size, occupiedCells) {
            let axis, a, b, c, x, y;
            let isValid = false;
        
            while (!isValid) {
                axis = this.getRandomAxis();
                if (axis === axisX) { 
                    x = Math.floor(Math.random() * 10);
                    y = Math.floor(Math.random() * (10 - size)); // Evita salir del tablero
                    a = x;
                    b = y;
                    c = y + size - 1;
                } else { 
                    x = Math.floor(Math.random() * (10 - size));
                    y = Math.floor(Math.random() * 10);
                    a = y;
                    b = x;
                    c = x + size - 1;
                }
        
                isValid = this.isPlacementValid(axis, a, b, c, occupiedCells);
            }
        
            // Registrar las celdas ocupadas
            for (let i = b; i <= c; i++) {
                const key = axis === axisX ? `${a}-${i}` : `${i}-${a}`;
                occupiedCells.add(key);
            }
        
            return new DomShip(axis, a, b, c);
        }
        
        isPlacementValid(axis, a, b, c, occupiedCells) {
            for (let i = b; i <= c; i++) {
                const key = axis === axisX ? `${a}-${i}` : `${i}-${a}`;
        
                // Verifica si ya hay un barco en esa celda
                if (occupiedCells.has(key)) return false;
        
                // Verifica si hay un barco demasiado cerca (una celda de distancia)
                if (this.isAdjacentOccupied(axis, a, i, occupiedCells)) return false;
            }
            return true;
        }
        
    isAdjacentOccupied(axis, x, y, occupiedCells) {
            const directions = [
                [0, 1], [0, -1], [1, 0], [-1, 0], // Arriba, abajo, izquierda, derecha
                [1, 1], [1, -1], [-1, 1], [-1, -1] // Diagonales
            ];
        
            return directions.some(([dx, dy]) => {
                const nx = x + dx;
                const ny = y + dy;
                return occupiedCells.has(`${nx}-${ny}`);
            });
        }
    
    getRandomAxis()
    {
        const randomNum = Math.floor(Math.random() * 2)
        switch(randomNum)
        {
            case 0:
                return axisX
            case 1: 
                return axisY
        } 
    }

    restartGame()
    {
        this.playerboard.clearGameboard()
        this.computerboard.clearGameboard()
        this.choiceboard.clearGameboard()
        this.setNewChoiceboard()
        this.endgameModal.close()
        this.startGame()
        this.playGame()

        this.rotateBtn.addEventListener("click", () => this.choiceboard.changeAxis())
    }


    playGame()
    {
        this.computerboard.getCells().forEach(cell => cell.addEventListener("click", e =>{
            
            this.playerboard.attack(this.computerboard,e.target)
            this.computerboard.attack(this.playerboard)
            this.checkStatusGame()
        }))
    }
}

class DomGameboard 
{
    constructor(id, type){
        this.player = type
        this.domGameboard = document.getElementById(id)
        this.cells = []
        this.domShips = []
        this.orderOfShips = [5,4,3,3,2,0]
        this.id = id
        this.actualAxis = axisX
    }

    generateGameboard() {
        const rows = this.player.getGameboard().getRows()
        const columns = this.player.getGameboard().getColumns()
        for(let y = 0; y<columns; y++)
        {
            for(let x = 0; x<rows; x++)
            {
                const cell = document.createElement("div")
                cell.className = "cell" + " " + this.player.typeOfMyCells()
                cell.dataset.x = x
                cell.dataset.y = y
                this.domGameboard.appendChild(cell)
                this.cells.push(cell)
            }
            
        }
    }

    getPlayer()
    {
        return this.player
    }

    getCells()
    {
        return this.cells
    }

    getCurrentSizeShip()
    {
        return this.orderOfShips[this.domShips.length]
    }

    getDomShips()
    {
        return this.domShips
    }

    setDomShips(newDomShips)
    {
        this.domShips = newDomShips
    }

    createShip(domShip)
    {
        this.drawShip(domShip)
        this.player.addShip(domShip)
        this.domShips.push(domShip)
    }

    putAllDomShips()
    {
        this.domShips.forEach(domShip => this.createShip(domShip))
    }

    getActualAxis()
    {
        return this.actualAxis
    }

    changeAxis()
    {
        if(this.actualAxis === axisX) this.actualAxis = axisY
        else if( this.actualAxis === axisY) this.actualAxis = axisX
    }

    getX(target)
    {
        return Number(target.dataset.x)
    }

    getY(target)
    {
        return Number(target.dataset.y)
    }

    getCordenates(target)
    {
        return {x:this.getX(target), y: this.getY(target)}
    }

    drawShip(domShip)
    {
        for(let i = domShip.b; i<=domShip.c; i++)
        {
            const cell = document.querySelector(`#${this.id} > ${domShip.getAtributeByAxis(i)}`)
            cell.classList.add("ship")
        }
    }
    attack(enemy, target = null)
    {
        const cell = this.player.getWayOfAttack().attack(target)
        const result = enemy.getPlayer().reciveAttack(this.getX(cell),this.getY(cell))
        result? cell.classList.add("attacked"): cell.classList.add("fail")
    }

    clearGameboard()
    {
        this.domGameboard.innerHTML = ""
    }
}

const computerAttack = 
{
    pastCordenates : [],
    getRandomCordanates : () =>
    {
        const x = Math.floor(Math.random() * 10)
        const y = Math.floor(Math.random() * 10)
        const cordenates = {x,y}
        if(computerAttack.pastCordenates.includes(cordenates)) this.getRandomCordanates()
        else
        {
            computerAttack.pastCordenates.push(cordenates)
            return cordenates
        }
    },
    attack : (target) => 
    {
        const cordenates = computerAttack.getRandomCordanates()
        return document.querySelector(`#player > [data-x="${cordenates.x}"][data-y="${cordenates.y}"]`)
    }
}

const playerAttack = 
{
    attack: (target) => target
}


export  {Game, playerAttack, computerAttack}