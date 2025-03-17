"use strict";
(self["webpackChunkweb_template"] = self["webpackChunkweb_template"] || []).push([["main"],{

/***/ "./src/dom.js":
/*!********************!*\
  !*** ./src/dom.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Game: () => (/* binding */ Game),
/* harmony export */   computerAttack: () => (/* binding */ computerAttack),
/* harmony export */   playerAttack: () => (/* binding */ playerAttack)
/* harmony export */ });
/* harmony import */ var _logic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logic */ "./src/logic.js");

const axisY = {
  wayOfPutShip: (board, ship, a, i) => board[a][i] = ship,
  wayOfDraw: (a, i) => `[data-x="${a}"][data-y="${i}"]`,
  getParticularCell: (id, x, y, i) => document.querySelector(`#${id} > [data-x="${x}"][data-y="${Math.min(y + i, 9)}"]`)
};
const axisX = {
  wayOfPutShip: (board, ship, a, i) => {
    board[i][a] = ship;
  },
  wayOfDraw: (a, i) => `[data-x="${i}"][data-y="${a}"]`,
  getParticularCell: (id, x, y, i) => document.querySelector(`#${id} > [data-x="${Math.min(x + i, 9)}"][data-y="${y}"]`)
};
class DomShip {
  constructor(axis, a, b, c) {
    this.axis = axis;
    this.a = a;
    this.b = b;
    this.c = c;
  }
  putShip(board, ship) {
    for (let i = this.b; i <= this.c; i++) {
      this.axis.wayOfPutShip(board, ship, this.a, i);
    }
  }
  getAtributeByAxis(i) {
    return this.axis.wayOfDraw(this.a, i);
  }
}
class Game {
  constructor() {
    this.playerboard = new DomGameboard("player", new _logic__WEBPACK_IMPORTED_MODULE_0__.Player());
    this.computerboard = new DomGameboard("computer", new _logic__WEBPACK_IMPORTED_MODULE_0__.Computer());
    this.choiceboard = new DomGameboard("choice-board", new _logic__WEBPACK_IMPORTED_MODULE_0__.Player());
    this.endgameModal = document.getElementById("end-game");
    this.startgameModal = document.getElementById("start-game");
    this.rotateBtn = document.getElementById("rotate-btn");
  }
  showEndgameModal(winner) {
    const winnerText = document.getElementById("winner");
    const newGameBtn = document.getElementById("new-game");
    this.endgameModal.showModal();
    winnerText.textContent = `The winner is ${winner}`;
    newGameBtn.addEventListener("click", () => this.restartGame());
  }
  checkStatusGame() {
    if (this.playerboard.getPlayer().isGameOver()) this.showEndgameModal("Computer");else if (this.computerboard.getPlayer().isGameOver()) this.showEndgameModal("Player");
  }
  startGame() {
    this.playerboard.generateGameboard();
    this.computerboard.generateGameboard();
    this.startPlayerChoice();
    this.putComputerRandomShips();
  }
  setNewChoiceboard() {
    this.choiceboard = new DomGameboard("choice-board", new _logic__WEBPACK_IMPORTED_MODULE_0__.Player());
  }
  startPlayerChoice() {
    this.rotateBtn.addEventListener("click", () => this.choiceboard.changeAxis());
    this.startgameModal.showModal();
    this.choiceboard.generateGameboard();
    this.choiceboard.getCells().forEach(cell => cell.addEventListener("mouseover", e => {
      this.drawTemporalShip(e.target);
    }));
  }
  drawTemporalShip(cell) {
    const preselected = [cell];
    const x = this.choiceboard.getX(cell);
    const y = this.choiceboard.getY(cell);
    const size = this.choiceboard.getCurrentSizeShip();
    for (let i = 1; i < size; i++) {
      const cell = this.choiceboard.getActualAxis().getParticularCell("choice-board", x, y, i);
      preselected.push(cell);
    }
    preselected.forEach(c => c.classList.add("preselected"));
    cell.addEventListener("mouseout", () => preselected.forEach(c => c.classList.remove("preselected")));
    cell.addEventListener("click", () => {
      if (this.isNotBusy(preselected)) this.selectShip(preselected);
    });
    if (size === 0) this.finishChoice();
  }
  selectShip(cellList) {
    const firstCell = cellList.at(0);
    const lastCell = cellList.at(-1);
    const corFirstCell = this.choiceboard.getCordenates(firstCell);
    const corLastCell = this.choiceboard.getCordenates(lastCell);
    if (corFirstCell.y === corLastCell.y && this.choiceboard.getActualAxis() === axisX) this.choiceboard.createShip(new DomShip(axisX, corFirstCell.y, corFirstCell.x, corLastCell.x));else if (corFirstCell.x === corLastCell.x && this.choiceboard.getActualAxis() === axisY) this.choiceboard.createShip(new DomShip(axisY, corFirstCell.x, corFirstCell.y, corLastCell.y));
  }
  finishChoice() {
    this.playerboard.setDomShips(this.choiceboard.getDomShips());
    this.startgameModal.close();
    this.playerboard.putAllDomShips();
  }
  isNotBusy(cellList) {
    console.log(cellList);
    return cellList.every(cell => !cell.classList.contains("ship"));
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
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0],
    // Arriba, abajo, izquierda, derecha
    [1, 1], [1, -1], [-1, 1], [-1, -1] // Diagonales
    ];
    return directions.some(_ref => {
      let [dx, dy] = _ref;
      const nx = x + dx;
      const ny = y + dy;
      return occupiedCells.has(`${nx}-${ny}`);
    });
  }
  getRandomAxis() {
    const randomNum = Math.floor(Math.random() * 2);
    switch (randomNum) {
      case 0:
        return axisX;
      case 1:
        return axisY;
    }
  }
  restartGame() {
    this.playerboard.clearGameboard();
    this.computerboard.clearGameboard();
    this.choiceboard.clearGameboard();
    this.setNewChoiceboard();
    this.endgameModal.close();
    this.startGame();
    this.playGame();
    this.rotateBtn.addEventListener("click", () => this.choiceboard.changeAxis());
  }
  playGame() {
    this.computerboard.getCells().forEach(cell => cell.addEventListener("click", e => {
      this.playerboard.attack(this.computerboard, e.target);
      this.computerboard.attack(this.playerboard);
      this.checkStatusGame();
    }));
  }
}
class DomGameboard {
  constructor(id, type) {
    this.player = type;
    this.domGameboard = document.getElementById(id);
    this.cells = [];
    this.domShips = [];
    this.orderOfShips = [5, 4, 3, 3, 2, 0];
    this.id = id;
    this.actualAxis = axisX;
  }
  generateGameboard() {
    const rows = this.player.getGameboard().getRows();
    const columns = this.player.getGameboard().getColumns();
    for (let y = 0; y < columns; y++) {
      for (let x = 0; x < rows; x++) {
        const cell = document.createElement("div");
        cell.className = "cell" + " " + this.player.typeOfMyCells();
        cell.dataset.x = x;
        cell.dataset.y = y;
        this.domGameboard.appendChild(cell);
        this.cells.push(cell);
      }
    }
  }
  getPlayer() {
    return this.player;
  }
  getCells() {
    return this.cells;
  }
  getCurrentSizeShip() {
    return this.orderOfShips[this.domShips.length];
  }
  getDomShips() {
    return this.domShips;
  }
  setDomShips(newDomShips) {
    this.domShips = newDomShips;
  }
  createShip(domShip) {
    this.drawShip(domShip);
    this.player.addShip(domShip);
    this.domShips.push(domShip);
  }
  putAllDomShips() {
    this.domShips.forEach(domShip => this.createShip(domShip));
  }
  getActualAxis() {
    return this.actualAxis;
  }
  changeAxis() {
    if (this.actualAxis === axisX) this.actualAxis = axisY;else if (this.actualAxis === axisY) this.actualAxis = axisX;
  }
  getX(target) {
    return Number(target.dataset.x);
  }
  getY(target) {
    return Number(target.dataset.y);
  }
  getCordenates(target) {
    return {
      x: this.getX(target),
      y: this.getY(target)
    };
  }
  drawShip(domShip) {
    for (let i = domShip.b; i <= domShip.c; i++) {
      const cell = document.querySelector(`#${this.id} > ${domShip.getAtributeByAxis(i)}`);
      cell.classList.add("ship");
    }
  }
  attack(enemy) {
    let target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    const cell = this.player.getWayOfAttack().attack(target);
    const result = enemy.getPlayer().reciveAttack(this.getX(cell), this.getY(cell));
    result ? cell.classList.add("attacked") : cell.classList.add("fail");
  }
  clearGameboard() {
    this.domGameboard.innerHTML = "";
  }
}
const computerAttack = {
  pastCordenates: [],
  getRandomCordanates: () => {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    const cordenates = {
      x,
      y
    };
    if (computerAttack.pastCordenates.includes(cordenates)) undefined.getRandomCordanates();else {
      computerAttack.pastCordenates.push(cordenates);
      return cordenates;
    }
  },
  attack: target => {
    const cordenates = computerAttack.getRandomCordanates();
    return document.querySelector(`#player > [data-x="${cordenates.x}"][data-y="${cordenates.y}"]`);
  }
};
const playerAttack = {
  attack: target => target
};


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ "./src/dom.js");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.css */ "./src/style.css");


function game() {
  const newGame = new _dom__WEBPACK_IMPORTED_MODULE_0__.Game();
  newGame.startGame();
  newGame.playGame();
}
game();

/***/ }),

/***/ "./src/logic.js":
/*!**********************!*\
  !*** ./src/logic.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Computer: () => (/* binding */ Computer),
/* harmony export */   Gameboard: () => (/* binding */ Gameboard),
/* harmony export */   Player: () => (/* binding */ Player),
/* harmony export */   Ship: () => (/* binding */ Ship)
/* harmony export */ });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ "./src/dom.js");

class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
  }
  hit() {
    this.hits += 1;
  }
  isSunk() {
    return this.length <= this.hits;
  }
}
class Gameboard {
  constructor() {
    let c = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
    let r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
    this.board = this.newBoard(c, r);
    this.columns = c;
    this.rows = r;
    this.lastMissedShot = [];
    this.amountOfShip = 0;
  }
  getColumns() {
    return this.columns;
  }
  getRows() {
    return this.rows;
  }
  newBoard(c, r) {
    let board = new Array(c);
    for (let i = 0; i < c; i++) {
      board[i] = new Array(r).fill(0);
    }
    return board;
  }
  changeAxis() {
    this.isTheActualAxisX = !this.isTheActualAxisX;
  }
  changeTheAmountOfShip(n) {
    this.amountOfShip += n;
  }
  inssertShipIn(cordenates) {
    const ship = new Ship(cordenates.c - cordenates.b + 1);
    cordenates.putShip(this.board, ship);
    this.changeTheAmountOfShip(1);
  }
  thereIsShipIn(x, y) {
    return this.board[x][y] !== 0;
  }
  reciveAttack(x, y) {
    this.board[x][y].hit();
    if (this.board[x][y].isSunk()) this.changeTheAmountOfShip(-1);
  }
  isAllTheShipsSunk() {
    return this.amountOfShip === 0;
  }
}
class Player {
  constructor() {
    this.gameboard = new Gameboard();
    this.wayOfAttack = _dom__WEBPACK_IMPORTED_MODULE_0__.playerAttack;
  }
  reciveAttack(x, y) {
    const isPosibleTheAttack = this.gameboard.thereIsShipIn(x, y);
    if (isPosibleTheAttack) this.gameboard.reciveAttack(x, y);
    return isPosibleTheAttack;
  }
  addShip(cordenates) {
    this.gameboard.inssertShipIn(cordenates);
  }
  getGameboard() {
    return this.gameboard;
  }
  isGameOver() {
    return this.gameboard.isAllTheShipsSunk();
  }
  typeOfMyCells() {
    return "";
  }
  getWayOfAttack() {
    return this.wayOfAttack;
  }
}
class Computer extends Player {
  constructor() {
    super();
    this.wayOfAttack = _dom__WEBPACK_IMPORTED_MODULE_0__.computerAttack;
  }
  typeOfMyCells() {
    return "enemy";
  }
}


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap);"]);
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Big+Shoulders+Stencil:opsz,wght@10..72,100..900&family=New+Amsterdam&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `*
{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
}

body
{
    background-color: black;
}

main
{
    display: flex;
    justify-content:center;
    align-items: center;
    height: 70vh;
    gap: 12vw;
}

.gameboard
{
    display: grid;
    grid-template-columns: repeat(10,40px);
    border: 1px solid white;
}

.cell
{
    width: 40px;
    height: 40px;
    border: 2px white solid;
}

.ship
{
    background-color: gray;
}


.enemy
{
    background-color: black;
}

.enemy:hover
{
    background-color: gray;
    opacity: .6;
}

.attacked
{
    background-color: red;
}

.fail
{
    background-color: rgb(255, 255, 255);
}

.fail,.attacked
{
    pointer-events: none;
}

#end-game, #start-game
{
    position: fixed;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 300px;
    padding: 2vh 2vw;
    border-radius: 1rem;
    border: none;
    box-shadow: 0 0 1em black;
}

#end-game > section, #start-game > section
{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
}


dialog::backdrop 
{
    background-color: rgba(0, 0, 0, 0.6);
}

#new-game, #rotate-btn
{
    border: none;
    border-radius: 5px;
    background-color: black;
    color: white;
    height: 5vh;
    width: 10vw;
    align-self: center;
    font-weight: bold;
    font-size: 1rem;
}

#rotate-btn
{
    width: 100px;
    font-size: 1.4rem;
    background-color: white;
    color: black;
    border: none;
}

#rotate-btn:hover
{
    background-color: gray;
    color: white;
}

#new-game:hover
{
    background-color: rgb(71, 71, 71);
}

#winner
{
    text-align: center;
    font-size: 1.4rem;
    font-weight: bold;
}

#start-game
{
    color: white;
    background-color: black;
    padding: 30px;
    width: 500px;
}

#start-game > section
{
    gap: 25px;
}

.preselected
{
    background-color: white;
}

header
{
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: end;
    font-size: 4rem;

}

h1
{
    font-family: "Big Shoulders Stencil", sans-serif;
    font-optical-sizing: auto;
    font-weight: 900;
    font-style: normal;
    color: white;
}

main > section
{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}
h2
{
    font-family: "Big Shoulders Stencil", sans-serif;
    font-optical-sizing: auto;
    font-weight: 900;
    color: white;
    font-size: 2rem;
}`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"AAGA;;IAEI,UAAU;IACV,SAAS;IACT,sBAAsB;IACtB,iCAAiC;AACrC;;AAEA;;IAEI,uBAAuB;AAC3B;;AAEA;;IAEI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,YAAY;IACZ,SAAS;AACb;;AAEA;;IAEI,aAAa;IACb,sCAAsC;IACtC,uBAAuB;AAC3B;;AAEA;;IAEI,WAAW;IACX,YAAY;IACZ,uBAAuB;AAC3B;;AAEA;;IAEI,sBAAsB;AAC1B;;;AAGA;;IAEI,uBAAuB;AAC3B;;AAEA;;IAEI,sBAAsB;IACtB,WAAW;AACf;;AAEA;;IAEI,qBAAqB;AACzB;;AAEA;;IAEI,oCAAoC;AACxC;;AAEA;;IAEI,oBAAoB;AACxB;;AAEA;;IAEI,eAAe;IACf,QAAQ;IACR,SAAS;IACT,gCAAgC;;IAEhC,YAAY;IACZ,gBAAgB;IAChB,mBAAmB;IACnB,YAAY;IACZ,yBAAyB;AAC7B;;AAEA;;IAEI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,uBAAuB;IACvB,SAAS;AACb;;;AAGA;;IAEI,oCAAoC;AACxC;;AAEA;;IAEI,YAAY;IACZ,kBAAkB;IAClB,uBAAuB;IACvB,YAAY;IACZ,WAAW;IACX,WAAW;IACX,kBAAkB;IAClB,iBAAiB;IACjB,eAAe;AACnB;;AAEA;;IAEI,YAAY;IACZ,iBAAiB;IACjB,uBAAuB;IACvB,YAAY;IACZ,YAAY;AAChB;;AAEA;;IAEI,sBAAsB;IACtB,YAAY;AAChB;;AAEA;;IAEI,iCAAiC;AACrC;;AAEA;;IAEI,kBAAkB;IAClB,iBAAiB;IACjB,iBAAiB;AACrB;;AAEA;;IAEI,YAAY;IACZ,uBAAuB;IACvB,aAAa;IACb,YAAY;AAChB;;AAEA;;IAEI,SAAS;AACb;;AAEA;;IAEI,uBAAuB;AAC3B;;AAEA;;IAEI,YAAY;IACZ,aAAa;IACb,uBAAuB;IACvB,gBAAgB;IAChB,eAAe;;AAEnB;;AAEA;;IAEI,gDAAgD;IAChD,yBAAyB;IACzB,gBAAgB;IAChB,kBAAkB;IAClB,YAAY;AAChB;;AAEA;;IAEI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,SAAS;AACb;AACA;;IAEI,gDAAgD;IAChD,yBAAyB;IACzB,gBAAgB;IAChB,YAAY;IACZ,eAAe;AACnB","sourcesContent":["@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');\n@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Big+Shoulders+Stencil:opsz,wght@10..72,100..900&family=New+Amsterdam&display=swap');\n\n*\n{\n    padding: 0;\n    margin: 0;\n    box-sizing: border-box;\n    font-family: 'Roboto', sans-serif;\n}\n\nbody\n{\n    background-color: black;\n}\n\nmain\n{\n    display: flex;\n    justify-content:center;\n    align-items: center;\n    height: 70vh;\n    gap: 12vw;\n}\n\n.gameboard\n{\n    display: grid;\n    grid-template-columns: repeat(10,40px);\n    border: 1px solid white;\n}\n\n.cell\n{\n    width: 40px;\n    height: 40px;\n    border: 2px white solid;\n}\n\n.ship\n{\n    background-color: gray;\n}\n\n\n.enemy\n{\n    background-color: black;\n}\n\n.enemy:hover\n{\n    background-color: gray;\n    opacity: .6;\n}\n\n.attacked\n{\n    background-color: red;\n}\n\n.fail\n{\n    background-color: rgb(255, 255, 255);\n}\n\n.fail,.attacked\n{\n    pointer-events: none;\n}\n\n#end-game, #start-game\n{\n    position: fixed;\n    top: 45%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n\n    width: 300px;\n    padding: 2vh 2vw;\n    border-radius: 1rem;\n    border: none;\n    box-shadow: 0 0 1em black;\n}\n\n#end-game > section, #start-game > section\n{\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    gap: 10px;\n}\n\n\ndialog::backdrop \n{\n    background-color: rgba(0, 0, 0, 0.6);\n}\n\n#new-game, #rotate-btn\n{\n    border: none;\n    border-radius: 5px;\n    background-color: black;\n    color: white;\n    height: 5vh;\n    width: 10vw;\n    align-self: center;\n    font-weight: bold;\n    font-size: 1rem;\n}\n\n#rotate-btn\n{\n    width: 100px;\n    font-size: 1.4rem;\n    background-color: white;\n    color: black;\n    border: none;\n}\n\n#rotate-btn:hover\n{\n    background-color: gray;\n    color: white;\n}\n\n#new-game:hover\n{\n    background-color: rgb(71, 71, 71);\n}\n\n#winner\n{\n    text-align: center;\n    font-size: 1.4rem;\n    font-weight: bold;\n}\n\n#start-game\n{\n    color: white;\n    background-color: black;\n    padding: 30px;\n    width: 500px;\n}\n\n#start-game > section\n{\n    gap: 25px;\n}\n\n.preselected\n{\n    background-color: white;\n}\n\nheader\n{\n    height: 20vh;\n    display: flex;\n    justify-content: center;\n    align-items: end;\n    font-size: 4rem;\n\n}\n\nh1\n{\n    font-family: \"Big Shoulders Stencil\", sans-serif;\n    font-optical-sizing: auto;\n    font-weight: 900;\n    font-style: normal;\n    color: white;\n}\n\nmain > section\n{\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    gap: 20px;\n}\nh2\n{\n    font-family: \"Big Shoulders Stencil\", sans-serif;\n    font-optical-sizing: auto;\n    font-weight: 900;\n    color: white;\n    font-size: 2rem;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/index.js"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsT0FBTyxpRkFBaUYsVUFBVSxVQUFVLFlBQVksYUFBYSxPQUFPLE1BQU0sWUFBWSxPQUFPLE1BQU0sVUFBVSxZQUFZLGFBQWEsV0FBVyxVQUFVLE1BQU0sTUFBTSxVQUFVLFlBQVksYUFBYSxPQUFPLE1BQU0sVUFBVSxVQUFVLFlBQVksT0FBTyxNQUFNLFlBQVksUUFBUSxNQUFNLFlBQVksT0FB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QUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDNURhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2ViLXRlbXBsYXRlLy4vc3JjL2RvbS5qcyIsIndlYnBhY2s6Ly93ZWItdGVtcGxhdGUvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2ViLXRlbXBsYXRlLy4vc3JjL2xvZ2ljLmpzIiwid2VicGFjazovL3dlYi10ZW1wbGF0ZS8uL3NyYy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vd2ViLXRlbXBsYXRlLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly93ZWItdGVtcGxhdGUvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly93ZWItdGVtcGxhdGUvLi9zcmMvc3R5bGUuY3NzPzcxNjMiLCJ3ZWJwYWNrOi8vd2ViLXRlbXBsYXRlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3dlYi10ZW1wbGF0ZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vd2ViLXRlbXBsYXRlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3dlYi10ZW1wbGF0ZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly93ZWItdGVtcGxhdGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly93ZWItdGVtcGxhdGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQbGF5ZXIgLCBDb21wdXRlcn0gZnJvbSBcIi4vbG9naWNcIlxuXG5cbmNvbnN0IGF4aXNZID1cbntcbiAgICB3YXlPZlB1dFNoaXA6KGJvYXJkLHNoaXAsYSxpKSA9PiBib2FyZFthXVtpXSA9IHNoaXAsXG4gICAgd2F5T2ZEcmF3IDogKGEsaSkgPT4gYFtkYXRhLXg9XCIke2F9XCJdW2RhdGEteT1cIiR7aX1cIl1gLFxuICAgIGdldFBhcnRpY3VsYXJDZWxsOiAoaWQseCx5LCBpKSA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtpZH0gPiBbZGF0YS14PVwiJHt4fVwiXVtkYXRhLXk9XCIke01hdGgubWluKHkraSw5KX1cIl1gKVxufVxuXG5jb25zdCBheGlzWCA9IFxue1xuICAgIHdheU9mUHV0U2hpcDogKGJvYXJkLHNoaXAsYSxpKSA9PnsgYm9hcmRbaV1bYV0gPSBzaGlwfSxcbiAgICB3YXlPZkRyYXcgOiAoYSxpKSA9PiBgW2RhdGEteD1cIiR7aX1cIl1bZGF0YS15PVwiJHthfVwiXWAsXG4gICAgZ2V0UGFydGljdWxhckNlbGw6IChpZCx4LHksIGkpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke2lkfSA+IFtkYXRhLXg9XCIke01hdGgubWluKHgraSw5KX1cIl1bZGF0YS15PVwiJHt5fVwiXWApXG59XG5cblxuY2xhc3MgRG9tU2hpcFxue1xuICAgIGNvbnN0cnVjdG9yKGF4aXMsYSxiLGMpXG4gICAge1xuICAgICAgICB0aGlzLmF4aXMgPSBheGlzXG4gICAgICAgIHRoaXMuYSA9IGFcbiAgICAgICAgdGhpcy5iID0gYlxuICAgICAgICB0aGlzLmMgPSBjXG4gICAgfVxuXG4gICAgcHV0U2hpcChib2FyZCxzaGlwKVxuICAgIHtcbiAgICAgICAgZm9yKGxldCBpID0gdGhpcy5iOyBpPD10aGlzLmM7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5heGlzLndheU9mUHV0U2hpcChib2FyZCxzaGlwLHRoaXMuYSxpKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QXRyaWJ1dGVCeUF4aXMoaSlcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLmF4aXMud2F5T2ZEcmF3KHRoaXMuYSxpKVxuICAgIH1cbn1cblxuXG5jbGFzcyBHYW1lXG57XG4gICAgY29uc3RydWN0b3IoKVxuICAgIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJib2FyZCA9IG5ldyBEb21HYW1lYm9hcmQoXCJwbGF5ZXJcIiwgbmV3IFBsYXllcigpKVxuICAgICAgICB0aGlzLmNvbXB1dGVyYm9hcmQgPSBuZXcgRG9tR2FtZWJvYXJkKFwiY29tcHV0ZXJcIiwgbmV3IENvbXB1dGVyKCkpXG4gICAgICAgIHRoaXMuY2hvaWNlYm9hcmQgPSBuZXcgRG9tR2FtZWJvYXJkKFwiY2hvaWNlLWJvYXJkXCIsIG5ldyBQbGF5ZXIoKSlcbiAgICAgICAgdGhpcy5lbmRnYW1lTW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVuZC1nYW1lXCIpXG4gICAgICAgIHRoaXMuc3RhcnRnYW1lTW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXJ0LWdhbWVcIilcbiAgICAgICAgdGhpcy5yb3RhdGVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdGF0ZS1idG5cIilcbiAgICB9XG5cbiAgICBzaG93RW5kZ2FtZU1vZGFsKHdpbm5lcilcbiAgICB7XG4gICAgICAgIGNvbnN0IHdpbm5lclRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndpbm5lclwiKVxuICAgICAgICBjb25zdCBuZXdHYW1lQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZ2FtZVwiKVxuICAgICAgICB0aGlzLmVuZGdhbWVNb2RhbC5zaG93TW9kYWwoKVxuICAgICAgICB3aW5uZXJUZXh0LnRleHRDb250ZW50ID0gYFRoZSB3aW5uZXIgaXMgJHt3aW5uZXJ9YFxuICAgICAgICBuZXdHYW1lQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCgpPT4gdGhpcy5yZXN0YXJ0R2FtZSgpKVxuICAgIH1cbiAgICBcbiAgICBjaGVja1N0YXR1c0dhbWUoKVxuICAgIHtcbiAgICAgICAgaWYodGhpcy5wbGF5ZXJib2FyZC5nZXRQbGF5ZXIoKS5pc0dhbWVPdmVyKCkpIHRoaXMuc2hvd0VuZGdhbWVNb2RhbChcIkNvbXB1dGVyXCIpXG4gICAgICAgIGVsc2UgaWYodGhpcy5jb21wdXRlcmJvYXJkLmdldFBsYXllcigpLmlzR2FtZU92ZXIoKSkgdGhpcy5zaG93RW5kZ2FtZU1vZGFsKFwiUGxheWVyXCIpXG4gICAgfVxuXG5cbiAgICBzdGFydEdhbWUoKVxuICAgIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJib2FyZC5nZW5lcmF0ZUdhbWVib2FyZCgpXG4gICAgICAgIHRoaXMuY29tcHV0ZXJib2FyZC5nZW5lcmF0ZUdhbWVib2FyZCgpXG5cbiAgICAgICAgdGhpcy5zdGFydFBsYXllckNob2ljZSgpXG4gICAgICAgIHRoaXMucHV0Q29tcHV0ZXJSYW5kb21TaGlwcygpXG4gICAgfVxuXG4gICAgc2V0TmV3Q2hvaWNlYm9hcmQoKVxuICAgIHtcbiAgICAgICAgdGhpcy5jaG9pY2Vib2FyZCA9IG5ldyBEb21HYW1lYm9hcmQoXCJjaG9pY2UtYm9hcmRcIiwgbmV3IFBsYXllcigpKVxuICAgIH1cblxuICAgIHN0YXJ0UGxheWVyQ2hvaWNlKClcbiAgICB7XG4gICAgICAgIHRoaXMucm90YXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKT0+IHRoaXMuY2hvaWNlYm9hcmQuY2hhbmdlQXhpcygpKVxuICAgICAgICB0aGlzLnN0YXJ0Z2FtZU1vZGFsLnNob3dNb2RhbCgpXG4gICAgICAgIHRoaXMuY2hvaWNlYm9hcmQuZ2VuZXJhdGVHYW1lYm9hcmQoKVxuICAgICAgICB0aGlzLmNob2ljZWJvYXJkLmdldENlbGxzKCkuZm9yRWFjaChjZWxsID0+IGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCBlID0+e1xuICAgICAgICAgICAgdGhpcy5kcmF3VGVtcG9yYWxTaGlwKGUudGFyZ2V0KVxuICAgICAgICB9KSlcbiAgICBcbiAgICB9XG5cbiAgICBkcmF3VGVtcG9yYWxTaGlwKGNlbGwpXG4gICAge1xuICAgICAgICBjb25zdCBwcmVzZWxlY3RlZCA9IFtjZWxsXVxuICAgICAgICBjb25zdCB4ID0gdGhpcy5jaG9pY2Vib2FyZC5nZXRYKGNlbGwpXG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLmNob2ljZWJvYXJkLmdldFkoY2VsbClcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuY2hvaWNlYm9hcmQuZ2V0Q3VycmVudFNpemVTaGlwKClcbiAgICAgICAgZm9yKGxldCBpID0gMTsgaTwgc2l6ZTsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBjZWxsID0gdGhpcy5jaG9pY2Vib2FyZC5nZXRBY3R1YWxBeGlzKCkuZ2V0UGFydGljdWxhckNlbGwoXCJjaG9pY2UtYm9hcmRcIix4LHksaSlcbiAgICAgICAgICAgIHByZXNlbGVjdGVkLnB1c2goY2VsbClcbiAgICAgICAgfVxuICAgICAgICBwcmVzZWxlY3RlZC5mb3JFYWNoKGMgPT4gYy5jbGFzc0xpc3QuYWRkKFwicHJlc2VsZWN0ZWRcIikpXG4gICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsICgpID0+IHByZXNlbGVjdGVkLmZvckVhY2goYyA9PiBjLmNsYXNzTGlzdC5yZW1vdmUoXCJwcmVzZWxlY3RlZFwiKSkpXG4gICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsKCk9PnsgaWYodGhpcy5pc05vdEJ1c3kocHJlc2VsZWN0ZWQpKSB0aGlzLnNlbGVjdFNoaXAocHJlc2VsZWN0ZWQpfSlcbiAgICAgICAgaWYoc2l6ZSA9PT0gMCkgdGhpcy5maW5pc2hDaG9pY2UoKVxuICAgIH1cblxuICAgIHNlbGVjdFNoaXAoY2VsbExpc3QpXG4gICAge1xuICAgICAgICBjb25zdCBmaXJzdENlbGwgPSBjZWxsTGlzdC5hdCgwKVxuICAgICAgICBjb25zdCBsYXN0Q2VsbCA9IGNlbGxMaXN0LmF0KC0xKVxuICAgICAgICBjb25zdCBjb3JGaXJzdENlbGwgPSB0aGlzLmNob2ljZWJvYXJkLmdldENvcmRlbmF0ZXMoZmlyc3RDZWxsKVxuICAgICAgICBjb25zdCBjb3JMYXN0Q2VsbCA9IHRoaXMuY2hvaWNlYm9hcmQuZ2V0Q29yZGVuYXRlcyhsYXN0Q2VsbClcbiAgICAgICAgaWYoY29yRmlyc3RDZWxsLnkgPT09IGNvckxhc3RDZWxsLnkgJiYgdGhpcy5jaG9pY2Vib2FyZC5nZXRBY3R1YWxBeGlzKCkgPT09IGF4aXNYKSB0aGlzLmNob2ljZWJvYXJkLmNyZWF0ZVNoaXAobmV3IERvbVNoaXAoYXhpc1gsY29yRmlyc3RDZWxsLnksIGNvckZpcnN0Q2VsbC54LCBjb3JMYXN0Q2VsbC54KSlcbiAgICAgICAgZWxzZSBpZihjb3JGaXJzdENlbGwueCA9PT0gY29yTGFzdENlbGwueCAmJiB0aGlzLmNob2ljZWJvYXJkLmdldEFjdHVhbEF4aXMoKSA9PT0gYXhpc1kpIHRoaXMuY2hvaWNlYm9hcmQuY3JlYXRlU2hpcChuZXcgRG9tU2hpcChheGlzWSwgY29yRmlyc3RDZWxsLngsIGNvckZpcnN0Q2VsbC55LCBjb3JMYXN0Q2VsbC55KSlcbiAgICB9XG5cbiAgICBmaW5pc2hDaG9pY2UoKVxuICAgIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJib2FyZC5zZXREb21TaGlwcyh0aGlzLmNob2ljZWJvYXJkLmdldERvbVNoaXBzKCkpXG4gICAgICAgIHRoaXMuc3RhcnRnYW1lTW9kYWwuY2xvc2UoKVxuICAgICAgICB0aGlzLnBsYXllcmJvYXJkLnB1dEFsbERvbVNoaXBzKClcbiAgICB9XG5cbiAgICBpc05vdEJ1c3koY2VsbExpc3QpXG4gICAge1xuICAgICAgICBjb25zb2xlLmxvZyhjZWxsTGlzdClcbiAgICAgICAgcmV0dXJuIGNlbGxMaXN0LmV2ZXJ5KGNlbGwgPT4gIWNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2hpcFwiKSlcbiAgICB9XG5cbiAgICAgICAgcHV0Q29tcHV0ZXJSYW5kb21TaGlwcygpIHtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbURvbVNoaXBzID0gW107XG4gICAgICAgICAgICBjb25zdCBvY2N1cGllZENlbGxzID0gbmV3IFNldCgpOyAvLyBHdWFyZGFyw6EgbGFzIGNlbGRhcyBvY3VwYWRhcyBwb3IgYmFyY29zXG4gICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgc2hpcFNpemVzID0gWzUsIDQsIDMsIDMsIDJdO1xuICAgICAgICBcbiAgICAgICAgICAgIGZvciAobGV0IHNpemUgb2Ygc2hpcFNpemVzKSB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbGlkU2hpcDtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkU2hpcCA9IHRoaXMuZ2VuZXJhdGVWYWxpZFNoaXAoc2l6ZSwgb2NjdXBpZWRDZWxscyk7XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoIXZhbGlkU2hpcCk7IC8vIFNlIHJlcGl0ZSBoYXN0YSBlbmNvbnRyYXIgdW5hIHBvc2ljacOzbiB2w6FsaWRhXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIHJhbmRvbURvbVNoaXBzLnB1c2godmFsaWRTaGlwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyYW5kb21Eb21TaGlwcyk7XG4gICAgICAgICAgICB0aGlzLmNvbXB1dGVyYm9hcmQuc2V0RG9tU2hpcHMocmFuZG9tRG9tU2hpcHMpO1xuICAgICAgICAgICAgdGhpcy5jb21wdXRlcmJvYXJkLnB1dEFsbERvbVNoaXBzKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGdlbmVyYXRlVmFsaWRTaGlwKHNpemUsIG9jY3VwaWVkQ2VsbHMpIHtcbiAgICAgICAgICAgIGxldCBheGlzLCBhLCBiLCBjLCB4LCB5O1xuICAgICAgICAgICAgbGV0IGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgICAgICB3aGlsZSAoIWlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICBheGlzID0gdGhpcy5nZXRSYW5kb21BeGlzKCk7XG4gICAgICAgICAgICAgICAgaWYgKGF4aXMgPT09IGF4aXNYKSB7IFxuICAgICAgICAgICAgICAgICAgICB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgICAgICAgICAgICAgICB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDEwIC0gc2l6ZSkpOyAvLyBFdml0YSBzYWxpciBkZWwgdGFibGVyb1xuICAgICAgICAgICAgICAgICAgICBhID0geDtcbiAgICAgICAgICAgICAgICAgICAgYiA9IHk7XG4gICAgICAgICAgICAgICAgICAgIGMgPSB5ICsgc2l6ZSAtIDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgXG4gICAgICAgICAgICAgICAgICAgIHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMTAgLSBzaXplKSk7XG4gICAgICAgICAgICAgICAgICAgIHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICAgICAgICAgICAgICAgIGEgPSB5O1xuICAgICAgICAgICAgICAgICAgICBiID0geDtcbiAgICAgICAgICAgICAgICAgICAgYyA9IHggKyBzaXplIC0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGlzVmFsaWQgPSB0aGlzLmlzUGxhY2VtZW50VmFsaWQoYXhpcywgYSwgYiwgYywgb2NjdXBpZWRDZWxscyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gUmVnaXN0cmFyIGxhcyBjZWxkYXMgb2N1cGFkYXNcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBiOyBpIDw9IGM7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGF4aXMgPT09IGF4aXNYID8gYCR7YX0tJHtpfWAgOiBgJHtpfS0ke2F9YDtcbiAgICAgICAgICAgICAgICBvY2N1cGllZENlbGxzLmFkZChrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBuZXcgRG9tU2hpcChheGlzLCBhLCBiLCBjKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaXNQbGFjZW1lbnRWYWxpZChheGlzLCBhLCBiLCBjLCBvY2N1cGllZENlbGxzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gYjsgaSA8PSBjOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBheGlzID09PSBheGlzWCA/IGAke2F9LSR7aX1gIDogYCR7aX0tJHthfWA7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIFZlcmlmaWNhIHNpIHlhIGhheSB1biBiYXJjbyBlbiBlc2EgY2VsZGFcbiAgICAgICAgICAgICAgICBpZiAob2NjdXBpZWRDZWxscy5oYXMoa2V5KSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBWZXJpZmljYSBzaSBoYXkgdW4gYmFyY28gZGVtYXNpYWRvIGNlcmNhICh1bmEgY2VsZGEgZGUgZGlzdGFuY2lhKVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzQWRqYWNlbnRPY2N1cGllZChheGlzLCBhLCBpLCBvY2N1cGllZENlbGxzKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgaXNBZGphY2VudE9jY3VwaWVkKGF4aXMsIHgsIHksIG9jY3VwaWVkQ2VsbHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbnMgPSBbXG4gICAgICAgICAgICAgICAgWzAsIDFdLCBbMCwgLTFdLCBbMSwgMF0sIFstMSwgMF0sIC8vIEFycmliYSwgYWJham8sIGl6cXVpZXJkYSwgZGVyZWNoYVxuICAgICAgICAgICAgICAgIFsxLCAxXSwgWzEsIC0xXSwgWy0xLCAxXSwgWy0xLCAtMV0gLy8gRGlhZ29uYWxlc1xuICAgICAgICAgICAgXTtcbiAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gZGlyZWN0aW9ucy5zb21lKChbZHgsIGR5XSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG54ID0geCArIGR4O1xuICAgICAgICAgICAgICAgIGNvbnN0IG55ID0geSArIGR5O1xuICAgICAgICAgICAgICAgIHJldHVybiBvY2N1cGllZENlbGxzLmhhcyhgJHtueH0tJHtueX1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgXG4gICAgZ2V0UmFuZG9tQXhpcygpXG4gICAge1xuICAgICAgICBjb25zdCByYW5kb21OdW0gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKVxuICAgICAgICBzd2l0Y2gocmFuZG9tTnVtKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF4aXNYXG4gICAgICAgICAgICBjYXNlIDE6IFxuICAgICAgICAgICAgICAgIHJldHVybiBheGlzWVxuICAgICAgICB9IFxuICAgIH1cblxuICAgIHJlc3RhcnRHYW1lKClcbiAgICB7XG4gICAgICAgIHRoaXMucGxheWVyYm9hcmQuY2xlYXJHYW1lYm9hcmQoKVxuICAgICAgICB0aGlzLmNvbXB1dGVyYm9hcmQuY2xlYXJHYW1lYm9hcmQoKVxuICAgICAgICB0aGlzLmNob2ljZWJvYXJkLmNsZWFyR2FtZWJvYXJkKClcbiAgICAgICAgdGhpcy5zZXROZXdDaG9pY2Vib2FyZCgpXG4gICAgICAgIHRoaXMuZW5kZ2FtZU1vZGFsLmNsb3NlKClcbiAgICAgICAgdGhpcy5zdGFydEdhbWUoKVxuICAgICAgICB0aGlzLnBsYXlHYW1lKClcblxuICAgICAgICB0aGlzLnJvdGF0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5jaG9pY2Vib2FyZC5jaGFuZ2VBeGlzKCkpXG4gICAgfVxuXG5cbiAgICBwbGF5R2FtZSgpXG4gICAge1xuICAgICAgICB0aGlzLmNvbXB1dGVyYm9hcmQuZ2V0Q2VsbHMoKS5mb3JFYWNoKGNlbGwgPT4gY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PntcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJib2FyZC5hdHRhY2sodGhpcy5jb21wdXRlcmJvYXJkLGUudGFyZ2V0KVxuICAgICAgICAgICAgdGhpcy5jb21wdXRlcmJvYXJkLmF0dGFjayh0aGlzLnBsYXllcmJvYXJkKVxuICAgICAgICAgICAgdGhpcy5jaGVja1N0YXR1c0dhbWUoKVxuICAgICAgICB9KSlcbiAgICB9XG59XG5cbmNsYXNzIERvbUdhbWVib2FyZCBcbntcbiAgICBjb25zdHJ1Y3RvcihpZCwgdHlwZSl7XG4gICAgICAgIHRoaXMucGxheWVyID0gdHlwZVxuICAgICAgICB0aGlzLmRvbUdhbWVib2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxuICAgICAgICB0aGlzLmNlbGxzID0gW11cbiAgICAgICAgdGhpcy5kb21TaGlwcyA9IFtdXG4gICAgICAgIHRoaXMub3JkZXJPZlNoaXBzID0gWzUsNCwzLDMsMiwwXVxuICAgICAgICB0aGlzLmlkID0gaWRcbiAgICAgICAgdGhpcy5hY3R1YWxBeGlzID0gYXhpc1hcbiAgICB9XG5cbiAgICBnZW5lcmF0ZUdhbWVib2FyZCgpIHtcbiAgICAgICAgY29uc3Qgcm93cyA9IHRoaXMucGxheWVyLmdldEdhbWVib2FyZCgpLmdldFJvd3MoKVxuICAgICAgICBjb25zdCBjb2x1bW5zID0gdGhpcy5wbGF5ZXIuZ2V0R2FtZWJvYXJkKCkuZ2V0Q29sdW1ucygpXG4gICAgICAgIGZvcihsZXQgeSA9IDA7IHk8Y29sdW1uczsgeSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IobGV0IHggPSAwOyB4PHJvd3M7IHgrKylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NOYW1lID0gXCJjZWxsXCIgKyBcIiBcIiArIHRoaXMucGxheWVyLnR5cGVPZk15Q2VsbHMoKVxuICAgICAgICAgICAgICAgIGNlbGwuZGF0YXNldC54ID0geFxuICAgICAgICAgICAgICAgIGNlbGwuZGF0YXNldC55ID0geVxuICAgICAgICAgICAgICAgIHRoaXMuZG9tR2FtZWJvYXJkLmFwcGVuZENoaWxkKGNlbGwpXG4gICAgICAgICAgICAgICAgdGhpcy5jZWxscy5wdXNoKGNlbGwpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFBsYXllcigpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXJcbiAgICB9XG5cbiAgICBnZXRDZWxscygpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5jZWxsc1xuICAgIH1cblxuICAgIGdldEN1cnJlbnRTaXplU2hpcCgpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5vcmRlck9mU2hpcHNbdGhpcy5kb21TaGlwcy5sZW5ndGhdXG4gICAgfVxuXG4gICAgZ2V0RG9tU2hpcHMoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9tU2hpcHNcbiAgICB9XG5cbiAgICBzZXREb21TaGlwcyhuZXdEb21TaGlwcylcbiAgICB7XG4gICAgICAgIHRoaXMuZG9tU2hpcHMgPSBuZXdEb21TaGlwc1xuICAgIH1cblxuICAgIGNyZWF0ZVNoaXAoZG9tU2hpcClcbiAgICB7XG4gICAgICAgIHRoaXMuZHJhd1NoaXAoZG9tU2hpcClcbiAgICAgICAgdGhpcy5wbGF5ZXIuYWRkU2hpcChkb21TaGlwKVxuICAgICAgICB0aGlzLmRvbVNoaXBzLnB1c2goZG9tU2hpcClcbiAgICB9XG5cbiAgICBwdXRBbGxEb21TaGlwcygpXG4gICAge1xuICAgICAgICB0aGlzLmRvbVNoaXBzLmZvckVhY2goZG9tU2hpcCA9PiB0aGlzLmNyZWF0ZVNoaXAoZG9tU2hpcCkpXG4gICAgfVxuXG4gICAgZ2V0QWN0dWFsQXhpcygpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5hY3R1YWxBeGlzXG4gICAgfVxuXG4gICAgY2hhbmdlQXhpcygpXG4gICAge1xuICAgICAgICBpZih0aGlzLmFjdHVhbEF4aXMgPT09IGF4aXNYKSB0aGlzLmFjdHVhbEF4aXMgPSBheGlzWVxuICAgICAgICBlbHNlIGlmKCB0aGlzLmFjdHVhbEF4aXMgPT09IGF4aXNZKSB0aGlzLmFjdHVhbEF4aXMgPSBheGlzWFxuICAgIH1cblxuICAgIGdldFgodGFyZ2V0KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIE51bWJlcih0YXJnZXQuZGF0YXNldC54KVxuICAgIH1cblxuICAgIGdldFkodGFyZ2V0KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIE51bWJlcih0YXJnZXQuZGF0YXNldC55KVxuICAgIH1cblxuICAgIGdldENvcmRlbmF0ZXModGFyZ2V0KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHt4OnRoaXMuZ2V0WCh0YXJnZXQpLCB5OiB0aGlzLmdldFkodGFyZ2V0KX1cbiAgICB9XG5cbiAgICBkcmF3U2hpcChkb21TaGlwKVxuICAgIHtcbiAgICAgICAgZm9yKGxldCBpID0gZG9tU2hpcC5iOyBpPD1kb21TaGlwLmM7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke3RoaXMuaWR9ID4gJHtkb21TaGlwLmdldEF0cmlidXRlQnlBeGlzKGkpfWApXG4gICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpXG4gICAgICAgIH1cbiAgICB9XG4gICAgYXR0YWNrKGVuZW15LCB0YXJnZXQgPSBudWxsKVxuICAgIHtcbiAgICAgICAgY29uc3QgY2VsbCA9IHRoaXMucGxheWVyLmdldFdheU9mQXR0YWNrKCkuYXR0YWNrKHRhcmdldClcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZW5lbXkuZ2V0UGxheWVyKCkucmVjaXZlQXR0YWNrKHRoaXMuZ2V0WChjZWxsKSx0aGlzLmdldFkoY2VsbCkpXG4gICAgICAgIHJlc3VsdD8gY2VsbC5jbGFzc0xpc3QuYWRkKFwiYXR0YWNrZWRcIik6IGNlbGwuY2xhc3NMaXN0LmFkZChcImZhaWxcIilcbiAgICB9XG5cbiAgICBjbGVhckdhbWVib2FyZCgpXG4gICAge1xuICAgICAgICB0aGlzLmRvbUdhbWVib2FyZC5pbm5lckhUTUwgPSBcIlwiXG4gICAgfVxufVxuXG5jb25zdCBjb21wdXRlckF0dGFjayA9IFxue1xuICAgIHBhc3RDb3JkZW5hdGVzIDogW10sXG4gICAgZ2V0UmFuZG9tQ29yZGFuYXRlcyA6ICgpID0+XG4gICAge1xuICAgICAgICBjb25zdCB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMClcbiAgICAgICAgY29uc3QgY29yZGVuYXRlcyA9IHt4LHl9XG4gICAgICAgIGlmKGNvbXB1dGVyQXR0YWNrLnBhc3RDb3JkZW5hdGVzLmluY2x1ZGVzKGNvcmRlbmF0ZXMpKSB0aGlzLmdldFJhbmRvbUNvcmRhbmF0ZXMoKVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbXB1dGVyQXR0YWNrLnBhc3RDb3JkZW5hdGVzLnB1c2goY29yZGVuYXRlcylcbiAgICAgICAgICAgIHJldHVybiBjb3JkZW5hdGVzXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGF0dGFjayA6ICh0YXJnZXQpID0+IFxuICAgIHtcbiAgICAgICAgY29uc3QgY29yZGVuYXRlcyA9IGNvbXB1dGVyQXR0YWNrLmdldFJhbmRvbUNvcmRhbmF0ZXMoKVxuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYXllciA+IFtkYXRhLXg9XCIke2NvcmRlbmF0ZXMueH1cIl1bZGF0YS15PVwiJHtjb3JkZW5hdGVzLnl9XCJdYClcbiAgICB9XG59XG5cbmNvbnN0IHBsYXllckF0dGFjayA9IFxue1xuICAgIGF0dGFjazogKHRhcmdldCkgPT4gdGFyZ2V0XG59XG5cblxuZXhwb3J0ICB7R2FtZSwgcGxheWVyQXR0YWNrLCBjb21wdXRlckF0dGFja30iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4vZG9tXCI7XG5pbXBvcnQgJy4vc3R5bGUuY3NzJ1xuXG5mdW5jdGlvbiBnYW1lKClcbntcbiAgICBjb25zdCBuZXdHYW1lID0gbmV3IEdhbWUoKVxuICAgIG5ld0dhbWUuc3RhcnRHYW1lKClcbiAgICBuZXdHYW1lLnBsYXlHYW1lKClcbn1cblxuZ2FtZSgpIiwiaW1wb3J0IHsgcGxheWVyQXR0YWNrLCBjb21wdXRlckF0dGFjayB9IGZyb20gXCIuL2RvbVwiXG5cbmNsYXNzIFNoaXBcbntcbiAgICBjb25zdHJ1Y3RvcihsZW5ndGgpXG4gICAge1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aFxuICAgICAgICB0aGlzLmhpdHMgPSAwXG4gICAgfVxuXG4gICAgaGl0KClcbiAgICB7XG4gICAgICAgIHRoaXMuaGl0cyArPSAxIFxuICAgIH1cblxuICAgIGlzU3VuaygpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5sZW5ndGggPD0gdGhpcy5oaXRzXG4gICAgfVxufVxuXG5jbGFzcyBHYW1lYm9hcmRcbntcbiAgICBjb25zdHJ1Y3RvcihjID0gMTAsciA9IDEwKVxuICAgIHtcbiAgICAgICAgdGhpcy5ib2FyZCA9IHRoaXMubmV3Qm9hcmQoYyxyKVxuICAgICAgICB0aGlzLmNvbHVtbnMgPSBjXG4gICAgICAgIHRoaXMucm93cyA9IHJcbiAgICAgICAgdGhpcy5sYXN0TWlzc2VkU2hvdCA9IFtdXG4gICAgICAgIHRoaXMuYW1vdW50T2ZTaGlwID0gMFxuICAgIH1cblxuICAgIGdldENvbHVtbnMoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uc1xuICAgIH1cblxuICAgIGdldFJvd3MoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucm93c1xuICAgIH1cblxuICAgIG5ld0JvYXJkKGMscilcbiAgICB7XG4gICAgICAgIGxldCBib2FyZCA9IG5ldyBBcnJheShjKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjOyBpKyspIHtcbiAgICAgICAgICAgIGJvYXJkW2ldID0gbmV3IEFycmF5KHIpLmZpbGwoMCk7IFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBib2FyZDtcbiAgICB9XG5cbiAgICBjaGFuZ2VBeGlzKClcbiAgICB7XG4gICAgICAgIHRoaXMuaXNUaGVBY3R1YWxBeGlzWCA9ICF0aGlzLmlzVGhlQWN0dWFsQXhpc1hcbiAgICB9XG5cbiAgICBjaGFuZ2VUaGVBbW91bnRPZlNoaXAobilcbiAgICB7XG4gICAgICAgIHRoaXMuYW1vdW50T2ZTaGlwICs9IG5cbiAgICB9XG5cbiAgICBpbnNzZXJ0U2hpcEluKGNvcmRlbmF0ZXMpXG4gICAge1xuICAgICAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAoY29yZGVuYXRlcy5jIC0gY29yZGVuYXRlcy5iICsgMSlcbiAgICAgICAgY29yZGVuYXRlcy5wdXRTaGlwKHRoaXMuYm9hcmQsIHNoaXApXG4gICAgICAgIHRoaXMuY2hhbmdlVGhlQW1vdW50T2ZTaGlwKDEpXG4gICAgfVxuXG4gICAgdGhlcmVJc1NoaXBJbih4LHkpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5ib2FyZFt4XVt5XSAhPT0gMFxuICAgIH1cbiAgICBcbiAgICByZWNpdmVBdHRhY2soeCx5KVxuICAgIHtcbiAgICAgICAgdGhpcy5ib2FyZFt4XVt5XS5oaXQoKVxuICAgICAgICBpZih0aGlzLmJvYXJkW3hdW3ldLmlzU3VuaygpKSB0aGlzLmNoYW5nZVRoZUFtb3VudE9mU2hpcCgtMSkgXG4gICAgfVxuXG4gICAgaXNBbGxUaGVTaGlwc1N1bmsoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW1vdW50T2ZTaGlwID09PSAwXG4gICAgfVxufVxuXG5jbGFzcyBQbGF5ZXJcbntcbiAgICBjb25zdHJ1Y3RvcigpXG4gICAge1xuICAgICAgICB0aGlzLmdhbWVib2FyZCA9IG5ldyBHYW1lYm9hcmQoKVxuICAgICAgICB0aGlzLndheU9mQXR0YWNrID0gcGxheWVyQXR0YWNrXG4gICAgfVxuXG4gICAgcmVjaXZlQXR0YWNrKHgseSlcbiAgICB7XG4gICAgICAgIGNvbnN0IGlzUG9zaWJsZVRoZUF0dGFjayA9IHRoaXMuZ2FtZWJvYXJkLnRoZXJlSXNTaGlwSW4oeCx5KVxuICAgICAgICBpZihpc1Bvc2libGVUaGVBdHRhY2spIHRoaXMuZ2FtZWJvYXJkLnJlY2l2ZUF0dGFjayh4LHkpXG4gICAgICAgIHJldHVybiBpc1Bvc2libGVUaGVBdHRhY2tcbiAgICB9XG5cbiAgICBhZGRTaGlwKGNvcmRlbmF0ZXMpXG4gICAge1xuICAgICAgICB0aGlzLmdhbWVib2FyZC5pbnNzZXJ0U2hpcEluKGNvcmRlbmF0ZXMpXG4gICAgfVxuXG4gICAgZ2V0R2FtZWJvYXJkKClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLmdhbWVib2FyZFxuICAgIH1cblxuICAgIGlzR2FtZU92ZXIoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FtZWJvYXJkLmlzQWxsVGhlU2hpcHNTdW5rKClcbiAgICB9XG5cbiAgICB0eXBlT2ZNeUNlbGxzKClcbiAgICB7XG4gICAgICAgIHJldHVybiBcIlwiXG4gICAgfVxuXG4gICAgZ2V0V2F5T2ZBdHRhY2soKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2F5T2ZBdHRhY2tcbiAgICB9XG59XG5cbmNsYXNzIENvbXB1dGVyIGV4dGVuZHMgUGxheWVyXG57XG4gICAgY29uc3RydWN0b3IoKVxuICAgIHtcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICB0aGlzLndheU9mQXR0YWNrID0gY29tcHV0ZXJBdHRhY2tcbiAgICB9XG5cbiAgICB0eXBlT2ZNeUNlbGxzKClcbiAgICB7XG4gICAgICAgIHJldHVybiBcImVuZW15XCJcbiAgICB9XG59XG5cbmV4cG9ydCB7U2hpcCxHYW1lYm9hcmQsIFBsYXllciwgQ29tcHV0ZXJ9IiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiQGltcG9ydCB1cmwoaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1Sb2JvdG86d2dodEAzMDA7NDAwOzUwMDs3MDA7OTAwJmRpc3BsYXk9c3dhcCk7XCJdKTtcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCJAaW1wb3J0IHVybChodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PUJlYmFzK05ldWUmZmFtaWx5PUJpZytTaG91bGRlcnMrU3RlbmNpbDpvcHN6LHdnaHRAMTAuLjcyLDEwMC4uOTAwJmZhbWlseT1OZXcrQW1zdGVyZGFtJmRpc3BsYXk9c3dhcCk7XCJdKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgKlxue1xuICAgIHBhZGRpbmc6IDA7XG4gICAgbWFyZ2luOiAwO1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgZm9udC1mYW1pbHk6ICdSb2JvdG8nLCBzYW5zLXNlcmlmO1xufVxuXG5ib2R5XG57XG4gICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XG59XG5cbm1haW5cbntcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDpjZW50ZXI7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBoZWlnaHQ6IDcwdmg7XG4gICAgZ2FwOiAxMnZ3O1xufVxuXG4uZ2FtZWJvYXJkXG57XG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCw0MHB4KTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB3aGl0ZTtcbn1cblxuLmNlbGxcbntcbiAgICB3aWR0aDogNDBweDtcbiAgICBoZWlnaHQ6IDQwcHg7XG4gICAgYm9yZGVyOiAycHggd2hpdGUgc29saWQ7XG59XG5cbi5zaGlwXG57XG4gICAgYmFja2dyb3VuZC1jb2xvcjogZ3JheTtcbn1cblxuXG4uZW5lbXlcbntcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcbn1cblxuLmVuZW15OmhvdmVyXG57XG4gICAgYmFja2dyb3VuZC1jb2xvcjogZ3JheTtcbiAgICBvcGFjaXR5OiAuNjtcbn1cblxuLmF0dGFja2VkXG57XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xufVxuXG4uZmFpbFxue1xuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyNTUsIDI1NSwgMjU1KTtcbn1cblxuLmZhaWwsLmF0dGFja2VkXG57XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG59XG5cbiNlbmQtZ2FtZSwgI3N0YXJ0LWdhbWVcbntcbiAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgdG9wOiA0NSU7XG4gICAgbGVmdDogNTAlO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xuXG4gICAgd2lkdGg6IDMwMHB4O1xuICAgIHBhZGRpbmc6IDJ2aCAydnc7XG4gICAgYm9yZGVyLXJhZGl1czogMXJlbTtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgYm94LXNoYWRvdzogMCAwIDFlbSBibGFjaztcbn1cblxuI2VuZC1nYW1lID4gc2VjdGlvbiwgI3N0YXJ0LWdhbWUgPiBzZWN0aW9uXG57XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgZ2FwOiAxMHB4O1xufVxuXG5cbmRpYWxvZzo6YmFja2Ryb3AgXG57XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjYpO1xufVxuXG4jbmV3LWdhbWUsICNyb3RhdGUtYnRuXG57XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgaGVpZ2h0OiA1dmg7XG4gICAgd2lkdGg6IDEwdnc7XG4gICAgYWxpZ24tc2VsZjogY2VudGVyO1xuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgIGZvbnQtc2l6ZTogMXJlbTtcbn1cblxuI3JvdGF0ZS1idG5cbntcbiAgICB3aWR0aDogMTAwcHg7XG4gICAgZm9udC1zaXplOiAxLjRyZW07XG4gICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG4gICAgY29sb3I6IGJsYWNrO1xuICAgIGJvcmRlcjogbm9uZTtcbn1cblxuI3JvdGF0ZS1idG46aG92ZXJcbntcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmF5O1xuICAgIGNvbG9yOiB3aGl0ZTtcbn1cblxuI25ldy1nYW1lOmhvdmVyXG57XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDcxLCA3MSwgNzEpO1xufVxuXG4jd2lubmVyXG57XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIGZvbnQtc2l6ZTogMS40cmVtO1xuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xufVxuXG4jc3RhcnQtZ2FtZVxue1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcbiAgICBwYWRkaW5nOiAzMHB4O1xuICAgIHdpZHRoOiA1MDBweDtcbn1cblxuI3N0YXJ0LWdhbWUgPiBzZWN0aW9uXG57XG4gICAgZ2FwOiAyNXB4O1xufVxuXG4ucHJlc2VsZWN0ZWRcbntcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbn1cblxuaGVhZGVyXG57XG4gICAgaGVpZ2h0OiAyMHZoO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgYWxpZ24taXRlbXM6IGVuZDtcbiAgICBmb250LXNpemU6IDRyZW07XG5cbn1cblxuaDFcbntcbiAgICBmb250LWZhbWlseTogXCJCaWcgU2hvdWxkZXJzIFN0ZW5jaWxcIiwgc2Fucy1zZXJpZjtcbiAgICBmb250LW9wdGljYWwtc2l6aW5nOiBhdXRvO1xuICAgIGZvbnQtd2VpZ2h0OiA5MDA7XG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xuICAgIGNvbG9yOiB3aGl0ZTtcbn1cblxubWFpbiA+IHNlY3Rpb25cbntcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDIwcHg7XG59XG5oMlxue1xuICAgIGZvbnQtZmFtaWx5OiBcIkJpZyBTaG91bGRlcnMgU3RlbmNpbFwiLCBzYW5zLXNlcmlmO1xuICAgIGZvbnQtb3B0aWNhbC1zaXppbmc6IGF1dG87XG4gICAgZm9udC13ZWlnaHQ6IDkwMDtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgZm9udC1zaXplOiAycmVtO1xufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFHQTs7SUFFSSxVQUFVO0lBQ1YsU0FBUztJQUNULHNCQUFzQjtJQUN0QixpQ0FBaUM7QUFDckM7O0FBRUE7O0lBRUksdUJBQXVCO0FBQzNCOztBQUVBOztJQUVJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25CLFlBQVk7SUFDWixTQUFTO0FBQ2I7O0FBRUE7O0lBRUksYUFBYTtJQUNiLHNDQUFzQztJQUN0Qyx1QkFBdUI7QUFDM0I7O0FBRUE7O0lBRUksV0FBVztJQUNYLFlBQVk7SUFDWix1QkFBdUI7QUFDM0I7O0FBRUE7O0lBRUksc0JBQXNCO0FBQzFCOzs7QUFHQTs7SUFFSSx1QkFBdUI7QUFDM0I7O0FBRUE7O0lBRUksc0JBQXNCO0lBQ3RCLFdBQVc7QUFDZjs7QUFFQTs7SUFFSSxxQkFBcUI7QUFDekI7O0FBRUE7O0lBRUksb0NBQW9DO0FBQ3hDOztBQUVBOztJQUVJLG9CQUFvQjtBQUN4Qjs7QUFFQTs7SUFFSSxlQUFlO0lBQ2YsUUFBUTtJQUNSLFNBQVM7SUFDVCxnQ0FBZ0M7O0lBRWhDLFlBQVk7SUFDWixnQkFBZ0I7SUFDaEIsbUJBQW1CO0lBQ25CLFlBQVk7SUFDWix5QkFBeUI7QUFDN0I7O0FBRUE7O0lBRUksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsdUJBQXVCO0lBQ3ZCLFNBQVM7QUFDYjs7O0FBR0E7O0lBRUksb0NBQW9DO0FBQ3hDOztBQUVBOztJQUVJLFlBQVk7SUFDWixrQkFBa0I7SUFDbEIsdUJBQXVCO0lBQ3ZCLFlBQVk7SUFDWixXQUFXO0lBQ1gsV0FBVztJQUNYLGtCQUFrQjtJQUNsQixpQkFBaUI7SUFDakIsZUFBZTtBQUNuQjs7QUFFQTs7SUFFSSxZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLHVCQUF1QjtJQUN2QixZQUFZO0lBQ1osWUFBWTtBQUNoQjs7QUFFQTs7SUFFSSxzQkFBc0I7SUFDdEIsWUFBWTtBQUNoQjs7QUFFQTs7SUFFSSxpQ0FBaUM7QUFDckM7O0FBRUE7O0lBRUksa0JBQWtCO0lBQ2xCLGlCQUFpQjtJQUNqQixpQkFBaUI7QUFDckI7O0FBRUE7O0lBRUksWUFBWTtJQUNaLHVCQUF1QjtJQUN2QixhQUFhO0lBQ2IsWUFBWTtBQUNoQjs7QUFFQTs7SUFFSSxTQUFTO0FBQ2I7O0FBRUE7O0lBRUksdUJBQXVCO0FBQzNCOztBQUVBOztJQUVJLFlBQVk7SUFDWixhQUFhO0lBQ2IsdUJBQXVCO0lBQ3ZCLGdCQUFnQjtJQUNoQixlQUFlOztBQUVuQjs7QUFFQTs7SUFFSSxnREFBZ0Q7SUFDaEQseUJBQXlCO0lBQ3pCLGdCQUFnQjtJQUNoQixrQkFBa0I7SUFDbEIsWUFBWTtBQUNoQjs7QUFFQTs7SUFFSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLG1CQUFtQjtJQUNuQixTQUFTO0FBQ2I7QUFDQTs7SUFFSSxnREFBZ0Q7SUFDaEQseUJBQXlCO0lBQ3pCLGdCQUFnQjtJQUNoQixZQUFZO0lBQ1osZUFBZTtBQUNuQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAaW1wb3J0IHVybCgnaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1Sb2JvdG86d2dodEAzMDA7NDAwOzUwMDs3MDA7OTAwJmRpc3BsYXk9c3dhcCcpO1xcbkBpbXBvcnQgdXJsKCdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PUJlYmFzK05ldWUmZmFtaWx5PUJpZytTaG91bGRlcnMrU3RlbmNpbDpvcHN6LHdnaHRAMTAuLjcyLDEwMC4uOTAwJmZhbWlseT1OZXcrQW1zdGVyZGFtJmRpc3BsYXk9c3dhcCcpO1xcblxcbipcXG57XFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIG1hcmdpbjogMDtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgZm9udC1mYW1pbHk6ICdSb2JvdG8nLCBzYW5zLXNlcmlmO1xcbn1cXG5cXG5ib2R5XFxue1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcXG59XFxuXFxubWFpblxcbntcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAganVzdGlmeS1jb250ZW50OmNlbnRlcjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgaGVpZ2h0OiA3MHZoO1xcbiAgICBnYXA6IDEydnc7XFxufVxcblxcbi5nYW1lYm9hcmRcXG57XFxuICAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLDQwcHgpO1xcbiAgICBib3JkZXI6IDFweCBzb2xpZCB3aGl0ZTtcXG59XFxuXFxuLmNlbGxcXG57XFxuICAgIHdpZHRoOiA0MHB4O1xcbiAgICBoZWlnaHQ6IDQwcHg7XFxuICAgIGJvcmRlcjogMnB4IHdoaXRlIHNvbGlkO1xcbn1cXG5cXG4uc2hpcFxcbntcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogZ3JheTtcXG59XFxuXFxuXFxuLmVuZW15XFxue1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcXG59XFxuXFxuLmVuZW15OmhvdmVyXFxue1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmF5O1xcbiAgICBvcGFjaXR5OiAuNjtcXG59XFxuXFxuLmF0dGFja2VkXFxue1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XFxufVxcblxcbi5mYWlsXFxue1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjU1LCAyNTUsIDI1NSk7XFxufVxcblxcbi5mYWlsLC5hdHRhY2tlZFxcbntcXG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxufVxcblxcbiNlbmQtZ2FtZSwgI3N0YXJ0LWdhbWVcXG57XFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXG4gICAgdG9wOiA0NSU7XFxuICAgIGxlZnQ6IDUwJTtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuXFxuICAgIHdpZHRoOiAzMDBweDtcXG4gICAgcGFkZGluZzogMnZoIDJ2dztcXG4gICAgYm9yZGVyLXJhZGl1czogMXJlbTtcXG4gICAgYm9yZGVyOiBub25lO1xcbiAgICBib3gtc2hhZG93OiAwIDAgMWVtIGJsYWNrO1xcbn1cXG5cXG4jZW5kLWdhbWUgPiBzZWN0aW9uLCAjc3RhcnQtZ2FtZSA+IHNlY3Rpb25cXG57XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBnYXA6IDEwcHg7XFxufVxcblxcblxcbmRpYWxvZzo6YmFja2Ryb3AgXFxue1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNik7XFxufVxcblxcbiNuZXctZ2FtZSwgI3JvdGF0ZS1idG5cXG57XFxuICAgIGJvcmRlcjogbm9uZTtcXG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcXG4gICAgY29sb3I6IHdoaXRlO1xcbiAgICBoZWlnaHQ6IDV2aDtcXG4gICAgd2lkdGg6IDEwdnc7XFxuICAgIGFsaWduLXNlbGY6IGNlbnRlcjtcXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICAgIGZvbnQtc2l6ZTogMXJlbTtcXG59XFxuXFxuI3JvdGF0ZS1idG5cXG57XFxuICAgIHdpZHRoOiAxMDBweDtcXG4gICAgZm9udC1zaXplOiAxLjRyZW07XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcbiAgICBjb2xvcjogYmxhY2s7XFxuICAgIGJvcmRlcjogbm9uZTtcXG59XFxuXFxuI3JvdGF0ZS1idG46aG92ZXJcXG57XFxuICAgIGJhY2tncm91bmQtY29sb3I6IGdyYXk7XFxuICAgIGNvbG9yOiB3aGl0ZTtcXG59XFxuXFxuI25ldy1nYW1lOmhvdmVyXFxue1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoNzEsIDcxLCA3MSk7XFxufVxcblxcbiN3aW5uZXJcXG57XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgZm9udC1zaXplOiAxLjRyZW07XFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xcbn1cXG5cXG4jc3RhcnQtZ2FtZVxcbntcXG4gICAgY29sb3I6IHdoaXRlO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcXG4gICAgcGFkZGluZzogMzBweDtcXG4gICAgd2lkdGg6IDUwMHB4O1xcbn1cXG5cXG4jc3RhcnQtZ2FtZSA+IHNlY3Rpb25cXG57XFxuICAgIGdhcDogMjVweDtcXG59XFxuXFxuLnByZXNlbGVjdGVkXFxue1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG59XFxuXFxuaGVhZGVyXFxue1xcbiAgICBoZWlnaHQ6IDIwdmg7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBhbGlnbi1pdGVtczogZW5kO1xcbiAgICBmb250LXNpemU6IDRyZW07XFxuXFxufVxcblxcbmgxXFxue1xcbiAgICBmb250LWZhbWlseTogXFxcIkJpZyBTaG91bGRlcnMgU3RlbmNpbFxcXCIsIHNhbnMtc2VyaWY7XFxuICAgIGZvbnQtb3B0aWNhbC1zaXppbmc6IGF1dG87XFxuICAgIGZvbnQtd2VpZ2h0OiA5MDA7XFxuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcXG4gICAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG5tYWluID4gc2VjdGlvblxcbntcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgZ2FwOiAyMHB4O1xcbn1cXG5oMlxcbntcXG4gICAgZm9udC1mYW1pbHk6IFxcXCJCaWcgU2hvdWxkZXJzIFN0ZW5jaWxcXFwiLCBzYW5zLXNlcmlmO1xcbiAgICBmb250LW9wdGljYWwtc2l6aW5nOiBhdXRvO1xcbiAgICBmb250LXdlaWdodDogOTAwO1xcbiAgICBjb2xvcjogd2hpdGU7XFxuICAgIGZvbnQtc2l6ZTogMnJlbTtcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5vcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiXSwibmFtZXMiOlsiUGxheWVyIiwiQ29tcHV0ZXIiLCJheGlzWSIsIndheU9mUHV0U2hpcCIsImJvYXJkIiwic2hpcCIsImEiLCJpIiwid2F5T2ZEcmF3IiwiZ2V0UGFydGljdWxhckNlbGwiLCJpZCIsIngiLCJ5IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiTWF0aCIsIm1pbiIsImF4aXNYIiwiRG9tU2hpcCIsImNvbnN0cnVjdG9yIiwiYXhpcyIsImIiLCJjIiwicHV0U2hpcCIsImdldEF0cmlidXRlQnlBeGlzIiwiR2FtZSIsInBsYXllcmJvYXJkIiwiRG9tR2FtZWJvYXJkIiwiY29tcHV0ZXJib2FyZCIsImNob2ljZWJvYXJkIiwiZW5kZ2FtZU1vZGFsIiwiZ2V0RWxlbWVudEJ5SWQiLCJzdGFydGdhbWVNb2RhbCIsInJvdGF0ZUJ0biIsInNob3dFbmRnYW1lTW9kYWwiLCJ3aW5uZXIiLCJ3aW5uZXJUZXh0IiwibmV3R2FtZUJ0biIsInNob3dNb2RhbCIsInRleHRDb250ZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlc3RhcnRHYW1lIiwiY2hlY2tTdGF0dXNHYW1lIiwiZ2V0UGxheWVyIiwiaXNHYW1lT3ZlciIsInN0YXJ0R2FtZSIsImdlbmVyYXRlR2FtZWJvYXJkIiwic3RhcnRQbGF5ZXJDaG9pY2UiLCJwdXRDb21wdXRlclJhbmRvbVNoaXBzIiwic2V0TmV3Q2hvaWNlYm9hcmQiLCJjaGFuZ2VBeGlzIiwiZ2V0Q2VsbHMiLCJmb3JFYWNoIiwiY2VsbCIsImUiLCJkcmF3VGVtcG9yYWxTaGlwIiwidGFyZ2V0IiwicHJlc2VsZWN0ZWQiLCJnZXRYIiwiZ2V0WSIsInNpemUiLCJnZXRDdXJyZW50U2l6ZVNoaXAiLCJnZXRBY3R1YWxBeGlzIiwicHVzaCIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsImlzTm90QnVzeSIsInNlbGVjdFNoaXAiLCJmaW5pc2hDaG9pY2UiLCJjZWxsTGlzdCIsImZpcnN0Q2VsbCIsImF0IiwibGFzdENlbGwiLCJjb3JGaXJzdENlbGwiLCJnZXRDb3JkZW5hdGVzIiwiY29yTGFzdENlbGwiLCJjcmVhdGVTaGlwIiwic2V0RG9tU2hpcHMiLCJnZXREb21TaGlwcyIsImNsb3NlIiwicHV0QWxsRG9tU2hpcHMiLCJjb25zb2xlIiwibG9nIiwiZXZlcnkiLCJjb250YWlucyIsInJhbmRvbURvbVNoaXBzIiwib2NjdXBpZWRDZWxscyIsIlNldCIsInNoaXBTaXplcyIsInZhbGlkU2hpcCIsImdlbmVyYXRlVmFsaWRTaGlwIiwiaXNWYWxpZCIsImdldFJhbmRvbUF4aXMiLCJmbG9vciIsInJhbmRvbSIsImlzUGxhY2VtZW50VmFsaWQiLCJrZXkiLCJoYXMiLCJpc0FkamFjZW50T2NjdXBpZWQiLCJkaXJlY3Rpb25zIiwic29tZSIsIl9yZWYiLCJkeCIsImR5IiwibngiLCJueSIsInJhbmRvbU51bSIsImNsZWFyR2FtZWJvYXJkIiwicGxheUdhbWUiLCJhdHRhY2siLCJ0eXBlIiwicGxheWVyIiwiZG9tR2FtZWJvYXJkIiwiY2VsbHMiLCJkb21TaGlwcyIsIm9yZGVyT2ZTaGlwcyIsImFjdHVhbEF4aXMiLCJyb3dzIiwiZ2V0R2FtZWJvYXJkIiwiZ2V0Um93cyIsImNvbHVtbnMiLCJnZXRDb2x1bW5zIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsInR5cGVPZk15Q2VsbHMiLCJkYXRhc2V0IiwiYXBwZW5kQ2hpbGQiLCJsZW5ndGgiLCJuZXdEb21TaGlwcyIsImRvbVNoaXAiLCJkcmF3U2hpcCIsImFkZFNoaXAiLCJOdW1iZXIiLCJlbmVteSIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsImdldFdheU9mQXR0YWNrIiwicmVzdWx0IiwicmVjaXZlQXR0YWNrIiwiaW5uZXJIVE1MIiwiY29tcHV0ZXJBdHRhY2siLCJwYXN0Q29yZGVuYXRlcyIsImdldFJhbmRvbUNvcmRhbmF0ZXMiLCJjb3JkZW5hdGVzIiwiaW5jbHVkZXMiLCJwbGF5ZXJBdHRhY2siLCJnYW1lIiwibmV3R2FtZSIsIlNoaXAiLCJoaXRzIiwiaGl0IiwiaXNTdW5rIiwiR2FtZWJvYXJkIiwiciIsIm5ld0JvYXJkIiwibGFzdE1pc3NlZFNob3QiLCJhbW91bnRPZlNoaXAiLCJBcnJheSIsImZpbGwiLCJpc1RoZUFjdHVhbEF4aXNYIiwiY2hhbmdlVGhlQW1vdW50T2ZTaGlwIiwibiIsImluc3NlcnRTaGlwSW4iLCJ0aGVyZUlzU2hpcEluIiwiaXNBbGxUaGVTaGlwc1N1bmsiLCJnYW1lYm9hcmQiLCJ3YXlPZkF0dGFjayIsImlzUG9zaWJsZVRoZUF0dGFjayJdLCJzb3VyY2VSb290IjoiIn0=