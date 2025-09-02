/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/gameController.js":
/*!*******************************!*\
  !*** ./src/gameController.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GameController)
/* harmony export */ });
function GameController(player1, com) {
  let activePlayer = player1;
  let nextPlayer = com;
  let tempPlayer;
  const getActivePlayer = () => activePlayer;
  const getOpponent = () => nextPlayer;
  const switchPlayerTurn = () => {
    tempPlayer = activePlayer;
    activePlayer = nextPlayer;
    nextPlayer = tempPlayer;
  };
  const winCondition = opponent => {
    return opponent.gameboard.allShipsSunk();
  };
  const playRound = (x, y) => {
    let message = `${activePlayer.name} dropped a bomb to ${nextPlayer.name}'s board...`;
    if (!activePlayer.checkAttack(nextPlayer, x, y)) {
      message = "This Coordinate has been bombed!";
      return message;
    } else {
      activePlayer.attack(nextPlayer, x, y);
    }
    if (winCondition(nextPlayer)) {
      message = `${activePlayer.name} Wins!`;
    } else {
      switchPlayerTurn();
    }
    return message;
  };
  return {
    getActivePlayer,
    getOpponent,
    winCondition,
    playRound
  };
}

/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gameboard)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/ship.js");

class Gameboard {
  constructor() {
    this.board = Array.from({
      length: 10
    }, () => Array(10).fill(null));
    this.missedAttacks = [];
    this.hitAttacks = [];
    this.ships = [];
    this.lastHit = false;
  }
  placeShipRandom() {
    const shipLengths = [5, 4, 3, 3, 2];
    shipLengths.forEach(length => {
      let placed = false;
      while (!placed) {
        const isVertical = Math.random() < 0.5;
        const x = Math.floor(Math.random() * (isVertical ? 10 - length : 10));
        const y = Math.floor(Math.random() * (isVertical ? 10 : 10 - length));
        if (this.canPlaceShip(x, y, length, isVertical)) {
          this.placeShip(x, y, length, isVertical);
          placed = true;
        }
      }
    });
  }
  canPlaceShip(x, y, length) {
    let isVertical = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    if (isVertical) {
      if (x + length > 10) return false;
      for (let i = 0; i < length; i++) {
        if (this.board[x + i][y] !== null) return false;
      }
    } else {
      if (y + length > 10) return false;
      for (let i = 0; i < length; i++) {
        if (this.board[x][y + i] !== null) return false;
      }
    }
    return true;
  }
  placeShip(x, y, length) {
    let isVertical = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    if (!this.canPlaceShip(x, y, length, isVertical)) {
      return;
    }
    const ship = new _ship__WEBPACK_IMPORTED_MODULE_0__["default"](length, isVertical);
    if (isVertical) {
      for (let i = 0; i < length; i++) {
        this.board[x + i][y] = ship;
      }
      ship.coord.push(x);
      ship.coord.push(y);
    } else {
      for (let i = 0; i < length; i++) {
        this.board[x][y + i] = ship;
      }
      ship.coord.push(x);
      ship.coord.push(y);
    }
    this.ships.push(ship);
  }
  removeAllShip() {
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        if (this.board[x][y] !== null) {
          this.board[x][y] = null; // Remove the ship reference
        }
      }
    }
    this.ships = [];
  }
  removeShip(x, y) {
    if (!this.board[x][y]) {
      return;
    } else {
      const ship = this.board[x][y];
      const shipLength = ship.length;
      const shipIndex = this.ships.findIndex(theShip => theShip.coord[0] === ship.coord[0] && theShip.coord[1] === ship.coord[1]);
      const a = ship.coord[0];
      const b = ship.coord[1];
      if (ship.isVertical) {
        for (let i = 0; i < ship.length; i++) {
          this.board[a + i][b] = null;
        }
      } else {
        for (let i = 0; i < ship.length; i++) {
          this.board[a][b + i] = null;
        }
      }
      this.ships.splice(shipIndex, 1);
      this.createGhostShip(shipLength, ship.isVertical);
    }
  }
  rotateShip(x, y) {
    if (!this.board[x][y]) {
      return;
    } else {
      const ship = this.board[x][y];
      const shipLength = ship.length;
      const newDir = !ship.isVertical;
      const a = ship.coord[0];
      const b = ship.coord[1];
      if (ship.isVertical) {
        for (let i = 0; i < ship.length; i++) {
          this.board[a + i][b] = null;
        }
      } else {
        for (let i = 0; i < ship.length; i++) {
          this.board[a][b + i] = null;
        }
      }
      if (this.canPlaceShip(a, b, shipLength, newDir)) {
        this.placeShip(a, b, shipLength, newDir);
      } else {
        if (!newDir) {
          for (let i = 0; i < ship.length; i++) {
            this.board[a + i][b] = ship;
          }
        } else {
          for (let i = 0; i < ship.length; i++) {
            this.board[a][b + i] = ship;
          }
        }
      }
    }
  }
  createGhostShip(length, isVertical) {
    const createContainer = document.createElement("div");
    if (isVertical) {
      createContainer.style.gridTemplateRows = `repeat(${length}, 2.5rem)`;
    } else {
      createContainer.style.gridTemplateColumns = `repeat(${length}, 2.5rem)`;
    }
    createContainer.classList.add("ghostShips");
    createContainer.dataset.length = length;
    createContainer.dataset.isVertical = isVertical;
    for (let i = 0; i < length; i++) {
      const ghostShip = document.createElement("div");
      ghostShip.classList.add("ghost");
      createContainer.appendChild(ghostShip);
    }
    const moveCursor = event => {
      const y = event.pageY;
      const x = event.pageX;
      const scrollLeft = window.scrollX !== undefined ? window.scrollX : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
      const scrollTop = window.scrollY !== undefined ? window.scrollY : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      createContainer.style.left = x - scrollLeft + "px";
      createContainer.style.top = y - scrollTop + "px";
    };
    document.body.appendChild(createContainer);
    document.addEventListener("mousemove", moveCursor);
  }
  removeGhostShip() {
    const ghostShip = document.querySelector(".ghostShips");
    ghostShip.remove();
  }
  receiveAttack(x, y) {
    if (this.board[x][y]) {
      this.board[x][y].hit();
      this.hitAttacks.push([x, y]);
      this.lastHit = true;
    } else {
      this.missedAttacks.push([x, y]);
      this.lastHit = false;
    }
  }
  allShipsSunk() {
    return this.ships.every(ship => ship.isSunk());
  }
}

/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");

class Player {
  constructor(name) {
    let isComputer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    this.name = name;
    this.gameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]();
    this.computer = isComputer;
  }
  attack(opponent, x, y) {
    return opponent.gameboard.receiveAttack(x, y);
  }
  checkAttack(opponent, x, y) {
    if (opponent.gameboard.hitAttacks.some(combo => combo[0] === x && combo[1] === y) || opponent.gameboard.missedAttacks.some(combo => combo[0] === x && combo[1] === y)) {
      return false;
    } else {
      return true;
    }
  }
  getRandomPos(opponent) {
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);
    if (!this.checkAttack(opponent, x, y)) {
      return this.getRandomPos(opponent);
    } else {
      return [x, y];
    }
  }
  getRandomDirection(opponent, x, y) {
    const directions = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    const validDirections = directions.filter(combo => {
      const [newX, newY] = combo;
      const isValid = newX >= 0 && newX <= 9 && newY >= 0 && newY <= 9 && this.checkAttack(opponent, newX, newY);
      return isValid && !(newX === x && newY === y);
    });
    if (validDirections.length === 0) {
      return false;
    }
    const randomIndex = Math.floor(Math.random() * validDirections.length);
    const newPos = validDirections[randomIndex];
    return newPos;
  }
}

/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Ship)
/* harmony export */ });
class Ship {
  constructor(length, isVertical) {
    this.length = length;
    this.beenHit = 0;
    this.sunk = false;
    this.coord = [];
    this.isVertical = isVertical;
  }
  hit() {
    if (this.beenHit < this.length) {
      this.beenHit++;
    }
    this.isSunk();
  }
  isSunk() {
    if (this.beenHit === this.length) {
      this.sunk = true;
      return true;
    } else {
      return false;
    }
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
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ./media/bagel.png */ "./src/media/bagel.png"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `body {
    margin: 0;
    border: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    font-family:
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Oxygen,
        Ubuntu,
        Cantarell,
        "Open Sans",
        "Helvetica Neue",
        sans-serif;
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 7s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

button:active {
    background-color: #e2dad6;
    border: 0.1rem solid #6482ad;
    color: #6482ad;
    transform: translateY(0.02rem);
}

footer {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ee7652d8;
    height: 10vh;
}

button {
    border: #1f2937 0.1rem solid;
    border-radius: 2rem;
    background-color: rgb(247, 252, 255);
    color: black;
    align-self: center;
}

button:hover {
    background-color: transparent;
}

.mainContainer {
    flex-grow: 1;
    margin: 0 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
    background-size: 14vh;
    background-repeat: repeat;
}

.mainContainer div {
    font-size: 2rem;
    font-weight: 500;
    background-color: #e2dad6b6;
    padding: 2rem;
    border-radius: 5rem;
    margin-bottom: 1rem;
}

.boards {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
}

.p1,
.p2 {
    display: grid;
    grid-template-columns: repeat(10, 2.5rem);
    grid-template-rows: repeat(10, 2.5rem);
}

.mainContainer div.active {
    background-color: #e73c7e;
}

.p1 button,
.p2 button {
    height: 2.43rem;
    width: 2.43rem;
    border: none;
    border-radius: 0;
}

.ship {
    background-color: #1f2937e5;
}

.missed {
    background-color: #e2dad6c7;
}

.missed::after {
    content: "X";
}

.hit {
    color: #fafafa;
    background-color: #e99e87;
}

.hit::after {
    content: "O";
}

.set button:disabled {
    background-color: #e2dad6c7;
}

.play button:not(:disabled) {
    background-color: #e2dad6c7;
}

.hide {
    background-color: #e2dad6c7;
}

.ghostShips {
    display: grid;
    background-color: #e2dad6b6;
    position: fixed;
    pointer-events: none;
}

.ghost {
    background-color: #1f2937;
    height: 2.43rem;
    width: 2.43rem;
}

.btns {
    width: 40vw;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 0;
}

.btns button {
    height: 2.5rem;
    width: 8rem;
    font-size: 1rem;
}

fieldset {
    border: none;
    width: 40vw;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 0;
}

legend {
    font-size: 1.4rem;
    text-align: center;
    margin-bottom: 1rem;
}

.mainContainer fieldset div {
    width: 10vw;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    padding: 0;
}

label {
    font-size: 1.2rem;
    display: block;
    width: 8rem;
    text-align: center;
    padding: 1rem 2rem;
    border-radius: 5rem;
}

input {
    appearance: none;
    height: 0;
    width: 0;
    margin: 0;
}

fieldset div:has(input:checked) {
    background-color: #ee7752;
}
`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"AAAA;IACI,SAAS;IACT,SAAS;IACT,YAAY;IACZ,aAAa;IACb,aAAa;IACb,sBAAsB;IACtB;;;;;;;;;;;kBAWc;IACd,uEAAuE;IACvE,0BAA0B;IAC1B,oCAAoC;AACxC;;AAEA;IACI;QACI,2BAA2B;IAC/B;IACA;QACI,6BAA6B;IACjC;IACA;QACI,2BAA2B;IAC/B;AACJ;;AAEA;IACI,yBAAyB;IACzB,4BAA4B;IAC5B,cAAc;IACd,8BAA8B;AAClC;;AAEA;IACI,aAAa;IACb,uBAAuB;IACvB,mBAAmB;IACnB,2BAA2B;IAC3B,YAAY;AAChB;;AAEA;IACI,4BAA4B;IAC5B,mBAAmB;IACnB,oCAAoC;IACpC,YAAY;IACZ,kBAAkB;AACtB;;AAEA;IACI,6BAA6B;AACjC;;AAEA;IACI,YAAY;IACZ,cAAc;IACd,aAAa;IACb,sBAAsB;IACtB,uBAAuB;IACvB,mBAAmB;IACnB,yDAA0C;IAC1C,qBAAqB;IACrB,yBAAyB;AAC7B;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,2BAA2B;IAC3B,aAAa;IACb,mBAAmB;IACnB,mBAAmB;AACvB;;AAEA;IACI,WAAW;IACX,aAAa;IACb,6BAA6B;AACjC;;AAEA;;IAEI,aAAa;IACb,yCAAyC;IACzC,sCAAsC;AAC1C;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;;IAEI,eAAe;IACf,cAAc;IACd,YAAY;IACZ,gBAAgB;AACpB;;AAEA;IACI,2BAA2B;AAC/B;;AAEA;IACI,2BAA2B;AAC/B;;AAEA;IACI,YAAY;AAChB;;AAEA;IACI,cAAc;IACd,yBAAyB;AAC7B;;AAEA;IACI,YAAY;AAChB;;AAEA;IACI,2BAA2B;AAC/B;;AAEA;IACI,2BAA2B;AAC/B;;AAEA;IACI,2BAA2B;AAC/B;;AAEA;IACI,aAAa;IACb,2BAA2B;IAC3B,eAAe;IACf,oBAAoB;AACxB;;AAEA;IACI,yBAAyB;IACzB,eAAe;IACf,cAAc;AAClB;;AAEA;IACI,WAAW;IACX,aAAa;IACb,mBAAmB;IACnB,6BAA6B;IAC7B,UAAU;AACd;;AAEA;IACI,cAAc;IACd,WAAW;IACX,eAAe;AACnB;;AAEA;IACI,YAAY;IACZ,WAAW;IACX,aAAa;IACb,mBAAmB;IACnB,6BAA6B;IAC7B,UAAU;AACd;;AAEA;IACI,iBAAiB;IACjB,kBAAkB;IAClB,mBAAmB;AACvB;;AAEA;IACI,WAAW;IACX,aAAa;IACb,sBAAsB;IACtB,qBAAqB;IACrB,mBAAmB;IACnB,UAAU;AACd;;AAEA;IACI,iBAAiB;IACjB,cAAc;IACd,WAAW;IACX,kBAAkB;IAClB,kBAAkB;IAClB,mBAAmB;AACvB;;AAEA;IACI,gBAAgB;IAChB,SAAS;IACT,QAAQ;IACR,SAAS;AACb;;AAEA;IACI,yBAAyB;AAC7B","sourcesContent":["body {\n    margin: 0;\n    border: 0;\n    width: 100vw;\n    height: 100vh;\n    display: flex;\n    flex-direction: column;\n    font-family:\n        system-ui,\n        -apple-system,\n        BlinkMacSystemFont,\n        \"Segoe UI\",\n        Roboto,\n        Oxygen,\n        Ubuntu,\n        Cantarell,\n        \"Open Sans\",\n        \"Helvetica Neue\",\n        sans-serif;\n    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);\n    background-size: 400% 400%;\n    animation: gradient 7s ease infinite;\n}\n\n@keyframes gradient {\n    0% {\n        background-position: 0% 50%;\n    }\n    50% {\n        background-position: 100% 50%;\n    }\n    100% {\n        background-position: 0% 50%;\n    }\n}\n\nbutton:active {\n    background-color: #e2dad6;\n    border: 0.1rem solid #6482ad;\n    color: #6482ad;\n    transform: translateY(0.02rem);\n}\n\nfooter {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    background-color: #ee7652d8;\n    height: 10vh;\n}\n\nbutton {\n    border: #1f2937 0.1rem solid;\n    border-radius: 2rem;\n    background-color: rgb(247, 252, 255);\n    color: black;\n    align-self: center;\n}\n\nbutton:hover {\n    background-color: transparent;\n}\n\n.mainContainer {\n    flex-grow: 1;\n    margin: 0 3rem;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    background-image: url(\"./media/bagel.png\");\n    background-size: 14vh;\n    background-repeat: repeat;\n}\n\n.mainContainer div {\n    font-size: 2rem;\n    font-weight: 500;\n    background-color: #e2dad6b6;\n    padding: 2rem;\n    border-radius: 5rem;\n    margin-bottom: 1rem;\n}\n\n.boards {\n    width: 100%;\n    display: flex;\n    justify-content: space-evenly;\n}\n\n.p1,\n.p2 {\n    display: grid;\n    grid-template-columns: repeat(10, 2.5rem);\n    grid-template-rows: repeat(10, 2.5rem);\n}\n\n.mainContainer div.active {\n    background-color: #e73c7e;\n}\n\n.p1 button,\n.p2 button {\n    height: 2.43rem;\n    width: 2.43rem;\n    border: none;\n    border-radius: 0;\n}\n\n.ship {\n    background-color: #1f2937e5;\n}\n\n.missed {\n    background-color: #e2dad6c7;\n}\n\n.missed::after {\n    content: \"X\";\n}\n\n.hit {\n    color: #fafafa;\n    background-color: #e99e87;\n}\n\n.hit::after {\n    content: \"O\";\n}\n\n.set button:disabled {\n    background-color: #e2dad6c7;\n}\n\n.play button:not(:disabled) {\n    background-color: #e2dad6c7;\n}\n\n.hide {\n    background-color: #e2dad6c7;\n}\n\n.ghostShips {\n    display: grid;\n    background-color: #e2dad6b6;\n    position: fixed;\n    pointer-events: none;\n}\n\n.ghost {\n    background-color: #1f2937;\n    height: 2.43rem;\n    width: 2.43rem;\n}\n\n.btns {\n    width: 40vw;\n    display: flex;\n    align-items: center;\n    justify-content: space-evenly;\n    padding: 0;\n}\n\n.btns button {\n    height: 2.5rem;\n    width: 8rem;\n    font-size: 1rem;\n}\n\nfieldset {\n    border: none;\n    width: 40vw;\n    display: flex;\n    align-items: center;\n    justify-content: space-evenly;\n    padding: 0;\n}\n\nlegend {\n    font-size: 1.4rem;\n    text-align: center;\n    margin-bottom: 1rem;\n}\n\n.mainContainer fieldset div {\n    width: 10vw;\n    display: flex;\n    flex-direction: column;\n    justify-items: center;\n    align-items: center;\n    padding: 0;\n}\n\nlabel {\n    font-size: 1.2rem;\n    display: block;\n    width: 8rem;\n    text-align: center;\n    padding: 1rem 2rem;\n    border-radius: 5rem;\n}\n\ninput {\n    appearance: none;\n    height: 0;\n    width: 0;\n    margin: 0;\n}\n\nfieldset div:has(input:checked) {\n    background-color: #ee7752;\n}\n"],"sourceRoot":""}]);
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

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
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

/***/ }),

/***/ "./src/media/bagel.png":
/*!*****************************!*\
  !*** ./src/media/bagel.png ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "011e568cd8a1127c3d2d.png";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _gameController__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gameController */ "./src/gameController.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ship */ "./src/ship.js");




function ScreenController(player1, player2) {
  const game = (0,_gameController__WEBPACK_IMPORTED_MODULE_2__["default"])(player1, player2);
  const player1BoardDiv = document.querySelector(".p1");
  const player2BoardDiv = document.querySelector(".p2");
  const messageDiv1 = document.querySelector(".msg1");
  const messageDiv2 = document.querySelector(".msg2");
  const player1Board = player1.gameboard;
  const player2Board = player2.gameboard;
  const randomPlaceBtn = document.querySelector("#random");
  const startBtn = document.querySelector("#start");
  const restartBtn = document.querySelector("#restart");
  const comRadio = document.querySelector("#com");
  const p2Radio = document.querySelector("#p2Mode");
  randomPlaceBtn.disabled = true;
  startBtn.disabled = true;
  restartBtn.disabled = false;
  comRadio.disabled = true;
  p2Radio.disabled = true;
  player1BoardDiv.classList.remove("set");
  player2BoardDiv.classList.remove("set");
  player1BoardDiv.classList.add("play");
  player2BoardDiv.classList.add("play");
  function updateBoard() {
    const activePlayer = game.getActivePlayer();
    const opponent = game.getOpponent();
    if (activePlayer.name === player1.name) {
      player1BoardDiv.classList.add("active");
      player2BoardDiv.classList.remove("active");
    } else {
      player1BoardDiv.classList.remove("active");
      player2BoardDiv.classList.add("active");
    }
    player1BoardDiv.textContent = "";
    player1Board.board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        if (activePlayer.name !== player1.name) {
          cellButton.disabled = false;
        } else {
          cellButton.disabled = true;
        }
        if (cell instanceof _ship__WEBPACK_IMPORTED_MODULE_3__["default"]) {
          cellButton.classList.add("ship");
        }
        if (player1Board.missedAttacks.some(combo => Number(combo[0]) === rowIndex && Number(combo[1]) === columnIndex)) {
          cellButton.classList.add("missed");
        } else if (player1Board.hitAttacks.some(combo => Number(combo[0]) === rowIndex && Number(combo[1]) === columnIndex)) {
          cellButton.classList.add("hit");
        }
        player1BoardDiv.appendChild(cellButton);
      });
    });
    player2BoardDiv.textContent = "";
    player2Board.board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        if (activePlayer.name !== player2.name) {
          cellButton.disabled = false;
        } else {
          cellButton.disabled = true;
        }
        if (cell instanceof _ship__WEBPACK_IMPORTED_MODULE_3__["default"]) {
          cellButton.classList.add("ship");
        }
        if (player2Board.missedAttacks.some(combo => Number(combo[0]) === rowIndex && Number(combo[1]) === columnIndex)) {
          cellButton.classList.add("missed");
        } else if (player2Board.hitAttacks.some(combo => Number(combo[0]) === rowIndex && Number(combo[1]) === columnIndex)) {
          cellButton.classList.add("hit");
        }
        player2BoardDiv.appendChild(cellButton);
      });
    });
    if (game.winCondition(opponent)) {
      const buttons1 = player1BoardDiv.querySelectorAll("button");
      buttons1.forEach(button => button.disabled = true);
      const buttons2 = player2BoardDiv.querySelectorAll("button");
      buttons2.forEach(button => button.disabled = true);
    } else {
      messageDiv1.textContent = `It's ${activePlayer.name}'s Turn!`;
    }
    if (player2.computer && activePlayer === player2 && !game.winCondition(opponent)) {
      comAutoMoves();
    }
  }
  function comAutoMoves() {
    if (player1Board.lastHit) {
      let [x, y] = player1Board.hitAttacks[player1Board.hitAttacks.length - 1];
      let newPos = player2.getRandomDirection(player1, x, y);
      if (newPos) {
        [x, y] = newPos;
      } else {
        [x, y] = player2.getRandomPos(player1);
      }
      messageDiv2.textContent = game.playRound(x, y);
      updateBoard();
    } else {
      let [x, y] = player2.getRandomPos(player1);
      messageDiv2.textContent = game.playRound(x, y);
      updateBoard();
    }
    return;
  }
  function hideBoard() {
    const p1Btns = document.querySelector(".p1").querySelectorAll("button");
    const p2Btns = document.querySelector(".p2").querySelectorAll("button");
    p1Btns.forEach(btn => {
      btn.classList.add("hide");
    });
    p2Btns.forEach(btn => {
      btn.classList.add("hide");
    });
  }
  function boardClickHandler(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    if (!selectedRow || !selectedColumn) {
      return;
    }
    messageDiv2.textContent = game.playRound(selectedRow, selectedColumn);
    const activePlayer = game.getActivePlayer();
    updateBoard();
    if (!player2.computer) {
      if (activePlayer.name === player1.name) {
        restrictP2();
        hideBoard();
      } else if (activePlayer.name === player2.name) {
        restrictP1();
        hideBoard();
      }
      setTimeout(() => {
        updateBoard();
      }, 3000);
    } else {
      return;
    }
  }
  player1BoardDiv.addEventListener("click", boardClickHandler);
  player2BoardDiv.addEventListener("click", boardClickHandler);
  updateBoard();
}
function settingBoard() {
  const comRadio = document.querySelector("#com");
  const p2Radio = document.querySelector("#p2Mode");
  let isCom = comRadio.checked;
  const player1 = new _player__WEBPACK_IMPORTED_MODULE_1__["default"]("Player1");
  let player2 = new _player__WEBPACK_IMPORTED_MODULE_1__["default"]("com", isCom);
  const player1BoardDiv = document.querySelector(".p1");
  const player2BoardDiv = document.querySelector(".p2");
  const messageDiv1 = document.querySelector(".msg1");
  const messageDiv2 = document.querySelector(".msg2");
  const player1Board = player1.gameboard;
  let player2Board = player2.gameboard;
  const randomPlaceBtn = document.querySelector("#random");
  const startBtn = document.querySelector("#start");
  const restartBtn = document.querySelector("#restart");
  let currentPlayer = player1;
  comRadio.addEventListener("change", e => {
    if (e.target.checked) {
      isCom = true;
    }
    player2 = new _player__WEBPACK_IMPORTED_MODULE_1__["default"]("com", isCom);
    player2Board = player2.gameboard;
    player2Board.removeAllShip();
    player2Board.placeShipRandom();
    updateSettingBoard();
    restrictP2();
    resetStartButtonEvent();
  });
  p2Radio.addEventListener("change", e => {
    if (e.target.checked) {
      isCom = false;
    }
    player2 = new _player__WEBPACK_IMPORTED_MODULE_1__["default"]("Player2", isCom);
    player2Board = player2.gameboard;
    player2Board.removeAllShip();
    player2Board.placeShipRandom();
    updateSettingBoard();
    restrictP2();
    resetStartButtonEvent();
  });
  randomPlaceBtn.disabled = false;
  startBtn.disabled = false;
  restartBtn.disabled = true;
  comRadio.disabled = false;
  p2Radio.disabled = false;
  player1BoardDiv.classList.remove("play");
  player2BoardDiv.classList.remove("play");
  player1BoardDiv.classList.add("set");
  player2BoardDiv.classList.add("set");
  player1Board.placeShipRandom();
  player2Board.placeShipRandom();
  function updateSettingBoard() {
    player1BoardDiv.textContent = "";
    player1Board.board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        if (cell instanceof _ship__WEBPACK_IMPORTED_MODULE_3__["default"]) {
          cellButton.classList.add("ship");
          cellButton.addEventListener("mousedown", event => {
            if (event.button == 1) {
              player1Board.rotateShip(rowIndex, columnIndex);
              updateSettingBoard();
              restrictP2();
              return;
            }
            player1Board.removeShip(rowIndex, columnIndex);
            updateSettingBoard();
            restrictP2();
          });
        } else {
          cellButton.addEventListener("mouseup", () => {
            const ghostShip = document.querySelector(".ghostShips");
            if (ghostShip) {
              const length = parseInt(ghostShip.dataset.length);
              const isVertical = ghostShip.dataset.isVertical === "true";
              if (player1Board.canPlaceShip(rowIndex, columnIndex, length, isVertical)) {
                player1Board.placeShip(rowIndex, columnIndex, length, isVertical);
                player1Board.removeGhostShip();
                updateSettingBoard();
                restrictP2();
              } else {
                return;
              }
            }
          });
        }
        player1BoardDiv.appendChild(cellButton);
      });
    });
    player2BoardDiv.textContent = "";
    if (player2.computer) {
      player2Board.board.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
          const cellButton = document.createElement("button");
          cellButton.classList.add("cell");
          cellButton.dataset.row = rowIndex;
          cellButton.dataset.column = columnIndex;
          cellButton.disabled = true;
          if (cell instanceof _ship__WEBPACK_IMPORTED_MODULE_3__["default"]) {
            cellButton.classList.add("ship");
          }
          player2BoardDiv.appendChild(cellButton);
        });
      });
    } else {
      player2Board.board.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
          const cellButton = document.createElement("button");
          cellButton.classList.add("cell");
          cellButton.dataset.row = rowIndex;
          cellButton.dataset.column = columnIndex;
          if (cell instanceof _ship__WEBPACK_IMPORTED_MODULE_3__["default"]) {
            cellButton.classList.add("ship");
            cellButton.addEventListener("mousedown", event => {
              if (event.button == 1) {
                player2Board.rotateShip(rowIndex, columnIndex);
                updateSettingBoard();
                restrictP1();
                return;
              }
              player2Board.removeShip(rowIndex, columnIndex);
              updateSettingBoard();
              restrictP1();
            });
          } else {
            cellButton.addEventListener("mouseup", () => {
              const ghostShip = document.querySelector(".ghostShips");
              if (ghostShip) {
                const length = parseInt(ghostShip.dataset.length);
                const isVertical = ghostShip.dataset.isVertical === "true";
                if (player2Board.canPlaceShip(rowIndex, columnIndex, length, isVertical)) {
                  player2Board.placeShip(rowIndex, columnIndex, length, isVertical);
                  player2Board.removeGhostShip();
                  updateSettingBoard();
                  restrictP1();
                } else {
                  return;
                }
              }
            });
          }
          player2BoardDiv.appendChild(cellButton);
        });
      });
    }
  }
  function resetStartButtonEvent() {
    // Clone the start button to clear previous events
    const newStartBtn = startBtn.cloneNode(true);
    startBtn.replaceWith(newStartBtn);
    // Attach the new event listener
    newStartBtn.addEventListener("click", () => {
      if (!player2.computer && !document.querySelector(".p1").querySelector("button").disabled) {
        switchSettingBoard();
        return;
      }
      ScreenController(player1, player2);
    });
  }
  function switchSettingBoard() {
    const p1Btns = document.querySelector(".p1").querySelectorAll("button");
    const p2Btns = document.querySelector(".p2").querySelectorAll("button");
    p1Btns.forEach(btn => {
      btn.disabled = true;
    });
    p2Btns.forEach(btn => {
      btn.disabled = false;
    });
    comRadio.disabled = true;
    p2Radio.disabled = true;
    currentPlayer = player2;
    messageDiv1.textContent = "Place Player2's Ships! Press Start To Continue!";
  }
  messageDiv1.textContent = "Place Player1's Ships! Press Start To Continue!";
  messageDiv2.textContent = "Click Middle Mouse To Rotate The Ship!";
  updateSettingBoard();
  restrictP2();
  randomPlaceBtn.addEventListener("click", () => {
    currentPlayer.gameboard.removeAllShip();
    currentPlayer.gameboard.placeShipRandom();
    updateSettingBoard();
    currentPlayer == player1 ? restrictP2() : restrictP1();
  });
  resetStartButtonEvent(player1, player2);
  restartBtn.addEventListener("click", () => {
    player1Board.ships = [];
    player1Board.missedAttacks = [];
    player1Board.hitAttacks = [];
    player2Board.ships = [];
    player2Board.missedAttacks = [];
    player2Board.hitAttacks = [];
    settingBoard();
  });
}
function restrictP1() {
  const p1Btns = document.querySelector(".p1").querySelectorAll("button");
  p1Btns.forEach(btn => {
    btn.disabled = true;
  });
}
function restrictP2() {
  const p2Btns = document.querySelector(".p2").querySelectorAll("button");
  p2Btns.forEach(btn => {
    btn.disabled = true;
  });
}
settingBoard();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sZ0ZBQWdGLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxZQUFZLGdCQUFnQixNQUFNLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxNQUFNLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksT0FBTyxNQUFNLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sTUFBTSxVQUFVLFVBQVUsVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFlBQVksT0FBTyxLQUFLLFlBQVksV0FBVyxVQUFVLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWSxhQUFhLFdBQVcsTUFBTSxLQUFLLFVBQVUsVUFBVSxVQUFVLE9BQU8sS0FBSyxVQUFVLFVBQVUsVUFBVSxZQUFZLGFBQWEsV0FBVyxNQUFNLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLE1BQU0sS0FBSyxZQUFZLFdBQVcsVUFBVSxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxXQUFXLFVBQVUsVUFBVSxNQUFNLEtBQUssWUFBWSxnQ0FBZ0MsZ0JBQWdCLGdCQUFnQixtQkFBbUIsb0JBQW9CLG9CQUFvQiw2QkFBNkIsbVFBQW1RLDhFQUE4RSxpQ0FBaUMsMkNBQTJDLEdBQUcseUJBQXlCLFVBQVUsc0NBQXNDLE9BQU8sV0FBVyx3Q0FBd0MsT0FBTyxZQUFZLHNDQUFzQyxPQUFPLEdBQUcsbUJBQW1CLGdDQUFnQyxtQ0FBbUMscUJBQXFCLHFDQUFxQyxHQUFHLFlBQVksb0JBQW9CLDhCQUE4QiwwQkFBMEIsa0NBQWtDLG1CQUFtQixHQUFHLFlBQVksbUNBQW1DLDBCQUEwQiwyQ0FBMkMsbUJBQW1CLHlCQUF5QixHQUFHLGtCQUFrQixvQ0FBb0MsR0FBRyxvQkFBb0IsbUJBQW1CLHFCQUFxQixvQkFBb0IsNkJBQTZCLDhCQUE4QiwwQkFBMEIsbURBQW1ELDRCQUE0QixnQ0FBZ0MsR0FBRyx3QkFBd0Isc0JBQXNCLHVCQUF1QixrQ0FBa0Msb0JBQW9CLDBCQUEwQiwwQkFBMEIsR0FBRyxhQUFhLGtCQUFrQixvQkFBb0Isb0NBQW9DLEdBQUcsZUFBZSxvQkFBb0IsZ0RBQWdELDZDQUE2QyxHQUFHLCtCQUErQixnQ0FBZ0MsR0FBRyw2QkFBNkIsc0JBQXNCLHFCQUFxQixtQkFBbUIsdUJBQXVCLEdBQUcsV0FBVyxrQ0FBa0MsR0FBRyxhQUFhLGtDQUFrQyxHQUFHLG9CQUFvQixxQkFBcUIsR0FBRyxVQUFVLHFCQUFxQixnQ0FBZ0MsR0FBRyxpQkFBaUIscUJBQXFCLEdBQUcsMEJBQTBCLGtDQUFrQyxHQUFHLGlDQUFpQyxrQ0FBa0MsR0FBRyxXQUFXLGtDQUFrQyxHQUFHLGlCQUFpQixvQkFBb0Isa0NBQWtDLHNCQUFzQiwyQkFBMkIsR0FBRyxZQUFZLGdDQUFnQyxzQkFBc0IscUJBQXFCLEdBQUcsV0FBVyxrQkFBa0Isb0JBQW9CLDBCQUEwQixvQ0FBb0MsaUJBQWlCLEdBQUcsa0JBQWtCLHFCQUFxQixrQkFBa0Isc0JBQXNCLEdBQUcsY0FBYyxtQkFBbUIsa0JBQWtCLG9CQUFvQiwwQkFBMEIsb0NBQW9DLGlCQUFpQixHQUFHLFlBQVksd0JBQXdCLHlCQUF5QiwwQkFBMEIsR0FBRyxpQ0FBaUMsa0JBQWtCLG9CQUFvQiw2QkFBNkIsNEJBQTRCLDBCQUEwQixpQkFBaUIsR0FBRyxXQUFXLHdCQUF3QixxQkFBcUIsa0JBQWtCLHlCQUF5Qix5QkFBeUIsMEJBQTBCLEdBQUcsV0FBVyx1QkFBdUIsZ0JBQWdCLGVBQWUsZ0JBQWdCLEdBQUcscUNBQXFDLGdDQUFnQyxHQUFHLHFCQUFxQjtBQUNoeUs7QUFDQSxpRUFBZSx1QkFBdUIsRUFBQzs7Ozs7Ozs7Ozs7QUM5TjFCOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBLGdEQUFnRDtBQUNoRDtBQUNBO0FBQ0EscUZBQXFGO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixpQkFBaUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHFCQUFxQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixzRkFBc0YscUJBQXFCO0FBQzNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixpREFBaUQscUJBQXFCO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixzREFBc0QscUJBQXFCO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNwRmE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3pCYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVELGNBQWM7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2RBLE1BQStGO0FBQy9GLE1BQXFGO0FBQ3JGLE1BQTRGO0FBQzVGLE1BQStHO0FBQy9HLE1BQXdHO0FBQ3hHLE1BQXdHO0FBQ3hHLE1BQW1HO0FBQ25HO0FBQ0E7O0FBRUE7O0FBRUEsNEJBQTRCLHFHQUFtQjtBQUMvQyx3QkFBd0Isa0hBQWE7QUFDckMsaUJBQWlCLHVHQUFhO0FBQzlCLGlCQUFpQiwrRkFBTTtBQUN2Qiw2QkFBNkIsc0dBQWtCOztBQUUvQyxhQUFhLDBHQUFHLENBQUMsc0ZBQU87Ozs7QUFJNkM7QUFDckUsT0FBTyxpRUFBZSxzRkFBTyxJQUFJLHNGQUFPLFVBQVUsc0ZBQU8sbUJBQW1CLEVBQUM7Ozs7Ozs7Ozs7O0FDeEJoRTs7QUFFYjtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isd0JBQXdCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGlCQUFpQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLDRCQUE0QjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDZCQUE2QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ25GYTs7QUFFYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNqQ2E7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ1RhOztBQUViO0FBQ0E7QUFDQSxjQUFjLEtBQXdDLEdBQUcsc0JBQWlCLEdBQUcsQ0FBSTtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDVGE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQSxpRkFBaUY7QUFDakY7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUM1RGE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7VUNiQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7Ozs7O1dDekJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ2xCQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7Ozs7O1dDckJBOzs7Ozs7Ozs7Ozs7O0FDQXFCO0FBQ1M7QUFDZ0I7QUFDcEI7QUFFMUIsU0FBU0MsZ0JBQWdCQSxDQUFDN0csT0FBTyxFQUFFOEcsT0FBTyxFQUFFO0VBQ3hDLE1BQU1DLElBQUksR0FBR2hILDJEQUFjLENBQUNDLE9BQU8sRUFBRThHLE9BQU8sQ0FBQztFQUM3QyxNQUFNRSxlQUFlLEdBQUdwRCxRQUFRLENBQUMwQixhQUFhLENBQUMsS0FBSyxDQUFDO0VBQ3JELE1BQU0yQixlQUFlLEdBQUdyRCxRQUFRLENBQUMwQixhQUFhLENBQUMsS0FBSyxDQUFDO0VBQ3JELE1BQU00QixXQUFXLEdBQUd0RCxRQUFRLENBQUMwQixhQUFhLENBQUMsT0FBTyxDQUFDO0VBQ25ELE1BQU02QixXQUFXLEdBQUd2RCxRQUFRLENBQUMwQixhQUFhLENBQUMsT0FBTyxDQUFDO0VBQ25ELE1BQU04QixZQUFZLEdBQUdwSCxPQUFPLENBQUNVLFNBQVM7RUFDdEMsTUFBTTJHLFlBQVksR0FBR1AsT0FBTyxDQUFDcEcsU0FBUztFQUN0QyxNQUFNNEcsY0FBYyxHQUFHMUQsUUFBUSxDQUFDMEIsYUFBYSxDQUFDLFNBQVMsQ0FBQztFQUN4RCxNQUFNaUMsUUFBUSxHQUFHM0QsUUFBUSxDQUFDMEIsYUFBYSxDQUFDLFFBQVEsQ0FBQztFQUNqRCxNQUFNa0MsVUFBVSxHQUFHNUQsUUFBUSxDQUFDMEIsYUFBYSxDQUFDLFVBQVUsQ0FBQztFQUNyRCxNQUFNbUMsUUFBUSxHQUFHN0QsUUFBUSxDQUFDMEIsYUFBYSxDQUFDLE1BQU0sQ0FBQztFQUMvQyxNQUFNb0MsT0FBTyxHQUFHOUQsUUFBUSxDQUFDMEIsYUFBYSxDQUFDLFNBQVMsQ0FBQztFQUVqRGdDLGNBQWMsQ0FBQ0ssUUFBUSxHQUFHLElBQUk7RUFDOUJKLFFBQVEsQ0FBQ0ksUUFBUSxHQUFHLElBQUk7RUFDeEJILFVBQVUsQ0FBQ0csUUFBUSxHQUFHLEtBQUs7RUFDM0JGLFFBQVEsQ0FBQ0UsUUFBUSxHQUFHLElBQUk7RUFDeEJELE9BQU8sQ0FBQ0MsUUFBUSxHQUFHLElBQUk7RUFFdkJYLGVBQWUsQ0FBQy9DLFNBQVMsQ0FBQ3NCLE1BQU0sQ0FBQyxLQUFLLENBQUM7RUFDdkMwQixlQUFlLENBQUNoRCxTQUFTLENBQUNzQixNQUFNLENBQUMsS0FBSyxDQUFDO0VBQ3ZDeUIsZUFBZSxDQUFDL0MsU0FBUyxDQUFDQyxHQUFHLENBQUMsTUFBTSxDQUFDO0VBQ3JDK0MsZUFBZSxDQUFDaEQsU0FBUyxDQUFDQyxHQUFHLENBQUMsTUFBTSxDQUFDO0VBRXJDLFNBQVMwRCxXQUFXQSxDQUFBLEVBQUc7SUFDbkIsTUFBTTFILFlBQVksR0FBRzZHLElBQUksQ0FBQzFHLGVBQWUsQ0FBQyxDQUFDO0lBQzNDLE1BQU1JLFFBQVEsR0FBR3NHLElBQUksQ0FBQ3pHLFdBQVcsQ0FBQyxDQUFDO0lBRW5DLElBQUlKLFlBQVksQ0FBQ2MsSUFBSSxLQUFLaEIsT0FBTyxDQUFDZ0IsSUFBSSxFQUFFO01BQ3BDZ0csZUFBZSxDQUFDL0MsU0FBUyxDQUFDQyxHQUFHLENBQUMsUUFBUSxDQUFDO01BQ3ZDK0MsZUFBZSxDQUFDaEQsU0FBUyxDQUFDc0IsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUM5QyxDQUFDLE1BQU07TUFDSHlCLGVBQWUsQ0FBQy9DLFNBQVMsQ0FBQ3NCLE1BQU0sQ0FBQyxRQUFRLENBQUM7TUFDMUMwQixlQUFlLENBQUNoRCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDM0M7SUFFQThDLGVBQWUsQ0FBQ2EsV0FBVyxHQUFHLEVBQUU7SUFDaENULFlBQVksQ0FBQzlGLEtBQUssQ0FBQ1csT0FBTyxDQUFDLENBQUM2RixHQUFHLEVBQUVDLFFBQVEsS0FBSztNQUMxQ0QsR0FBRyxDQUFDN0YsT0FBTyxDQUFDLENBQUMrRixJQUFJLEVBQUVDLFdBQVcsS0FBSztRQUMvQixNQUFNQyxVQUFVLEdBQUd0RSxRQUFRLENBQUNDLGFBQWEsQ0FBQyxRQUFRLENBQUM7UUFDbkRxRSxVQUFVLENBQUNqRSxTQUFTLENBQUNDLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDaENnRSxVQUFVLENBQUMvRCxPQUFPLENBQUMyRCxHQUFHLEdBQUdDLFFBQVE7UUFDakNHLFVBQVUsQ0FBQy9ELE9BQU8sQ0FBQ2dFLE1BQU0sR0FBR0YsV0FBVztRQUV2QyxJQUFJL0gsWUFBWSxDQUFDYyxJQUFJLEtBQUtoQixPQUFPLENBQUNnQixJQUFJLEVBQUU7VUFDcENrSCxVQUFVLENBQUNQLFFBQVEsR0FBRyxLQUFLO1FBQy9CLENBQUMsTUFBTTtVQUNITyxVQUFVLENBQUNQLFFBQVEsR0FBRyxJQUFJO1FBQzlCO1FBQ0EsSUFBSUssSUFBSSxZQUFZN0csNkNBQUksRUFBRTtVQUN0QitHLFVBQVUsQ0FBQ2pFLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUNwQztRQUNBLElBQ0lrRCxZQUFZLENBQUN6RixhQUFhLENBQUNvRSxJQUFJLENBQzFCQyxLQUFLLElBQ0ZvQyxNQUFNLENBQUNwQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSytCLFFBQVEsSUFDN0JLLE1BQU0sQ0FBQ3BDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLaUMsV0FDN0IsQ0FBQyxFQUNIO1VBQ0VDLFVBQVUsQ0FBQ2pFLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUN0QyxDQUFDLE1BQU0sSUFDSGtELFlBQVksQ0FBQ3hGLFVBQVUsQ0FBQ21FLElBQUksQ0FDdkJDLEtBQUssSUFDRm9DLE1BQU0sQ0FBQ3BDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLK0IsUUFBUSxJQUM3QkssTUFBTSxDQUFDcEMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUtpQyxXQUM3QixDQUFDLEVBQ0g7VUFDRUMsVUFBVSxDQUFDakUsU0FBUyxDQUFDQyxHQUFHLENBQUMsS0FBSyxDQUFDO1FBQ25DO1FBQ0E4QyxlQUFlLENBQUMzQyxXQUFXLENBQUM2RCxVQUFVLENBQUM7TUFDM0MsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0lBRUZqQixlQUFlLENBQUNZLFdBQVcsR0FBRyxFQUFFO0lBQ2hDUixZQUFZLENBQUMvRixLQUFLLENBQUNXLE9BQU8sQ0FBQyxDQUFDNkYsR0FBRyxFQUFFQyxRQUFRLEtBQUs7TUFDMUNELEdBQUcsQ0FBQzdGLE9BQU8sQ0FBQyxDQUFDK0YsSUFBSSxFQUFFQyxXQUFXLEtBQUs7UUFDL0IsTUFBTUMsVUFBVSxHQUFHdEUsUUFBUSxDQUFDQyxhQUFhLENBQUMsUUFBUSxDQUFDO1FBQ25EcUUsVUFBVSxDQUFDakUsU0FBUyxDQUFDQyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ2hDZ0UsVUFBVSxDQUFDL0QsT0FBTyxDQUFDMkQsR0FBRyxHQUFHQyxRQUFRO1FBQ2pDRyxVQUFVLENBQUMvRCxPQUFPLENBQUNnRSxNQUFNLEdBQUdGLFdBQVc7UUFFdkMsSUFBSS9ILFlBQVksQ0FBQ2MsSUFBSSxLQUFLOEYsT0FBTyxDQUFDOUYsSUFBSSxFQUFFO1VBQ3BDa0gsVUFBVSxDQUFDUCxRQUFRLEdBQUcsS0FBSztRQUMvQixDQUFDLE1BQU07VUFDSE8sVUFBVSxDQUFDUCxRQUFRLEdBQUcsSUFBSTtRQUM5QjtRQUNBLElBQUlLLElBQUksWUFBWTdHLDZDQUFJLEVBQUU7VUFDdEIrRyxVQUFVLENBQUNqRSxTQUFTLENBQUNDLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDcEM7UUFDQSxJQUNJbUQsWUFBWSxDQUFDMUYsYUFBYSxDQUFDb0UsSUFBSSxDQUMxQkMsS0FBSyxJQUNGb0MsTUFBTSxDQUFDcEMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUsrQixRQUFRLElBQzdCSyxNQUFNLENBQUNwQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBS2lDLFdBQzdCLENBQUMsRUFDSDtVQUNFQyxVQUFVLENBQUNqRSxTQUFTLENBQUNDLEdBQUcsQ0FBQyxRQUFRLENBQUM7UUFDdEMsQ0FBQyxNQUFNLElBQ0htRCxZQUFZLENBQUN6RixVQUFVLENBQUNtRSxJQUFJLENBQ3ZCQyxLQUFLLElBQ0ZvQyxNQUFNLENBQUNwQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSytCLFFBQVEsSUFDN0JLLE1BQU0sQ0FBQ3BDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLaUMsV0FDN0IsQ0FBQyxFQUNIO1VBQ0VDLFVBQVUsQ0FBQ2pFLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUNuQztRQUNBK0MsZUFBZSxDQUFDNUMsV0FBVyxDQUFDNkQsVUFBVSxDQUFDO01BQzNDLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQztJQUVGLElBQUluQixJQUFJLENBQUN2RyxZQUFZLENBQUNDLFFBQVEsQ0FBQyxFQUFFO01BQzdCLE1BQU00SCxRQUFRLEdBQUdyQixlQUFlLENBQUNzQixnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7TUFDM0RELFFBQVEsQ0FBQ3BHLE9BQU8sQ0FBRXNHLE1BQU0sSUFBTUEsTUFBTSxDQUFDWixRQUFRLEdBQUcsSUFBSyxDQUFDO01BQ3RELE1BQU1hLFFBQVEsR0FBR3ZCLGVBQWUsQ0FBQ3FCLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztNQUMzREUsUUFBUSxDQUFDdkcsT0FBTyxDQUFFc0csTUFBTSxJQUFNQSxNQUFNLENBQUNaLFFBQVEsR0FBRyxJQUFLLENBQUM7SUFDMUQsQ0FBQyxNQUFNO01BQ0hULFdBQVcsQ0FBQ1csV0FBVyxHQUFHLFFBQVEzSCxZQUFZLENBQUNjLElBQUksVUFBVTtJQUNqRTtJQUVBLElBQ0k4RixPQUFPLENBQUNoQixRQUFRLElBQ2hCNUYsWUFBWSxLQUFLNEcsT0FBTyxJQUN4QixDQUFDQyxJQUFJLENBQUN2RyxZQUFZLENBQUNDLFFBQVEsQ0FBQyxFQUM5QjtNQUNFZ0ksWUFBWSxDQUFDLENBQUM7SUFDbEI7RUFDSjtFQUVBLFNBQVNBLFlBQVlBLENBQUEsRUFBRztJQUNwQixJQUFJckIsWUFBWSxDQUFDdEYsT0FBTyxFQUFFO01BQ3RCLElBQUksQ0FBQ2pCLENBQUMsRUFBRUMsQ0FBQyxDQUFDLEdBQ05zRyxZQUFZLENBQUN4RixVQUFVLENBQUN3RixZQUFZLENBQUN4RixVQUFVLENBQUNILE1BQU0sR0FBRyxDQUFDLENBQUM7TUFDL0QsSUFBSWlGLE1BQU0sR0FBR0ksT0FBTyxDQUFDWixrQkFBa0IsQ0FBQ2xHLE9BQU8sRUFBRWEsQ0FBQyxFQUFFQyxDQUFDLENBQUM7TUFDdEQsSUFBSTRGLE1BQU0sRUFBRTtRQUNSLENBQUM3RixDQUFDLEVBQUVDLENBQUMsQ0FBQyxHQUFHNEYsTUFBTTtNQUNuQixDQUFDLE1BQU07UUFDSCxDQUFDN0YsQ0FBQyxFQUFFQyxDQUFDLENBQUMsR0FBR2dHLE9BQU8sQ0FBQ2IsWUFBWSxDQUFDakcsT0FBTyxDQUFDO01BQzFDO01BQ0FtSCxXQUFXLENBQUNVLFdBQVcsR0FBR2QsSUFBSSxDQUFDbkcsU0FBUyxDQUFDQyxDQUFDLEVBQUVDLENBQUMsQ0FBQztNQUM5QzhHLFdBQVcsQ0FBQyxDQUFDO0lBQ2pCLENBQUMsTUFBTTtNQUNILElBQUksQ0FBQy9HLENBQUMsRUFBRUMsQ0FBQyxDQUFDLEdBQUdnRyxPQUFPLENBQUNiLFlBQVksQ0FBQ2pHLE9BQU8sQ0FBQztNQUMxQ21ILFdBQVcsQ0FBQ1UsV0FBVyxHQUFHZCxJQUFJLENBQUNuRyxTQUFTLENBQUNDLENBQUMsRUFBRUMsQ0FBQyxDQUFDO01BQzlDOEcsV0FBVyxDQUFDLENBQUM7SUFDakI7SUFDQTtFQUNKO0VBRUEsU0FBU2MsU0FBU0EsQ0FBQSxFQUFHO0lBQ2pCLE1BQU1DLE1BQU0sR0FBRy9FLFFBQVEsQ0FBQzBCLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQ2dELGdCQUFnQixDQUFDLFFBQVEsQ0FBQztJQUN2RSxNQUFNTSxNQUFNLEdBQUdoRixRQUFRLENBQUMwQixhQUFhLENBQUMsS0FBSyxDQUFDLENBQUNnRCxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7SUFDdkVLLE1BQU0sQ0FBQzFHLE9BQU8sQ0FBRTRHLEdBQUcsSUFBSztNQUNwQkEsR0FBRyxDQUFDNUUsU0FBUyxDQUFDQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQzdCLENBQUMsQ0FBQztJQUNGMEUsTUFBTSxDQUFDM0csT0FBTyxDQUFFNEcsR0FBRyxJQUFLO01BQ3BCQSxHQUFHLENBQUM1RSxTQUFTLENBQUNDLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDN0IsQ0FBQyxDQUFDO0VBQ047RUFFQSxTQUFTNEUsaUJBQWlCQSxDQUFDQyxDQUFDLEVBQUU7SUFDMUIsTUFBTUMsV0FBVyxHQUFHRCxDQUFDLENBQUNFLE1BQU0sQ0FBQzlFLE9BQU8sQ0FBQzJELEdBQUc7SUFDeEMsTUFBTW9CLGNBQWMsR0FBR0gsQ0FBQyxDQUFDRSxNQUFNLENBQUM5RSxPQUFPLENBQUNnRSxNQUFNO0lBRTlDLElBQUksQ0FBQ2EsV0FBVyxJQUFJLENBQUNFLGNBQWMsRUFBRTtNQUNqQztJQUNKO0lBRUEvQixXQUFXLENBQUNVLFdBQVcsR0FBR2QsSUFBSSxDQUFDbkcsU0FBUyxDQUFDb0ksV0FBVyxFQUFFRSxjQUFjLENBQUM7SUFDckUsTUFBTWhKLFlBQVksR0FBRzZHLElBQUksQ0FBQzFHLGVBQWUsQ0FBQyxDQUFDO0lBQzNDdUgsV0FBVyxDQUFDLENBQUM7SUFDYixJQUFJLENBQUNkLE9BQU8sQ0FBQ2hCLFFBQVEsRUFBRTtNQUNuQixJQUFJNUYsWUFBWSxDQUFDYyxJQUFJLEtBQUtoQixPQUFPLENBQUNnQixJQUFJLEVBQUU7UUFDcENtSSxVQUFVLENBQUMsQ0FBQztRQUNaVCxTQUFTLENBQUMsQ0FBQztNQUNmLENBQUMsTUFBTSxJQUFJeEksWUFBWSxDQUFDYyxJQUFJLEtBQUs4RixPQUFPLENBQUM5RixJQUFJLEVBQUU7UUFDM0NvSSxVQUFVLENBQUMsQ0FBQztRQUNaVixTQUFTLENBQUMsQ0FBQztNQUNmO01BQ0FXLFVBQVUsQ0FBQyxNQUFNO1FBQ2J6QixXQUFXLENBQUMsQ0FBQztNQUNqQixDQUFDLEVBQUUsSUFBSSxDQUFDO0lBQ1osQ0FBQyxNQUFNO01BQ0g7SUFDSjtFQUNKO0VBRUFaLGVBQWUsQ0FBQzVCLGdCQUFnQixDQUFDLE9BQU8sRUFBRTBELGlCQUFpQixDQUFDO0VBQzVEN0IsZUFBZSxDQUFDN0IsZ0JBQWdCLENBQUMsT0FBTyxFQUFFMEQsaUJBQWlCLENBQUM7RUFFNURsQixXQUFXLENBQUMsQ0FBQztBQUNqQjtBQUVBLFNBQVMwQixZQUFZQSxDQUFBLEVBQUc7RUFDcEIsTUFBTTdCLFFBQVEsR0FBRzdELFFBQVEsQ0FBQzBCLGFBQWEsQ0FBQyxNQUFNLENBQUM7RUFDL0MsTUFBTW9DLE9BQU8sR0FBRzlELFFBQVEsQ0FBQzBCLGFBQWEsQ0FBQyxTQUFTLENBQUM7RUFDakQsSUFBSWlFLEtBQUssR0FBRzlCLFFBQVEsQ0FBQytCLE9BQU87RUFDNUIsTUFBTXhKLE9BQU8sR0FBRyxJQUFJNEYsK0NBQU0sQ0FBQyxTQUFTLENBQUM7RUFDckMsSUFBSWtCLE9BQU8sR0FBRyxJQUFJbEIsK0NBQU0sQ0FBQyxLQUFLLEVBQUUyRCxLQUFLLENBQUM7RUFDdEMsTUFBTXZDLGVBQWUsR0FBR3BELFFBQVEsQ0FBQzBCLGFBQWEsQ0FBQyxLQUFLLENBQUM7RUFDckQsTUFBTTJCLGVBQWUsR0FBR3JELFFBQVEsQ0FBQzBCLGFBQWEsQ0FBQyxLQUFLLENBQUM7RUFDckQsTUFBTTRCLFdBQVcsR0FBR3RELFFBQVEsQ0FBQzBCLGFBQWEsQ0FBQyxPQUFPLENBQUM7RUFDbkQsTUFBTTZCLFdBQVcsR0FBR3ZELFFBQVEsQ0FBQzBCLGFBQWEsQ0FBQyxPQUFPLENBQUM7RUFDbkQsTUFBTThCLFlBQVksR0FBR3BILE9BQU8sQ0FBQ1UsU0FBUztFQUN0QyxJQUFJMkcsWUFBWSxHQUFHUCxPQUFPLENBQUNwRyxTQUFTO0VBQ3BDLE1BQU00RyxjQUFjLEdBQUcxRCxRQUFRLENBQUMwQixhQUFhLENBQUMsU0FBUyxDQUFDO0VBQ3hELE1BQU1pQyxRQUFRLEdBQUczRCxRQUFRLENBQUMwQixhQUFhLENBQUMsUUFBUSxDQUFDO0VBQ2pELE1BQU1rQyxVQUFVLEdBQUc1RCxRQUFRLENBQUMwQixhQUFhLENBQUMsVUFBVSxDQUFDO0VBQ3JELElBQUltRSxhQUFhLEdBQUd6SixPQUFPO0VBRTNCeUgsUUFBUSxDQUFDckMsZ0JBQWdCLENBQUMsUUFBUSxFQUFHMkQsQ0FBQyxJQUFLO0lBQ3ZDLElBQUlBLENBQUMsQ0FBQ0UsTUFBTSxDQUFDTyxPQUFPLEVBQUU7TUFDbEJELEtBQUssR0FBRyxJQUFJO0lBQ2hCO0lBQ0F6QyxPQUFPLEdBQUcsSUFBSWxCLCtDQUFNLENBQUMsS0FBSyxFQUFFMkQsS0FBSyxDQUFDO0lBQ2xDbEMsWUFBWSxHQUFHUCxPQUFPLENBQUNwRyxTQUFTO0lBQ2hDMkcsWUFBWSxDQUFDdEUsYUFBYSxDQUFDLENBQUM7SUFDNUJzRSxZQUFZLENBQUN0RixlQUFlLENBQUMsQ0FBQztJQUM5QjJILGtCQUFrQixDQUFDLENBQUM7SUFDcEJQLFVBQVUsQ0FBQyxDQUFDO0lBQ1pRLHFCQUFxQixDQUFDLENBQUM7RUFDM0IsQ0FBQyxDQUFDO0VBQ0ZqQyxPQUFPLENBQUN0QyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUcyRCxDQUFDLElBQUs7SUFDdEMsSUFBSUEsQ0FBQyxDQUFDRSxNQUFNLENBQUNPLE9BQU8sRUFBRTtNQUNsQkQsS0FBSyxHQUFHLEtBQUs7SUFDakI7SUFDQXpDLE9BQU8sR0FBRyxJQUFJbEIsK0NBQU0sQ0FBQyxTQUFTLEVBQUUyRCxLQUFLLENBQUM7SUFDdENsQyxZQUFZLEdBQUdQLE9BQU8sQ0FBQ3BHLFNBQVM7SUFDaEMyRyxZQUFZLENBQUN0RSxhQUFhLENBQUMsQ0FBQztJQUM1QnNFLFlBQVksQ0FBQ3RGLGVBQWUsQ0FBQyxDQUFDO0lBQzlCMkgsa0JBQWtCLENBQUMsQ0FBQztJQUNwQlAsVUFBVSxDQUFDLENBQUM7SUFDWlEscUJBQXFCLENBQUMsQ0FBQztFQUMzQixDQUFDLENBQUM7RUFFRnJDLGNBQWMsQ0FBQ0ssUUFBUSxHQUFHLEtBQUs7RUFDL0JKLFFBQVEsQ0FBQ0ksUUFBUSxHQUFHLEtBQUs7RUFDekJILFVBQVUsQ0FBQ0csUUFBUSxHQUFHLElBQUk7RUFDMUJGLFFBQVEsQ0FBQ0UsUUFBUSxHQUFHLEtBQUs7RUFDekJELE9BQU8sQ0FBQ0MsUUFBUSxHQUFHLEtBQUs7RUFFeEJYLGVBQWUsQ0FBQy9DLFNBQVMsQ0FBQ3NCLE1BQU0sQ0FBQyxNQUFNLENBQUM7RUFDeEMwQixlQUFlLENBQUNoRCxTQUFTLENBQUNzQixNQUFNLENBQUMsTUFBTSxDQUFDO0VBQ3hDeUIsZUFBZSxDQUFDL0MsU0FBUyxDQUFDQyxHQUFHLENBQUMsS0FBSyxDQUFDO0VBQ3BDK0MsZUFBZSxDQUFDaEQsU0FBUyxDQUFDQyxHQUFHLENBQUMsS0FBSyxDQUFDO0VBRXBDa0QsWUFBWSxDQUFDckYsZUFBZSxDQUFDLENBQUM7RUFDOUJzRixZQUFZLENBQUN0RixlQUFlLENBQUMsQ0FBQztFQUU5QixTQUFTMkgsa0JBQWtCQSxDQUFBLEVBQUc7SUFDMUIxQyxlQUFlLENBQUNhLFdBQVcsR0FBRyxFQUFFO0lBQ2hDVCxZQUFZLENBQUM5RixLQUFLLENBQUNXLE9BQU8sQ0FBQyxDQUFDNkYsR0FBRyxFQUFFQyxRQUFRLEtBQUs7TUFDMUNELEdBQUcsQ0FBQzdGLE9BQU8sQ0FBQyxDQUFDK0YsSUFBSSxFQUFFQyxXQUFXLEtBQUs7UUFDL0IsTUFBTUMsVUFBVSxHQUFHdEUsUUFBUSxDQUFDQyxhQUFhLENBQUMsUUFBUSxDQUFDO1FBQ25EcUUsVUFBVSxDQUFDakUsU0FBUyxDQUFDQyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ2hDZ0UsVUFBVSxDQUFDL0QsT0FBTyxDQUFDMkQsR0FBRyxHQUFHQyxRQUFRO1FBQ2pDRyxVQUFVLENBQUMvRCxPQUFPLENBQUNnRSxNQUFNLEdBQUdGLFdBQVc7UUFFdkMsSUFBSUQsSUFBSSxZQUFZN0csNkNBQUksRUFBRTtVQUN0QitHLFVBQVUsQ0FBQ2pFLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLE1BQU0sQ0FBQztVQUNoQ2dFLFVBQVUsQ0FBQzlDLGdCQUFnQixDQUFDLFdBQVcsRUFBR2IsS0FBSyxJQUFLO1lBQ2hELElBQUlBLEtBQUssQ0FBQ2dFLE1BQU0sSUFBSSxDQUFDLEVBQUU7Y0FDbkJuQixZQUFZLENBQUMzRCxVQUFVLENBQUNzRSxRQUFRLEVBQUVFLFdBQVcsQ0FBQztjQUM5Q3lCLGtCQUFrQixDQUFDLENBQUM7Y0FDcEJQLFVBQVUsQ0FBQyxDQUFDO2NBQ1o7WUFDSjtZQUNBL0IsWUFBWSxDQUFDcEUsVUFBVSxDQUFDK0UsUUFBUSxFQUFFRSxXQUFXLENBQUM7WUFDOUN5QixrQkFBa0IsQ0FBQyxDQUFDO1lBQ3BCUCxVQUFVLENBQUMsQ0FBQztVQUNoQixDQUFDLENBQUM7UUFDTixDQUFDLE1BQU07VUFDSGpCLFVBQVUsQ0FBQzlDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxNQUFNO1lBQ3pDLE1BQU1oQixTQUFTLEdBQUdSLFFBQVEsQ0FBQzBCLGFBQWEsQ0FBQyxhQUFhLENBQUM7WUFDdkQsSUFBSWxCLFNBQVMsRUFBRTtjQUNYLE1BQU0zQyxNQUFNLEdBQUdtSSxRQUFRLENBQUN4RixTQUFTLENBQUNELE9BQU8sQ0FBQzFDLE1BQU0sQ0FBQztjQUNqRCxNQUFNVSxVQUFVLEdBQ1ppQyxTQUFTLENBQUNELE9BQU8sQ0FBQ2hDLFVBQVUsS0FBSyxNQUFNO2NBQzNDLElBQ0lpRixZQUFZLENBQUM3RSxZQUFZLENBQ3JCd0YsUUFBUSxFQUNSRSxXQUFXLEVBQ1h4RyxNQUFNLEVBQ05VLFVBQ0osQ0FBQyxFQUNIO2dCQUNFaUYsWUFBWSxDQUFDNUUsU0FBUyxDQUNsQnVGLFFBQVEsRUFDUkUsV0FBVyxFQUNYeEcsTUFBTSxFQUNOVSxVQUNKLENBQUM7Z0JBQ0RpRixZQUFZLENBQUMvQixlQUFlLENBQUMsQ0FBQztnQkFDOUJxRSxrQkFBa0IsQ0FBQyxDQUFDO2dCQUNwQlAsVUFBVSxDQUFDLENBQUM7Y0FDaEIsQ0FBQyxNQUFNO2dCQUNIO2NBQ0o7WUFDSjtVQUNKLENBQUMsQ0FBQztRQUNOO1FBRUFuQyxlQUFlLENBQUMzQyxXQUFXLENBQUM2RCxVQUFVLENBQUM7TUFDM0MsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0lBRUZqQixlQUFlLENBQUNZLFdBQVcsR0FBRyxFQUFFO0lBQ2hDLElBQUlmLE9BQU8sQ0FBQ2hCLFFBQVEsRUFBRTtNQUNsQnVCLFlBQVksQ0FBQy9GLEtBQUssQ0FBQ1csT0FBTyxDQUFDLENBQUM2RixHQUFHLEVBQUVDLFFBQVEsS0FBSztRQUMxQ0QsR0FBRyxDQUFDN0YsT0FBTyxDQUFDLENBQUMrRixJQUFJLEVBQUVDLFdBQVcsS0FBSztVQUMvQixNQUFNQyxVQUFVLEdBQUd0RSxRQUFRLENBQUNDLGFBQWEsQ0FBQyxRQUFRLENBQUM7VUFDbkRxRSxVQUFVLENBQUNqRSxTQUFTLENBQUNDLEdBQUcsQ0FBQyxNQUFNLENBQUM7VUFDaENnRSxVQUFVLENBQUMvRCxPQUFPLENBQUMyRCxHQUFHLEdBQUdDLFFBQVE7VUFDakNHLFVBQVUsQ0FBQy9ELE9BQU8sQ0FBQ2dFLE1BQU0sR0FBR0YsV0FBVztVQUN2Q0MsVUFBVSxDQUFDUCxRQUFRLEdBQUcsSUFBSTtVQUMxQixJQUFJSyxJQUFJLFlBQVk3Ryw2Q0FBSSxFQUFFO1lBQ3RCK0csVUFBVSxDQUFDakUsU0FBUyxDQUFDQyxHQUFHLENBQUMsTUFBTSxDQUFDO1VBQ3BDO1VBQ0ErQyxlQUFlLENBQUM1QyxXQUFXLENBQUM2RCxVQUFVLENBQUM7UUFDM0MsQ0FBQyxDQUFDO01BQ04sQ0FBQyxDQUFDO0lBQ04sQ0FBQyxNQUFNO01BQ0hiLFlBQVksQ0FBQy9GLEtBQUssQ0FBQ1csT0FBTyxDQUFDLENBQUM2RixHQUFHLEVBQUVDLFFBQVEsS0FBSztRQUMxQ0QsR0FBRyxDQUFDN0YsT0FBTyxDQUFDLENBQUMrRixJQUFJLEVBQUVDLFdBQVcsS0FBSztVQUMvQixNQUFNQyxVQUFVLEdBQUd0RSxRQUFRLENBQUNDLGFBQWEsQ0FBQyxRQUFRLENBQUM7VUFDbkRxRSxVQUFVLENBQUNqRSxTQUFTLENBQUNDLEdBQUcsQ0FBQyxNQUFNLENBQUM7VUFDaENnRSxVQUFVLENBQUMvRCxPQUFPLENBQUMyRCxHQUFHLEdBQUdDLFFBQVE7VUFDakNHLFVBQVUsQ0FBQy9ELE9BQU8sQ0FBQ2dFLE1BQU0sR0FBR0YsV0FBVztVQUN2QyxJQUFJRCxJQUFJLFlBQVk3Ryw2Q0FBSSxFQUFFO1lBQ3RCK0csVUFBVSxDQUFDakUsU0FBUyxDQUFDQyxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQ2hDZ0UsVUFBVSxDQUFDOUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFHYixLQUFLLElBQUs7Y0FDaEQsSUFBSUEsS0FBSyxDQUFDZ0UsTUFBTSxJQUFJLENBQUMsRUFBRTtnQkFDbkJsQixZQUFZLENBQUM1RCxVQUFVLENBQUNzRSxRQUFRLEVBQUVFLFdBQVcsQ0FBQztnQkFDOUN5QixrQkFBa0IsQ0FBQyxDQUFDO2dCQUNwQk4sVUFBVSxDQUFDLENBQUM7Z0JBQ1o7Y0FDSjtjQUNBL0IsWUFBWSxDQUFDckUsVUFBVSxDQUFDK0UsUUFBUSxFQUFFRSxXQUFXLENBQUM7Y0FDOUN5QixrQkFBa0IsQ0FBQyxDQUFDO2NBQ3BCTixVQUFVLENBQUMsQ0FBQztZQUNoQixDQUFDLENBQUM7VUFDTixDQUFDLE1BQU07WUFDSGxCLFVBQVUsQ0FBQzlDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxNQUFNO2NBQ3pDLE1BQU1oQixTQUFTLEdBQ1hSLFFBQVEsQ0FBQzBCLGFBQWEsQ0FBQyxhQUFhLENBQUM7Y0FDekMsSUFBSWxCLFNBQVMsRUFBRTtnQkFDWCxNQUFNM0MsTUFBTSxHQUFHbUksUUFBUSxDQUNuQnhGLFNBQVMsQ0FBQ0QsT0FBTyxDQUFDMUMsTUFDdEIsQ0FBQztnQkFDRCxNQUFNVSxVQUFVLEdBQ1ppQyxTQUFTLENBQUNELE9BQU8sQ0FBQ2hDLFVBQVUsS0FBSyxNQUFNO2dCQUMzQyxJQUNJa0YsWUFBWSxDQUFDOUUsWUFBWSxDQUNyQndGLFFBQVEsRUFDUkUsV0FBVyxFQUNYeEcsTUFBTSxFQUNOVSxVQUNKLENBQUMsRUFDSDtrQkFDRWtGLFlBQVksQ0FBQzdFLFNBQVMsQ0FDbEJ1RixRQUFRLEVBQ1JFLFdBQVcsRUFDWHhHLE1BQU0sRUFDTlUsVUFDSixDQUFDO2tCQUNEa0YsWUFBWSxDQUFDaEMsZUFBZSxDQUFDLENBQUM7a0JBQzlCcUUsa0JBQWtCLENBQUMsQ0FBQztrQkFDcEJOLFVBQVUsQ0FBQyxDQUFDO2dCQUNoQixDQUFDLE1BQU07a0JBQ0g7Z0JBQ0o7Y0FDSjtZQUNKLENBQUMsQ0FBQztVQUNOO1VBQ0FuQyxlQUFlLENBQUM1QyxXQUFXLENBQUM2RCxVQUFVLENBQUM7UUFDM0MsQ0FBQyxDQUFDO01BQ04sQ0FBQyxDQUFDO0lBQ047RUFDSjtFQUNBLFNBQVN5QixxQkFBcUJBLENBQUEsRUFBRztJQUM3QjtJQUNBLE1BQU1FLFdBQVcsR0FBR3RDLFFBQVEsQ0FBQ3VDLFNBQVMsQ0FBQyxJQUFJLENBQUM7SUFDNUN2QyxRQUFRLENBQUN3QyxXQUFXLENBQUNGLFdBQVcsQ0FBQztJQUNqQztJQUNBQSxXQUFXLENBQUN6RSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTTtNQUN4QyxJQUNJLENBQUMwQixPQUFPLENBQUNoQixRQUFRLElBQ2pCLENBQUNsQyxRQUFRLENBQUMwQixhQUFhLENBQUMsS0FBSyxDQUFDLENBQUNBLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQ3FDLFFBQVEsRUFDakU7UUFDRXFDLGtCQUFrQixDQUFDLENBQUM7UUFDcEI7TUFDSjtNQUNBbkQsZ0JBQWdCLENBQUM3RyxPQUFPLEVBQUU4RyxPQUFPLENBQUM7SUFDdEMsQ0FBQyxDQUFDO0VBQ047RUFFQSxTQUFTa0Qsa0JBQWtCQSxDQUFBLEVBQUc7SUFDMUIsTUFBTXJCLE1BQU0sR0FBRy9FLFFBQVEsQ0FBQzBCLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQ2dELGdCQUFnQixDQUFDLFFBQVEsQ0FBQztJQUN2RSxNQUFNTSxNQUFNLEdBQUdoRixRQUFRLENBQUMwQixhQUFhLENBQUMsS0FBSyxDQUFDLENBQUNnRCxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7SUFDdkVLLE1BQU0sQ0FBQzFHLE9BQU8sQ0FBRTRHLEdBQUcsSUFBSztNQUNwQkEsR0FBRyxDQUFDbEIsUUFBUSxHQUFHLElBQUk7SUFDdkIsQ0FBQyxDQUFDO0lBQ0ZpQixNQUFNLENBQUMzRyxPQUFPLENBQUU0RyxHQUFHLElBQUs7TUFDcEJBLEdBQUcsQ0FBQ2xCLFFBQVEsR0FBRyxLQUFLO0lBQ3hCLENBQUMsQ0FBQztJQUNGRixRQUFRLENBQUNFLFFBQVEsR0FBRyxJQUFJO0lBQ3hCRCxPQUFPLENBQUNDLFFBQVEsR0FBRyxJQUFJO0lBQ3ZCOEIsYUFBYSxHQUFHM0MsT0FBTztJQUN2QkksV0FBVyxDQUFDVyxXQUFXLEdBQ25CLGlEQUFpRDtFQUN6RDtFQUVBWCxXQUFXLENBQUNXLFdBQVcsR0FBRyxpREFBaUQ7RUFDM0VWLFdBQVcsQ0FBQ1UsV0FBVyxHQUFHLHdDQUF3QztFQUNsRTZCLGtCQUFrQixDQUFDLENBQUM7RUFDcEJQLFVBQVUsQ0FBQyxDQUFDO0VBRVo3QixjQUFjLENBQUNsQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTTtJQUMzQ3FFLGFBQWEsQ0FBQy9JLFNBQVMsQ0FBQ3FDLGFBQWEsQ0FBQyxDQUFDO0lBQ3ZDMEcsYUFBYSxDQUFDL0ksU0FBUyxDQUFDcUIsZUFBZSxDQUFDLENBQUM7SUFDekMySCxrQkFBa0IsQ0FBQyxDQUFDO0lBQ3BCRCxhQUFhLElBQUl6SixPQUFPLEdBQUdtSixVQUFVLENBQUMsQ0FBQyxHQUFHQyxVQUFVLENBQUMsQ0FBQztFQUMxRCxDQUFDLENBQUM7RUFDRk8scUJBQXFCLENBQUMzSixPQUFPLEVBQUU4RyxPQUFPLENBQUM7RUFDdkNVLFVBQVUsQ0FBQ3BDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNO0lBQ3ZDZ0MsWUFBWSxDQUFDdkYsS0FBSyxHQUFHLEVBQUU7SUFDdkJ1RixZQUFZLENBQUN6RixhQUFhLEdBQUcsRUFBRTtJQUMvQnlGLFlBQVksQ0FBQ3hGLFVBQVUsR0FBRyxFQUFFO0lBQzVCeUYsWUFBWSxDQUFDeEYsS0FBSyxHQUFHLEVBQUU7SUFDdkJ3RixZQUFZLENBQUMxRixhQUFhLEdBQUcsRUFBRTtJQUMvQjBGLFlBQVksQ0FBQ3pGLFVBQVUsR0FBRyxFQUFFO0lBQzVCMEgsWUFBWSxDQUFDLENBQUM7RUFDbEIsQ0FBQyxDQUFDO0FBQ047QUFFQSxTQUFTRixVQUFVQSxDQUFBLEVBQUc7RUFDbEIsTUFBTVQsTUFBTSxHQUFHL0UsUUFBUSxDQUFDMEIsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDZ0QsZ0JBQWdCLENBQUMsUUFBUSxDQUFDO0VBQ3ZFSyxNQUFNLENBQUMxRyxPQUFPLENBQUU0RyxHQUFHLElBQUs7SUFDcEJBLEdBQUcsQ0FBQ2xCLFFBQVEsR0FBRyxJQUFJO0VBQ3ZCLENBQUMsQ0FBQztBQUNOO0FBRUEsU0FBU3dCLFVBQVVBLENBQUEsRUFBRztFQUNsQixNQUFNUCxNQUFNLEdBQUdoRixRQUFRLENBQUMwQixhQUFhLENBQUMsS0FBSyxDQUFDLENBQUNnRCxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7RUFDdkVNLE1BQU0sQ0FBQzNHLE9BQU8sQ0FBRTRHLEdBQUcsSUFBSztJQUNwQkEsR0FBRyxDQUFDbEIsUUFBUSxHQUFHLElBQUk7RUFDdkIsQ0FBQyxDQUFDO0FBQ047QUFFQTJCLFlBQVksQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVDb250cm9sbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS5jc3M/NzE2MyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBHYW1lQ29udHJvbGxlcihwbGF5ZXIxLCBjb20pIHtcbiAgICBsZXQgYWN0aXZlUGxheWVyID0gcGxheWVyMTtcbiAgICBsZXQgbmV4dFBsYXllciA9IGNvbTtcbiAgICBsZXQgdGVtcFBsYXllcjtcbiAgICBjb25zdCBnZXRBY3RpdmVQbGF5ZXIgPSAoKSA9PiBhY3RpdmVQbGF5ZXI7XG4gICAgY29uc3QgZ2V0T3Bwb25lbnQgPSAoKSA9PiBuZXh0UGxheWVyO1xuXG4gICAgY29uc3Qgc3dpdGNoUGxheWVyVHVybiA9ICgpID0+IHtcbiAgICAgICAgdGVtcFBsYXllciA9IGFjdGl2ZVBsYXllcjtcbiAgICAgICAgYWN0aXZlUGxheWVyID0gbmV4dFBsYXllcjtcbiAgICAgICAgbmV4dFBsYXllciA9IHRlbXBQbGF5ZXI7XG4gICAgfTtcblxuICAgIGNvbnN0IHdpbkNvbmRpdGlvbiA9IChvcHBvbmVudCkgPT4ge1xuICAgICAgICByZXR1cm4gb3Bwb25lbnQuZ2FtZWJvYXJkLmFsbFNoaXBzU3VuaygpO1xuICAgIH07XG5cbiAgICBjb25zdCBwbGF5Um91bmQgPSAoeCwgeSkgPT4ge1xuICAgICAgICBsZXQgbWVzc2FnZSA9IGAke2FjdGl2ZVBsYXllci5uYW1lfSBkcm9wcGVkIGEgYm9tYiB0byAke25leHRQbGF5ZXIubmFtZX0ncyBib2FyZC4uLmA7XG4gICAgICAgIGlmICghYWN0aXZlUGxheWVyLmNoZWNrQXR0YWNrKG5leHRQbGF5ZXIsIHgsIHkpKSB7XG4gICAgICAgICAgICBtZXNzYWdlID0gXCJUaGlzIENvb3JkaW5hdGUgaGFzIGJlZW4gYm9tYmVkIVwiO1xuICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhY3RpdmVQbGF5ZXIuYXR0YWNrKG5leHRQbGF5ZXIsIHgsIHkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh3aW5Db25kaXRpb24obmV4dFBsYXllcikpIHtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBgJHthY3RpdmVQbGF5ZXIubmFtZX0gV2lucyFgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3dpdGNoUGxheWVyVHVybigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgIH07XG5cbiAgICByZXR1cm4geyBnZXRBY3RpdmVQbGF5ZXIsIGdldE9wcG9uZW50LCB3aW5Db25kaXRpb24sIHBsYXlSb3VuZCB9O1xufVxuIiwiaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lYm9hcmQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmJvYXJkID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKCkgPT4gQXJyYXkoMTApLmZpbGwobnVsbCkpO1xuICAgICAgICB0aGlzLm1pc3NlZEF0dGFja3MgPSBbXTtcbiAgICAgICAgdGhpcy5oaXRBdHRhY2tzID0gW107XG4gICAgICAgIHRoaXMuc2hpcHMgPSBbXTtcbiAgICAgICAgdGhpcy5sYXN0SGl0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcGxhY2VTaGlwUmFuZG9tKCkge1xuICAgICAgICBjb25zdCBzaGlwTGVuZ3RocyA9IFs1LCA0LCAzLCAzLCAyXTtcblxuICAgICAgICBzaGlwTGVuZ3Rocy5mb3JFYWNoKChsZW5ndGgpID0+IHtcbiAgICAgICAgICAgIGxldCBwbGFjZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHdoaWxlICghcGxhY2VkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNWZXJ0aWNhbCA9IE1hdGgucmFuZG9tKCkgPCAwLjU7XG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiAoaXNWZXJ0aWNhbCA/IDEwIC0gbGVuZ3RoIDogMTApXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIChpc1ZlcnRpY2FsID8gMTAgOiAxMCAtIGxlbmd0aClcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2FuUGxhY2VTaGlwKHgsIHksIGxlbmd0aCwgaXNWZXJ0aWNhbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGFjZVNoaXAoeCwgeSwgbGVuZ3RoLCBpc1ZlcnRpY2FsKTtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNhblBsYWNlU2hpcCh4LCB5LCBsZW5ndGgsIGlzVmVydGljYWwgPSB0cnVlKSB7XG4gICAgICAgIGlmIChpc1ZlcnRpY2FsKSB7XG4gICAgICAgICAgICBpZiAoeCArIGxlbmd0aCA+IDEwKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbeCArIGldW3ldICE9PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoeSArIGxlbmd0aCA+IDEwKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbeF1beSArIGldICE9PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcGxhY2VTaGlwKHgsIHksIGxlbmd0aCwgaXNWZXJ0aWNhbCA9IHRydWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNhblBsYWNlU2hpcCh4LCB5LCBsZW5ndGgsIGlzVmVydGljYWwpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAobGVuZ3RoLCBpc1ZlcnRpY2FsKTtcbiAgICAgICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW3ggKyBpXVt5XSA9IHNoaXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaGlwLmNvb3JkLnB1c2goeCk7XG4gICAgICAgICAgICBzaGlwLmNvb3JkLnB1c2goeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZFt4XVt5ICsgaV0gPSBzaGlwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2hpcC5jb29yZC5wdXNoKHgpO1xuICAgICAgICAgICAgc2hpcC5jb29yZC5wdXNoKHkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2hpcHMucHVzaChzaGlwKTtcbiAgICB9XG5cbiAgICByZW1vdmVBbGxTaGlwKCkge1xuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDEwOyB4KyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgMTA7IHkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3hdW3ldICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbeF1beV0gPSBudWxsOyAvLyBSZW1vdmUgdGhlIHNoaXAgcmVmZXJlbmNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2hpcHMgPSBbXTtcbiAgICB9XG5cbiAgICByZW1vdmVTaGlwKHgsIHkpIHtcbiAgICAgICAgaWYgKCF0aGlzLmJvYXJkW3hdW3ldKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzaGlwID0gdGhpcy5ib2FyZFt4XVt5XTtcbiAgICAgICAgICAgIGNvbnN0IHNoaXBMZW5ndGggPSBzaGlwLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnN0IHNoaXBJbmRleCA9IHRoaXMuc2hpcHMuZmluZEluZGV4KFxuICAgICAgICAgICAgICAgICh0aGVTaGlwKSA9PlxuICAgICAgICAgICAgICAgICAgICB0aGVTaGlwLmNvb3JkWzBdID09PSBzaGlwLmNvb3JkWzBdICYmXG4gICAgICAgICAgICAgICAgICAgIHRoZVNoaXAuY29vcmRbMV0gPT09IHNoaXAuY29vcmRbMV1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBhID0gc2hpcC5jb29yZFswXTtcbiAgICAgICAgICAgIGNvbnN0IGIgPSBzaGlwLmNvb3JkWzFdO1xuICAgICAgICAgICAgaWYgKHNoaXAuaXNWZXJ0aWNhbCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW2EgKyBpXVtiXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFthXVtiICsgaV0gPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2hpcHMuc3BsaWNlKHNoaXBJbmRleCwgMSk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUdob3N0U2hpcChzaGlwTGVuZ3RoLCBzaGlwLmlzVmVydGljYWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcm90YXRlU2hpcCh4LCB5KSB7XG4gICAgICAgIGlmICghdGhpcy5ib2FyZFt4XVt5XSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgc2hpcCA9IHRoaXMuYm9hcmRbeF1beV07XG4gICAgICAgICAgICBjb25zdCBzaGlwTGVuZ3RoID0gc2hpcC5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBuZXdEaXIgPSAhc2hpcC5pc1ZlcnRpY2FsO1xuICAgICAgICAgICAgY29uc3QgYSA9IHNoaXAuY29vcmRbMF07XG4gICAgICAgICAgICBjb25zdCBiID0gc2hpcC5jb29yZFsxXTtcbiAgICAgICAgICAgIGlmIChzaGlwLmlzVmVydGljYWwpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFthICsgaV1bYl0gPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbYV1bYiArIGldID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jYW5QbGFjZVNoaXAoYSwgYiwgc2hpcExlbmd0aCwgbmV3RGlyKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGxhY2VTaGlwKGEsIGIsIHNoaXBMZW5ndGgsIG5ld0Rpcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghbmV3RGlyKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFthICsgaV1bYl0gPSBzaGlwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW2FdW2IgKyBpXSA9IHNoaXA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVHaG9zdFNoaXAobGVuZ3RoLCBpc1ZlcnRpY2FsKSB7XG4gICAgICAgIGNvbnN0IGNyZWF0ZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGlmIChpc1ZlcnRpY2FsKSB7XG4gICAgICAgICAgICBjcmVhdGVDb250YWluZXIuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9IGByZXBlYXQoJHtsZW5ndGh9LCAyLjVyZW0pYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRhaW5lci5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgke2xlbmd0aH0sIDIuNXJlbSlgO1xuICAgICAgICB9XG4gICAgICAgIGNyZWF0ZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiZ2hvc3RTaGlwc1wiKTtcbiAgICAgICAgY3JlYXRlQ29udGFpbmVyLmRhdGFzZXQubGVuZ3RoID0gbGVuZ3RoO1xuICAgICAgICBjcmVhdGVDb250YWluZXIuZGF0YXNldC5pc1ZlcnRpY2FsID0gaXNWZXJ0aWNhbDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBnaG9zdFNoaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgZ2hvc3RTaGlwLmNsYXNzTGlzdC5hZGQoXCJnaG9zdFwiKTtcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRhaW5lci5hcHBlbmRDaGlsZChnaG9zdFNoaXApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1vdmVDdXJzb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHkgPSBldmVudC5wYWdlWTtcbiAgICAgICAgICAgIGNvbnN0IHggPSBldmVudC5wYWdlWDtcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbExlZnQgPVxuICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxYICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgPyB3aW5kb3cuc2Nyb2xsWFxuICAgICAgICAgICAgICAgICAgICA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5XG4gICAgICAgICAgICAgICAgICAgICAgKS5zY3JvbGxMZWZ0O1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsVG9wID1cbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsWSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgID8gd2luZG93LnNjcm9sbFlcbiAgICAgICAgICAgICAgICAgICAgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keVxuICAgICAgICAgICAgICAgICAgICAgICkuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgY3JlYXRlQ29udGFpbmVyLnN0eWxlLmxlZnQgPSB4IC0gc2Nyb2xsTGVmdCArIFwicHhcIjtcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRhaW5lci5zdHlsZS50b3AgPSB5IC0gc2Nyb2xsVG9wICsgXCJweFwiO1xuICAgICAgICB9O1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNyZWF0ZUNvbnRhaW5lcik7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW92ZUN1cnNvcik7XG4gICAgfVxuXG4gICAgcmVtb3ZlR2hvc3RTaGlwKCkge1xuICAgICAgICBjb25zdCBnaG9zdFNoaXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdob3N0U2hpcHNcIik7XG4gICAgICAgIGdob3N0U2hpcC5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICByZWNlaXZlQXR0YWNrKHgsIHkpIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmRbeF1beV0pIHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmRbeF1beV0uaGl0KCk7XG4gICAgICAgICAgICB0aGlzLmhpdEF0dGFja3MucHVzaChbeCwgeV0pO1xuICAgICAgICAgICAgdGhpcy5sYXN0SGl0ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubWlzc2VkQXR0YWNrcy5wdXNoKFt4LCB5XSk7XG4gICAgICAgICAgICB0aGlzLmxhc3RIaXQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFsbFNoaXBzU3VuaygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2hpcHMuZXZlcnkoKHNoaXApID0+IHNoaXAuaXNTdW5rKCkpO1xuICAgIH1cbn1cbiIsImltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgaXNDb21wdXRlciA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuZ2FtZWJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuICAgICAgICB0aGlzLmNvbXB1dGVyID0gaXNDb21wdXRlcjtcbiAgICB9XG5cbiAgICBhdHRhY2sob3Bwb25lbnQsIHgsIHkpIHtcbiAgICAgICAgcmV0dXJuIG9wcG9uZW50LmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuICAgIH1cblxuICAgIGNoZWNrQXR0YWNrKG9wcG9uZW50LCB4LCB5KSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIG9wcG9uZW50LmdhbWVib2FyZC5oaXRBdHRhY2tzLnNvbWUoXG4gICAgICAgICAgICAgICAgKGNvbWJvKSA9PiBjb21ib1swXSA9PT0geCAmJiBjb21ib1sxXSA9PT0geVxuICAgICAgICAgICAgKSB8fFxuICAgICAgICAgICAgb3Bwb25lbnQuZ2FtZWJvYXJkLm1pc3NlZEF0dGFja3Muc29tZShcbiAgICAgICAgICAgICAgICAoY29tYm8pID0+IGNvbWJvWzBdID09PSB4ICYmIGNvbWJvWzFdID09PSB5XG4gICAgICAgICAgICApXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRSYW5kb21Qb3Mob3Bwb25lbnQpIHtcbiAgICAgICAgbGV0IHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICAgIGxldCB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgICBpZiAoIXRoaXMuY2hlY2tBdHRhY2sob3Bwb25lbnQsIHgsIHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRSYW5kb21Qb3Mob3Bwb25lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFt4LCB5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXRSYW5kb21EaXJlY3Rpb24ob3Bwb25lbnQsIHgsIHkpIHtcbiAgICAgICAgY29uc3QgZGlyZWN0aW9ucyA9IFtcbiAgICAgICAgICAgIFt4ICsgMSwgeV0sXG4gICAgICAgICAgICBbeCAtIDEsIHldLFxuICAgICAgICAgICAgW3gsIHkgKyAxXSxcbiAgICAgICAgICAgIFt4LCB5IC0gMV0sXG4gICAgICAgIF07XG5cbiAgICAgICAgY29uc3QgdmFsaWREaXJlY3Rpb25zID0gZGlyZWN0aW9ucy5maWx0ZXIoKGNvbWJvKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBbbmV3WCwgbmV3WV0gPSBjb21ibztcbiAgICAgICAgICAgIGNvbnN0IGlzVmFsaWQgPVxuICAgICAgICAgICAgICAgIG5ld1ggPj0gMCAmJlxuICAgICAgICAgICAgICAgIG5ld1ggPD0gOSAmJlxuICAgICAgICAgICAgICAgIG5ld1kgPj0gMCAmJlxuICAgICAgICAgICAgICAgIG5ld1kgPD0gOSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tBdHRhY2sob3Bwb25lbnQsIG5ld1gsIG5ld1kpO1xuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQgJiYgIShuZXdYID09PSB4ICYmIG5ld1kgPT09IHkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodmFsaWREaXJlY3Rpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB2YWxpZERpcmVjdGlvbnMubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgbmV3UG9zID0gdmFsaWREaXJlY3Rpb25zW3JhbmRvbUluZGV4XTtcblxuICAgICAgICByZXR1cm4gbmV3UG9zO1xuICAgIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXAge1xuICAgIGNvbnN0cnVjdG9yKGxlbmd0aCwgaXNWZXJ0aWNhbCkge1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICAgICAgdGhpcy5iZWVuSGl0ID0gMDtcbiAgICAgICAgdGhpcy5zdW5rID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29vcmQgPSBbXTtcbiAgICAgICAgdGhpcy5pc1ZlcnRpY2FsID0gaXNWZXJ0aWNhbDtcbiAgICB9XG5cbiAgICBoaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmJlZW5IaXQgPCB0aGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5iZWVuSGl0Kys7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc1N1bmsoKTtcbiAgICB9XG5cbiAgICBpc1N1bmsoKSB7XG4gICAgICAgIGlmICh0aGlzLmJlZW5IaXQgPT09IHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnN1bmsgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18gPSBuZXcgVVJMKFwiLi9tZWRpYS9iYWdlbC5wbmdcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYGJvZHkge1xuICAgIG1hcmdpbjogMDtcbiAgICBib3JkZXI6IDA7XG4gICAgd2lkdGg6IDEwMHZ3O1xuICAgIGhlaWdodDogMTAwdmg7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGZvbnQtZmFtaWx5OlxuICAgICAgICBzeXN0ZW0tdWksXG4gICAgICAgIC1hcHBsZS1zeXN0ZW0sXG4gICAgICAgIEJsaW5rTWFjU3lzdGVtRm9udCxcbiAgICAgICAgXCJTZWdvZSBVSVwiLFxuICAgICAgICBSb2JvdG8sXG4gICAgICAgIE94eWdlbixcbiAgICAgICAgVWJ1bnR1LFxuICAgICAgICBDYW50YXJlbGwsXG4gICAgICAgIFwiT3BlbiBTYW5zXCIsXG4gICAgICAgIFwiSGVsdmV0aWNhIE5ldWVcIixcbiAgICAgICAgc2Fucy1zZXJpZjtcbiAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoLTQ1ZGVnLCAjZWU3NzUyLCAjZTczYzdlLCAjMjNhNmQ1LCAjMjNkNWFiKTtcbiAgICBiYWNrZ3JvdW5kLXNpemU6IDQwMCUgNDAwJTtcbiAgICBhbmltYXRpb246IGdyYWRpZW50IDdzIGVhc2UgaW5maW5pdGU7XG59XG5cbkBrZXlmcmFtZXMgZ3JhZGllbnQge1xuICAgIDAlIHtcbiAgICAgICAgYmFja2dyb3VuZC1wb3NpdGlvbjogMCUgNTAlO1xuICAgIH1cbiAgICA1MCUge1xuICAgICAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAxMDAlIDUwJTtcbiAgICB9XG4gICAgMTAwJSB7XG4gICAgICAgIGJhY2tncm91bmQtcG9zaXRpb246IDAlIDUwJTtcbiAgICB9XG59XG5cbmJ1dHRvbjphY3RpdmUge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNlMmRhZDY7XG4gICAgYm9yZGVyOiAwLjFyZW0gc29saWQgIzY0ODJhZDtcbiAgICBjb2xvcjogIzY0ODJhZDtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMC4wMnJlbSk7XG59XG5cbmZvb3RlciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNlZTc2NTJkODtcbiAgICBoZWlnaHQ6IDEwdmg7XG59XG5cbmJ1dHRvbiB7XG4gICAgYm9yZGVyOiAjMWYyOTM3IDAuMXJlbSBzb2xpZDtcbiAgICBib3JkZXItcmFkaXVzOiAycmVtO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyNDcsIDI1MiwgMjU1KTtcbiAgICBjb2xvcjogYmxhY2s7XG4gICAgYWxpZ24tc2VsZjogY2VudGVyO1xufVxuXG5idXR0b246aG92ZXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xufVxuXG4ubWFpbkNvbnRhaW5lciB7XG4gICAgZmxleC1ncm93OiAxO1xuICAgIG1hcmdpbjogMCAzcmVtO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybCgke19fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX199KTtcbiAgICBiYWNrZ3JvdW5kLXNpemU6IDE0dmg7XG4gICAgYmFja2dyb3VuZC1yZXBlYXQ6IHJlcGVhdDtcbn1cblxuLm1haW5Db250YWluZXIgZGl2IHtcbiAgICBmb250LXNpemU6IDJyZW07XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTJkYWQ2YjY7XG4gICAgcGFkZGluZzogMnJlbTtcbiAgICBib3JkZXItcmFkaXVzOiA1cmVtO1xuICAgIG1hcmdpbi1ib3R0b206IDFyZW07XG59XG5cbi5ib2FyZHMge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG59XG5cbi5wMSxcbi5wMiB7XG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgMi41cmVtKTtcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwgMi41cmVtKTtcbn1cblxuLm1haW5Db250YWluZXIgZGl2LmFjdGl2ZSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2U3M2M3ZTtcbn1cblxuLnAxIGJ1dHRvbixcbi5wMiBidXR0b24ge1xuICAgIGhlaWdodDogMi40M3JlbTtcbiAgICB3aWR0aDogMi40M3JlbTtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgYm9yZGVyLXJhZGl1czogMDtcbn1cblxuLnNoaXAge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICMxZjI5MzdlNTtcbn1cblxuLm1pc3NlZCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2UyZGFkNmM3O1xufVxuXG4ubWlzc2VkOjphZnRlciB7XG4gICAgY29udGVudDogXCJYXCI7XG59XG5cbi5oaXQge1xuICAgIGNvbG9yOiAjZmFmYWZhO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNlOTllODc7XG59XG5cbi5oaXQ6OmFmdGVyIHtcbiAgICBjb250ZW50OiBcIk9cIjtcbn1cblxuLnNldCBidXR0b246ZGlzYWJsZWQge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNlMmRhZDZjNztcbn1cblxuLnBsYXkgYnV0dG9uOm5vdCg6ZGlzYWJsZWQpIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTJkYWQ2Yzc7XG59XG5cbi5oaWRlIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTJkYWQ2Yzc7XG59XG5cbi5naG9zdFNoaXBzIHtcbiAgICBkaXNwbGF5OiBncmlkO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNlMmRhZDZiNjtcbiAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG59XG5cbi5naG9zdCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzFmMjkzNztcbiAgICBoZWlnaHQ6IDIuNDNyZW07XG4gICAgd2lkdGg6IDIuNDNyZW07XG59XG5cbi5idG5zIHtcbiAgICB3aWR0aDogNDB2dztcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG4gICAgcGFkZGluZzogMDtcbn1cblxuLmJ0bnMgYnV0dG9uIHtcbiAgICBoZWlnaHQ6IDIuNXJlbTtcbiAgICB3aWR0aDogOHJlbTtcbiAgICBmb250LXNpemU6IDFyZW07XG59XG5cbmZpZWxkc2V0IHtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgd2lkdGg6IDQwdnc7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xuICAgIHBhZGRpbmc6IDA7XG59XG5cbmxlZ2VuZCB7XG4gICAgZm9udC1zaXplOiAxLjRyZW07XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIG1hcmdpbi1ib3R0b206IDFyZW07XG59XG5cbi5tYWluQ29udGFpbmVyIGZpZWxkc2V0IGRpdiB7XG4gICAgd2lkdGg6IDEwdnc7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIHBhZGRpbmc6IDA7XG59XG5cbmxhYmVsIHtcbiAgICBmb250LXNpemU6IDEuMnJlbTtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICB3aWR0aDogOHJlbTtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgcGFkZGluZzogMXJlbSAycmVtO1xuICAgIGJvcmRlci1yYWRpdXM6IDVyZW07XG59XG5cbmlucHV0IHtcbiAgICBhcHBlYXJhbmNlOiBub25lO1xuICAgIGhlaWdodDogMDtcbiAgICB3aWR0aDogMDtcbiAgICBtYXJnaW46IDA7XG59XG5cbmZpZWxkc2V0IGRpdjpoYXMoaW5wdXQ6Y2hlY2tlZCkge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNlZTc3NTI7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7SUFDSSxTQUFTO0lBQ1QsU0FBUztJQUNULFlBQVk7SUFDWixhQUFhO0lBQ2IsYUFBYTtJQUNiLHNCQUFzQjtJQUN0Qjs7Ozs7Ozs7Ozs7a0JBV2M7SUFDZCx1RUFBdUU7SUFDdkUsMEJBQTBCO0lBQzFCLG9DQUFvQztBQUN4Qzs7QUFFQTtJQUNJO1FBQ0ksMkJBQTJCO0lBQy9CO0lBQ0E7UUFDSSw2QkFBNkI7SUFDakM7SUFDQTtRQUNJLDJCQUEyQjtJQUMvQjtBQUNKOztBQUVBO0lBQ0kseUJBQXlCO0lBQ3pCLDRCQUE0QjtJQUM1QixjQUFjO0lBQ2QsOEJBQThCO0FBQ2xDOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHVCQUF1QjtJQUN2QixtQkFBbUI7SUFDbkIsMkJBQTJCO0lBQzNCLFlBQVk7QUFDaEI7O0FBRUE7SUFDSSw0QkFBNEI7SUFDNUIsbUJBQW1CO0lBQ25CLG9DQUFvQztJQUNwQyxZQUFZO0lBQ1osa0JBQWtCO0FBQ3RCOztBQUVBO0lBQ0ksNkJBQTZCO0FBQ2pDOztBQUVBO0lBQ0ksWUFBWTtJQUNaLGNBQWM7SUFDZCxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLHVCQUF1QjtJQUN2QixtQkFBbUI7SUFDbkIseURBQTBDO0lBQzFDLHFCQUFxQjtJQUNyQix5QkFBeUI7QUFDN0I7O0FBRUE7SUFDSSxlQUFlO0lBQ2YsZ0JBQWdCO0lBQ2hCLDJCQUEyQjtJQUMzQixhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLFdBQVc7SUFDWCxhQUFhO0lBQ2IsNkJBQTZCO0FBQ2pDOztBQUVBOztJQUVJLGFBQWE7SUFDYix5Q0FBeUM7SUFDekMsc0NBQXNDO0FBQzFDOztBQUVBO0lBQ0kseUJBQXlCO0FBQzdCOztBQUVBOztJQUVJLGVBQWU7SUFDZixjQUFjO0lBQ2QsWUFBWTtJQUNaLGdCQUFnQjtBQUNwQjs7QUFFQTtJQUNJLDJCQUEyQjtBQUMvQjs7QUFFQTtJQUNJLDJCQUEyQjtBQUMvQjs7QUFFQTtJQUNJLFlBQVk7QUFDaEI7O0FBRUE7SUFDSSxjQUFjO0lBQ2QseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksWUFBWTtBQUNoQjs7QUFFQTtJQUNJLDJCQUEyQjtBQUMvQjs7QUFFQTtJQUNJLDJCQUEyQjtBQUMvQjs7QUFFQTtJQUNJLDJCQUEyQjtBQUMvQjs7QUFFQTtJQUNJLGFBQWE7SUFDYiwyQkFBMkI7SUFDM0IsZUFBZTtJQUNmLG9CQUFvQjtBQUN4Qjs7QUFFQTtJQUNJLHlCQUF5QjtJQUN6QixlQUFlO0lBQ2YsY0FBYztBQUNsQjs7QUFFQTtJQUNJLFdBQVc7SUFDWCxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixVQUFVO0FBQ2Q7O0FBRUE7SUFDSSxjQUFjO0lBQ2QsV0FBVztJQUNYLGVBQWU7QUFDbkI7O0FBRUE7SUFDSSxZQUFZO0lBQ1osV0FBVztJQUNYLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLFVBQVU7QUFDZDs7QUFFQTtJQUNJLGlCQUFpQjtJQUNqQixrQkFBa0I7SUFDbEIsbUJBQW1CO0FBQ3ZCOztBQUVBO0lBQ0ksV0FBVztJQUNYLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIscUJBQXFCO0lBQ3JCLG1CQUFtQjtJQUNuQixVQUFVO0FBQ2Q7O0FBRUE7SUFDSSxpQkFBaUI7SUFDakIsY0FBYztJQUNkLFdBQVc7SUFDWCxrQkFBa0I7SUFDbEIsa0JBQWtCO0lBQ2xCLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLGdCQUFnQjtJQUNoQixTQUFTO0lBQ1QsUUFBUTtJQUNSLFNBQVM7QUFDYjs7QUFFQTtJQUNJLHlCQUF5QjtBQUM3QlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJib2R5IHtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBib3JkZXI6IDA7XFxuICAgIHdpZHRoOiAxMDB2dztcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgZm9udC1mYW1pbHk6XFxuICAgICAgICBzeXN0ZW0tdWksXFxuICAgICAgICAtYXBwbGUtc3lzdGVtLFxcbiAgICAgICAgQmxpbmtNYWNTeXN0ZW1Gb250LFxcbiAgICAgICAgXFxcIlNlZ29lIFVJXFxcIixcXG4gICAgICAgIFJvYm90byxcXG4gICAgICAgIE94eWdlbixcXG4gICAgICAgIFVidW50dSxcXG4gICAgICAgIENhbnRhcmVsbCxcXG4gICAgICAgIFxcXCJPcGVuIFNhbnNcXFwiLFxcbiAgICAgICAgXFxcIkhlbHZldGljYSBOZXVlXFxcIixcXG4gICAgICAgIHNhbnMtc2VyaWY7XFxuICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgtNDVkZWcsICNlZTc3NTIsICNlNzNjN2UsICMyM2E2ZDUsICMyM2Q1YWIpO1xcbiAgICBiYWNrZ3JvdW5kLXNpemU6IDQwMCUgNDAwJTtcXG4gICAgYW5pbWF0aW9uOiBncmFkaWVudCA3cyBlYXNlIGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGdyYWRpZW50IHtcXG4gICAgMCUge1xcbiAgICAgICAgYmFja2dyb3VuZC1wb3NpdGlvbjogMCUgNTAlO1xcbiAgICB9XFxuICAgIDUwJSB7XFxuICAgICAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAxMDAlIDUwJTtcXG4gICAgfVxcbiAgICAxMDAlIHtcXG4gICAgICAgIGJhY2tncm91bmQtcG9zaXRpb246IDAlIDUwJTtcXG4gICAgfVxcbn1cXG5cXG5idXR0b246YWN0aXZlIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2UyZGFkNjtcXG4gICAgYm9yZGVyOiAwLjFyZW0gc29saWQgIzY0ODJhZDtcXG4gICAgY29sb3I6ICM2NDgyYWQ7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwLjAycmVtKTtcXG59XFxuXFxuZm9vdGVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNlZTc2NTJkODtcXG4gICAgaGVpZ2h0OiAxMHZoO1xcbn1cXG5cXG5idXR0b24ge1xcbiAgICBib3JkZXI6ICMxZjI5MzcgMC4xcmVtIHNvbGlkO1xcbiAgICBib3JkZXItcmFkaXVzOiAycmVtO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjQ3LCAyNTIsIDI1NSk7XFxuICAgIGNvbG9yOiBibGFjaztcXG4gICAgYWxpZ24tc2VsZjogY2VudGVyO1xcbn1cXG5cXG5idXR0b246aG92ZXIge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG59XFxuXFxuLm1haW5Db250YWluZXIge1xcbiAgICBmbGV4LWdyb3c6IDE7XFxuICAgIG1hcmdpbjogMCAzcmVtO1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFxcXCIuL21lZGlhL2JhZ2VsLnBuZ1xcXCIpO1xcbiAgICBiYWNrZ3JvdW5kLXNpemU6IDE0dmg7XFxuICAgIGJhY2tncm91bmQtcmVwZWF0OiByZXBlYXQ7XFxufVxcblxcbi5tYWluQ29udGFpbmVyIGRpdiB7XFxuICAgIGZvbnQtc2l6ZTogMnJlbTtcXG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2UyZGFkNmI2O1xcbiAgICBwYWRkaW5nOiAycmVtO1xcbiAgICBib3JkZXItcmFkaXVzOiA1cmVtO1xcbiAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xcbn1cXG5cXG4uYm9hcmRzIHtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbn1cXG5cXG4ucDEsXFxuLnAyIHtcXG4gICAgZGlzcGxheTogZ3JpZDtcXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDIuNXJlbSk7XFxuICAgIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEwLCAyLjVyZW0pO1xcbn1cXG5cXG4ubWFpbkNvbnRhaW5lciBkaXYuYWN0aXZlIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2U3M2M3ZTtcXG59XFxuXFxuLnAxIGJ1dHRvbixcXG4ucDIgYnV0dG9uIHtcXG4gICAgaGVpZ2h0OiAyLjQzcmVtO1xcbiAgICB3aWR0aDogMi40M3JlbTtcXG4gICAgYm9yZGVyOiBub25lO1xcbiAgICBib3JkZXItcmFkaXVzOiAwO1xcbn1cXG5cXG4uc2hpcCB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMxZjI5MzdlNTtcXG59XFxuXFxuLm1pc3NlZCB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNlMmRhZDZjNztcXG59XFxuXFxuLm1pc3NlZDo6YWZ0ZXIge1xcbiAgICBjb250ZW50OiBcXFwiWFxcXCI7XFxufVxcblxcbi5oaXQge1xcbiAgICBjb2xvcjogI2ZhZmFmYTtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2U5OWU4NztcXG59XFxuXFxuLmhpdDo6YWZ0ZXIge1xcbiAgICBjb250ZW50OiBcXFwiT1xcXCI7XFxufVxcblxcbi5zZXQgYnV0dG9uOmRpc2FibGVkIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2UyZGFkNmM3O1xcbn1cXG5cXG4ucGxheSBidXR0b246bm90KDpkaXNhYmxlZCkge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTJkYWQ2Yzc7XFxufVxcblxcbi5oaWRlIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2UyZGFkNmM3O1xcbn1cXG5cXG4uZ2hvc3RTaGlwcyB7XFxuICAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNlMmRhZDZiNjtcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG59XFxuXFxuLmdob3N0IHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzFmMjkzNztcXG4gICAgaGVpZ2h0OiAyLjQzcmVtO1xcbiAgICB3aWR0aDogMi40M3JlbTtcXG59XFxuXFxuLmJ0bnMge1xcbiAgICB3aWR0aDogNDB2dztcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxuICAgIHBhZGRpbmc6IDA7XFxufVxcblxcbi5idG5zIGJ1dHRvbiB7XFxuICAgIGhlaWdodDogMi41cmVtO1xcbiAgICB3aWR0aDogOHJlbTtcXG4gICAgZm9udC1zaXplOiAxcmVtO1xcbn1cXG5cXG5maWVsZHNldCB7XFxuICAgIGJvcmRlcjogbm9uZTtcXG4gICAgd2lkdGg6IDQwdnc7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgICBwYWRkaW5nOiAwO1xcbn1cXG5cXG5sZWdlbmQge1xcbiAgICBmb250LXNpemU6IDEuNHJlbTtcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xcbn1cXG5cXG4ubWFpbkNvbnRhaW5lciBmaWVsZHNldCBkaXYge1xcbiAgICB3aWR0aDogMTB2dztcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAganVzdGlmeS1pdGVtczogY2VudGVyO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBwYWRkaW5nOiAwO1xcbn1cXG5cXG5sYWJlbCB7XFxuICAgIGZvbnQtc2l6ZTogMS4ycmVtO1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG4gICAgd2lkdGg6IDhyZW07XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgcGFkZGluZzogMXJlbSAycmVtO1xcbiAgICBib3JkZXItcmFkaXVzOiA1cmVtO1xcbn1cXG5cXG5pbnB1dCB7XFxuICAgIGFwcGVhcmFuY2U6IG5vbmU7XFxuICAgIGhlaWdodDogMDtcXG4gICAgd2lkdGg6IDA7XFxuICAgIG1hcmdpbjogMDtcXG59XFxuXFxuZmllbGRzZXQgZGl2OmhhcyhpbnB1dDpjaGVja2VkKSB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNlZTc3NTI7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIGlmICghdXJsKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICB1cmwgPSBTdHJpbmcodXJsLl9fZXNNb2R1bGUgPyB1cmwuZGVmYXVsdCA6IHVybCk7XG5cbiAgLy8gSWYgdXJsIGlzIGFscmVhZHkgd3JhcHBlZCBpbiBxdW90ZXMsIHJlbW92ZSB0aGVtXG4gIGlmICgvXlsnXCJdLipbJ1wiXSQvLnRlc3QodXJsKSkge1xuICAgIHVybCA9IHVybC5zbGljZSgxLCAtMSk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaGFzaCkge1xuICAgIHVybCArPSBvcHRpb25zLmhhc2g7XG4gIH1cblxuICAvLyBTaG91bGQgdXJsIGJlIHdyYXBwZWQ/XG4gIC8vIFNlZSBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXZhbHVlcy0zLyN1cmxzXG4gIGlmICgvW1wiJygpIFxcdFxcbl18KCUyMCkvLnRlc3QodXJsKSB8fCBvcHRpb25zLm5lZWRRdW90ZXMpIHtcbiAgICByZXR1cm4gXCJcXFwiXCIuY29uY2F0KHVybC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIiksIFwiXFxcIlwiKTtcbiAgfVxuICByZXR1cm4gdXJsO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcbm9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQgJiYgZG9jdW1lbnQuY3VycmVudFNjcmlwdC50YWdOYW1lLnRvVXBwZXJDYXNlKCkgPT09ICdTQ1JJUFQnKVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHtcblx0XHRcdHZhciBpID0gc2NyaXB0cy5sZW5ndGggLSAxO1xuXHRcdFx0d2hpbGUgKGkgPiAtMSAmJiAoIXNjcmlwdFVybCB8fCAhL15odHRwKHM/KTovLnRlc3Qoc2NyaXB0VXJsKSkpIHNjcmlwdFVybCA9IHNjcmlwdHNbaS0tXS5zcmM7XG5cdFx0fVxuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmIgPSBkb2N1bWVudC5iYXNlVVJJIHx8IHNlbGYubG9jYXRpb24uaHJlZjtcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuLy8gbm8gb24gY2h1bmtzIGxvYWRlZFxuXG4vLyBubyBqc29ucCBmdW5jdGlvbiIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IFwiLi9zdHlsZS5jc3NcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgR2FtZUNvbnRyb2xsZXIgZnJvbSBcIi4vZ2FtZUNvbnRyb2xsZXJcIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuL3NoaXBcIjtcblxuZnVuY3Rpb24gU2NyZWVuQ29udHJvbGxlcihwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgY29uc3QgZ2FtZSA9IEdhbWVDb250cm9sbGVyKHBsYXllcjEsIHBsYXllcjIpO1xuICAgIGNvbnN0IHBsYXllcjFCb2FyZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucDFcIik7XG4gICAgY29uc3QgcGxheWVyMkJvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wMlwiKTtcbiAgICBjb25zdCBtZXNzYWdlRGl2MSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubXNnMVwiKTtcbiAgICBjb25zdCBtZXNzYWdlRGl2MiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubXNnMlwiKTtcbiAgICBjb25zdCBwbGF5ZXIxQm9hcmQgPSBwbGF5ZXIxLmdhbWVib2FyZDtcbiAgICBjb25zdCBwbGF5ZXIyQm9hcmQgPSBwbGF5ZXIyLmdhbWVib2FyZDtcbiAgICBjb25zdCByYW5kb21QbGFjZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmFuZG9tXCIpO1xuICAgIGNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzdGFydFwiKTtcbiAgICBjb25zdCByZXN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyZXN0YXJ0XCIpO1xuICAgIGNvbnN0IGNvbVJhZGlvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb21cIik7XG4gICAgY29uc3QgcDJSYWRpbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcDJNb2RlXCIpO1xuXG4gICAgcmFuZG9tUGxhY2VCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIHN0YXJ0QnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICByZXN0YXJ0QnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgY29tUmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xuICAgIHAyUmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgcGxheWVyMUJvYXJkRGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJzZXRcIik7XG4gICAgcGxheWVyMkJvYXJkRGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJzZXRcIik7XG4gICAgcGxheWVyMUJvYXJkRGl2LmNsYXNzTGlzdC5hZGQoXCJwbGF5XCIpO1xuICAgIHBsYXllcjJCb2FyZERpdi5jbGFzc0xpc3QuYWRkKFwicGxheVwiKTtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUJvYXJkKCkge1xuICAgICAgICBjb25zdCBhY3RpdmVQbGF5ZXIgPSBnYW1lLmdldEFjdGl2ZVBsYXllcigpO1xuICAgICAgICBjb25zdCBvcHBvbmVudCA9IGdhbWUuZ2V0T3Bwb25lbnQoKTtcblxuICAgICAgICBpZiAoYWN0aXZlUGxheWVyLm5hbWUgPT09IHBsYXllcjEubmFtZSkge1xuICAgICAgICAgICAgcGxheWVyMUJvYXJkRGl2LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmREaXYuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllcjFCb2FyZERpdi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgcGxheWVyMkJvYXJkRGl2LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5ZXIxQm9hcmREaXYudGV4dENvbnRlbnQgPSBcIlwiO1xuICAgICAgICBwbGF5ZXIxQm9hcmQuYm9hcmQuZm9yRWFjaCgocm93LCByb3dJbmRleCkgPT4ge1xuICAgICAgICAgICAgcm93LmZvckVhY2goKGNlbGwsIGNvbHVtbkluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2VsbEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcbiAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmRhdGFzZXQucm93ID0gcm93SW5kZXg7XG4gICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5kYXRhc2V0LmNvbHVtbiA9IGNvbHVtbkluZGV4O1xuXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZVBsYXllci5uYW1lICE9PSBwbGF5ZXIxLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY2VsbCBpbnN0YW5jZW9mIFNoaXApIHtcbiAgICAgICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIxQm9hcmQubWlzc2VkQXR0YWNrcy5zb21lKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGNvbWJvKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE51bWJlcihjb21ib1swXSkgPT09IHJvd0luZGV4ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTnVtYmVyKGNvbWJvWzFdKSA9PT0gY29sdW1uSW5kZXhcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJtaXNzZWRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyMUJvYXJkLmhpdEF0dGFja3Muc29tZShcbiAgICAgICAgICAgICAgICAgICAgICAgIChjb21ibykgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBOdW1iZXIoY29tYm9bMF0pID09PSByb3dJbmRleCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE51bWJlcihjb21ib1sxXSkgPT09IGNvbHVtbkluZGV4XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwbGF5ZXIxQm9hcmREaXYuYXBwZW5kQ2hpbGQoY2VsbEJ1dHRvbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGxheWVyMkJvYXJkRGl2LnRleHRDb250ZW50ID0gXCJcIjtcbiAgICAgICAgcGxheWVyMkJvYXJkLmJvYXJkLmZvckVhY2goKHJvdywgcm93SW5kZXgpID0+IHtcbiAgICAgICAgICAgIHJvdy5mb3JFYWNoKChjZWxsLCBjb2x1bW5JbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNlbGxCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgICAgIGNlbGxCdXR0b24uY2xhc3NMaXN0LmFkZChcImNlbGxcIik7XG4gICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5kYXRhc2V0LnJvdyA9IHJvd0luZGV4O1xuICAgICAgICAgICAgICAgIGNlbGxCdXR0b24uZGF0YXNldC5jb2x1bW4gPSBjb2x1bW5JbmRleDtcblxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVQbGF5ZXIubmFtZSAhPT0gcGxheWVyMi5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwgaW5zdGFuY2VvZiBTaGlwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxCdXR0b24uY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyMkJvYXJkLm1pc3NlZEF0dGFja3Muc29tZShcbiAgICAgICAgICAgICAgICAgICAgICAgIChjb21ibykgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBOdW1iZXIoY29tYm9bMF0pID09PSByb3dJbmRleCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE51bWJlcihjb21ib1sxXSkgPT09IGNvbHVtbkluZGV4XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwibWlzc2VkXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHBsYXllcjJCb2FyZC5oaXRBdHRhY2tzLnNvbWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAoY29tYm8pID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTnVtYmVyKGNvbWJvWzBdKSA9PT0gcm93SW5kZXggJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBOdW1iZXIoY29tYm9bMV0pID09PSBjb2x1bW5JbmRleFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxCdXR0b24uY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGxheWVyMkJvYXJkRGl2LmFwcGVuZENoaWxkKGNlbGxCdXR0b24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChnYW1lLndpbkNvbmRpdGlvbihvcHBvbmVudCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGJ1dHRvbnMxID0gcGxheWVyMUJvYXJkRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b25cIik7XG4gICAgICAgICAgICBidXR0b25zMS5mb3JFYWNoKChidXR0b24pID0+IChidXR0b24uZGlzYWJsZWQgPSB0cnVlKSk7XG4gICAgICAgICAgICBjb25zdCBidXR0b25zMiA9IHBsYXllcjJCb2FyZERpdi5xdWVyeVNlbGVjdG9yQWxsKFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgYnV0dG9uczIuZm9yRWFjaCgoYnV0dG9uKSA9PiAoYnV0dG9uLmRpc2FibGVkID0gdHJ1ZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWVzc2FnZURpdjEudGV4dENvbnRlbnQgPSBgSXQncyAke2FjdGl2ZVBsYXllci5uYW1lfSdzIFR1cm4hYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHBsYXllcjIuY29tcHV0ZXIgJiZcbiAgICAgICAgICAgIGFjdGl2ZVBsYXllciA9PT0gcGxheWVyMiAmJlxuICAgICAgICAgICAgIWdhbWUud2luQ29uZGl0aW9uKG9wcG9uZW50KVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbUF1dG9Nb3ZlcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tQXV0b01vdmVzKCkge1xuICAgICAgICBpZiAocGxheWVyMUJvYXJkLmxhc3RIaXQpIHtcbiAgICAgICAgICAgIGxldCBbeCwgeV0gPVxuICAgICAgICAgICAgICAgIHBsYXllcjFCb2FyZC5oaXRBdHRhY2tzW3BsYXllcjFCb2FyZC5oaXRBdHRhY2tzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgbGV0IG5ld1BvcyA9IHBsYXllcjIuZ2V0UmFuZG9tRGlyZWN0aW9uKHBsYXllcjEsIHgsIHkpO1xuICAgICAgICAgICAgaWYgKG5ld1Bvcykge1xuICAgICAgICAgICAgICAgIFt4LCB5XSA9IG5ld1BvcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgW3gsIHldID0gcGxheWVyMi5nZXRSYW5kb21Qb3MocGxheWVyMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZXNzYWdlRGl2Mi50ZXh0Q29udGVudCA9IGdhbWUucGxheVJvdW5kKHgsIHkpO1xuICAgICAgICAgICAgdXBkYXRlQm9hcmQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBbeCwgeV0gPSBwbGF5ZXIyLmdldFJhbmRvbVBvcyhwbGF5ZXIxKTtcbiAgICAgICAgICAgIG1lc3NhZ2VEaXYyLnRleHRDb250ZW50ID0gZ2FtZS5wbGF5Um91bmQoeCwgeSk7XG4gICAgICAgICAgICB1cGRhdGVCb2FyZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoaWRlQm9hcmQoKSB7XG4gICAgICAgIGNvbnN0IHAxQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucDFcIikucXVlcnlTZWxlY3RvckFsbChcImJ1dHRvblwiKTtcbiAgICAgICAgY29uc3QgcDJCdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wMlwiKS5xdWVyeVNlbGVjdG9yQWxsKFwiYnV0dG9uXCIpO1xuICAgICAgICBwMUJ0bnMuZm9yRWFjaCgoYnRuKSA9PiB7XG4gICAgICAgICAgICBidG4uY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XG4gICAgICAgIH0pO1xuICAgICAgICBwMkJ0bnMuZm9yRWFjaCgoYnRuKSA9PiB7XG4gICAgICAgICAgICBidG4uY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJvYXJkQ2xpY2tIYW5kbGVyKGUpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRSb3cgPSBlLnRhcmdldC5kYXRhc2V0LnJvdztcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRDb2x1bW4gPSBlLnRhcmdldC5kYXRhc2V0LmNvbHVtbjtcblxuICAgICAgICBpZiAoIXNlbGVjdGVkUm93IHx8ICFzZWxlY3RlZENvbHVtbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbWVzc2FnZURpdjIudGV4dENvbnRlbnQgPSBnYW1lLnBsYXlSb3VuZChzZWxlY3RlZFJvdywgc2VsZWN0ZWRDb2x1bW4pO1xuICAgICAgICBjb25zdCBhY3RpdmVQbGF5ZXIgPSBnYW1lLmdldEFjdGl2ZVBsYXllcigpO1xuICAgICAgICB1cGRhdGVCb2FyZCgpO1xuICAgICAgICBpZiAoIXBsYXllcjIuY29tcHV0ZXIpIHtcbiAgICAgICAgICAgIGlmIChhY3RpdmVQbGF5ZXIubmFtZSA9PT0gcGxheWVyMS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgcmVzdHJpY3RQMigpO1xuICAgICAgICAgICAgICAgIGhpZGVCb2FyZCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVQbGF5ZXIubmFtZSA9PT0gcGxheWVyMi5uYW1lKSB7XG4gICAgICAgICAgICAgICAgcmVzdHJpY3RQMSgpO1xuICAgICAgICAgICAgICAgIGhpZGVCb2FyZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdXBkYXRlQm9hcmQoKTtcbiAgICAgICAgICAgIH0sIDMwMDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGxheWVyMUJvYXJkRGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBib2FyZENsaWNrSGFuZGxlcik7XG4gICAgcGxheWVyMkJvYXJkRGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBib2FyZENsaWNrSGFuZGxlcik7XG5cbiAgICB1cGRhdGVCb2FyZCgpO1xufVxuXG5mdW5jdGlvbiBzZXR0aW5nQm9hcmQoKSB7XG4gICAgY29uc3QgY29tUmFkaW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbVwiKTtcbiAgICBjb25zdCBwMlJhZGlvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwMk1vZGVcIik7XG4gICAgbGV0IGlzQ29tID0gY29tUmFkaW8uY2hlY2tlZDtcbiAgICBjb25zdCBwbGF5ZXIxID0gbmV3IFBsYXllcihcIlBsYXllcjFcIik7XG4gICAgbGV0IHBsYXllcjIgPSBuZXcgUGxheWVyKFwiY29tXCIsIGlzQ29tKTtcbiAgICBjb25zdCBwbGF5ZXIxQm9hcmREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnAxXCIpO1xuICAgIGNvbnN0IHBsYXllcjJCb2FyZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucDJcIik7XG4gICAgY29uc3QgbWVzc2FnZURpdjEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1zZzFcIik7XG4gICAgY29uc3QgbWVzc2FnZURpdjIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1zZzJcIik7XG4gICAgY29uc3QgcGxheWVyMUJvYXJkID0gcGxheWVyMS5nYW1lYm9hcmQ7XG4gICAgbGV0IHBsYXllcjJCb2FyZCA9IHBsYXllcjIuZ2FtZWJvYXJkO1xuICAgIGNvbnN0IHJhbmRvbVBsYWNlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyYW5kb21cIik7XG4gICAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3N0YXJ0XCIpO1xuICAgIGNvbnN0IHJlc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jlc3RhcnRcIik7XG4gICAgbGV0IGN1cnJlbnRQbGF5ZXIgPSBwbGF5ZXIxO1xuXG4gICAgY29tUmFkaW8uYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuICAgICAgICBpZiAoZS50YXJnZXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgaXNDb20gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHBsYXllcjIgPSBuZXcgUGxheWVyKFwiY29tXCIsIGlzQ29tKTtcbiAgICAgICAgcGxheWVyMkJvYXJkID0gcGxheWVyMi5nYW1lYm9hcmQ7XG4gICAgICAgIHBsYXllcjJCb2FyZC5yZW1vdmVBbGxTaGlwKCk7XG4gICAgICAgIHBsYXllcjJCb2FyZC5wbGFjZVNoaXBSYW5kb20oKTtcbiAgICAgICAgdXBkYXRlU2V0dGluZ0JvYXJkKCk7XG4gICAgICAgIHJlc3RyaWN0UDIoKTtcbiAgICAgICAgcmVzZXRTdGFydEJ1dHRvbkV2ZW50KCk7XG4gICAgfSk7XG4gICAgcDJSYWRpby5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgIGlmIChlLnRhcmdldC5jaGVja2VkKSB7XG4gICAgICAgICAgICBpc0NvbSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHBsYXllcjIgPSBuZXcgUGxheWVyKFwiUGxheWVyMlwiLCBpc0NvbSk7XG4gICAgICAgIHBsYXllcjJCb2FyZCA9IHBsYXllcjIuZ2FtZWJvYXJkO1xuICAgICAgICBwbGF5ZXIyQm9hcmQucmVtb3ZlQWxsU2hpcCgpO1xuICAgICAgICBwbGF5ZXIyQm9hcmQucGxhY2VTaGlwUmFuZG9tKCk7XG4gICAgICAgIHVwZGF0ZVNldHRpbmdCb2FyZCgpO1xuICAgICAgICByZXN0cmljdFAyKCk7XG4gICAgICAgIHJlc2V0U3RhcnRCdXR0b25FdmVudCgpO1xuICAgIH0pO1xuXG4gICAgcmFuZG9tUGxhY2VCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICBzdGFydEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIHJlc3RhcnRCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIGNvbVJhZGlvLmRpc2FibGVkID0gZmFsc2U7XG4gICAgcDJSYWRpby5kaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgcGxheWVyMUJvYXJkRGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJwbGF5XCIpO1xuICAgIHBsYXllcjJCb2FyZERpdi5jbGFzc0xpc3QucmVtb3ZlKFwicGxheVwiKTtcbiAgICBwbGF5ZXIxQm9hcmREaXYuY2xhc3NMaXN0LmFkZChcInNldFwiKTtcbiAgICBwbGF5ZXIyQm9hcmREaXYuY2xhc3NMaXN0LmFkZChcInNldFwiKTtcblxuICAgIHBsYXllcjFCb2FyZC5wbGFjZVNoaXBSYW5kb20oKTtcbiAgICBwbGF5ZXIyQm9hcmQucGxhY2VTaGlwUmFuZG9tKCk7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVTZXR0aW5nQm9hcmQoKSB7XG4gICAgICAgIHBsYXllcjFCb2FyZERpdi50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgICAgIHBsYXllcjFCb2FyZC5ib2FyZC5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICAgICAgICByb3cuZm9yRWFjaCgoY2VsbCwgY29sdW1uSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjZWxsQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuICAgICAgICAgICAgICAgIGNlbGxCdXR0b24uZGF0YXNldC5yb3cgPSByb3dJbmRleDtcbiAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmRhdGFzZXQuY29sdW1uID0gY29sdW1uSW5kZXg7XG5cbiAgICAgICAgICAgICAgICBpZiAoY2VsbCBpbnN0YW5jZW9mIFNoaXApIHtcbiAgICAgICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcbiAgICAgICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyMUJvYXJkLnJvdGF0ZVNoaXAocm93SW5kZXgsIGNvbHVtbkluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVTZXR0aW5nQm9hcmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN0cmljdFAyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyMUJvYXJkLnJlbW92ZVNoaXAocm93SW5kZXgsIGNvbHVtbkluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdCb2FyZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdHJpY3RQMigpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGdob3N0U2hpcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2hvc3RTaGlwc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnaG9zdFNoaXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsZW5ndGggPSBwYXJzZUludChnaG9zdFNoaXAuZGF0YXNldC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzVmVydGljYWwgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnaG9zdFNoaXAuZGF0YXNldC5pc1ZlcnRpY2FsID09PSBcInRydWVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllcjFCb2FyZC5jYW5QbGFjZVNoaXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbkluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNWZXJ0aWNhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllcjFCb2FyZC5wbGFjZVNoaXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbkluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNWZXJ0aWNhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIxQm9hcmQucmVtb3ZlR2hvc3RTaGlwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdCb2FyZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN0cmljdFAyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcGxheWVyMUJvYXJkRGl2LmFwcGVuZENoaWxkKGNlbGxCdXR0b24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBsYXllcjJCb2FyZERpdi50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgICAgIGlmIChwbGF5ZXIyLmNvbXB1dGVyKSB7XG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQuYm9hcmQuZm9yRWFjaCgocm93LCByb3dJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIHJvdy5mb3JFYWNoKChjZWxsLCBjb2x1bW5JbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjZWxsQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcbiAgICAgICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5kYXRhc2V0LnJvdyA9IHJvd0luZGV4O1xuICAgICAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmRhdGFzZXQuY29sdW1uID0gY29sdW1uSW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbCBpbnN0YW5jZW9mIFNoaXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxCdXR0b24uY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcGxheWVyMkJvYXJkRGl2LmFwcGVuZENoaWxkKGNlbGxCdXR0b24pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQuYm9hcmQuZm9yRWFjaCgocm93LCByb3dJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIHJvdy5mb3JFYWNoKChjZWxsLCBjb2x1bW5JbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjZWxsQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcbiAgICAgICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5kYXRhc2V0LnJvdyA9IHJvd0luZGV4O1xuICAgICAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmRhdGFzZXQuY29sdW1uID0gY29sdW1uSW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjZWxsIGluc3RhbmNlb2YgU2hpcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQuYnV0dG9uID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyMkJvYXJkLnJvdGF0ZVNoaXAocm93SW5kZXgsIGNvbHVtbkluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2V0dGluZ0JvYXJkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3RyaWN0UDEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIyQm9hcmQucmVtb3ZlU2hpcChyb3dJbmRleCwgY29sdW1uSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdCb2FyZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3RyaWN0UDEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2hvc3RTaGlwID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5naG9zdFNoaXBzXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnaG9zdFNoaXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gcGFyc2VJbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnaG9zdFNoaXAuZGF0YXNldC5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNWZXJ0aWNhbCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnaG9zdFNoaXAuZGF0YXNldC5pc1ZlcnRpY2FsID09PSBcInRydWVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyMkJvYXJkLmNhblBsYWNlU2hpcChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5JbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNWZXJ0aWNhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllcjJCb2FyZC5wbGFjZVNoaXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93SW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVmVydGljYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIyQm9hcmQucmVtb3ZlR2hvc3RTaGlwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVTZXR0aW5nQm9hcmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3RyaWN0UDEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBsYXllcjJCb2FyZERpdi5hcHBlbmRDaGlsZChjZWxsQnV0dG9uKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlc2V0U3RhcnRCdXR0b25FdmVudCgpIHtcbiAgICAgICAgLy8gQ2xvbmUgdGhlIHN0YXJ0IGJ1dHRvbiB0byBjbGVhciBwcmV2aW91cyBldmVudHNcbiAgICAgICAgY29uc3QgbmV3U3RhcnRCdG4gPSBzdGFydEJ0bi5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIHN0YXJ0QnRuLnJlcGxhY2VXaXRoKG5ld1N0YXJ0QnRuKTtcbiAgICAgICAgLy8gQXR0YWNoIHRoZSBuZXcgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgbmV3U3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAhcGxheWVyMi5jb21wdXRlciAmJlxuICAgICAgICAgICAgICAgICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnAxXCIpLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIikuZGlzYWJsZWRcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHN3aXRjaFNldHRpbmdCb2FyZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFNjcmVlbkNvbnRyb2xsZXIocGxheWVyMSwgcGxheWVyMik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN3aXRjaFNldHRpbmdCb2FyZCgpIHtcbiAgICAgICAgY29uc3QgcDFCdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wMVwiKS5xdWVyeVNlbGVjdG9yQWxsKFwiYnV0dG9uXCIpO1xuICAgICAgICBjb25zdCBwMkJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnAyXCIpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b25cIik7XG4gICAgICAgIHAxQnRucy5mb3JFYWNoKChidG4pID0+IHtcbiAgICAgICAgICAgIGJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgICBwMkJ0bnMuZm9yRWFjaCgoYnRuKSA9PiB7XG4gICAgICAgICAgICBidG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbVJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgcDJSYWRpby5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIGN1cnJlbnRQbGF5ZXIgPSBwbGF5ZXIyO1xuICAgICAgICBtZXNzYWdlRGl2MS50ZXh0Q29udGVudCA9XG4gICAgICAgICAgICBcIlBsYWNlIFBsYXllcjIncyBTaGlwcyEgUHJlc3MgU3RhcnQgVG8gQ29udGludWUhXCI7XG4gICAgfVxuXG4gICAgbWVzc2FnZURpdjEudGV4dENvbnRlbnQgPSBcIlBsYWNlIFBsYXllcjEncyBTaGlwcyEgUHJlc3MgU3RhcnQgVG8gQ29udGludWUhXCI7XG4gICAgbWVzc2FnZURpdjIudGV4dENvbnRlbnQgPSBcIkNsaWNrIE1pZGRsZSBNb3VzZSBUbyBSb3RhdGUgVGhlIFNoaXAhXCI7XG4gICAgdXBkYXRlU2V0dGluZ0JvYXJkKCk7XG4gICAgcmVzdHJpY3RQMigpO1xuXG4gICAgcmFuZG9tUGxhY2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgY3VycmVudFBsYXllci5nYW1lYm9hcmQucmVtb3ZlQWxsU2hpcCgpO1xuICAgICAgICBjdXJyZW50UGxheWVyLmdhbWVib2FyZC5wbGFjZVNoaXBSYW5kb20oKTtcbiAgICAgICAgdXBkYXRlU2V0dGluZ0JvYXJkKCk7XG4gICAgICAgIGN1cnJlbnRQbGF5ZXIgPT0gcGxheWVyMSA/IHJlc3RyaWN0UDIoKSA6IHJlc3RyaWN0UDEoKTtcbiAgICB9KTtcbiAgICByZXNldFN0YXJ0QnV0dG9uRXZlbnQocGxheWVyMSwgcGxheWVyMik7XG4gICAgcmVzdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBwbGF5ZXIxQm9hcmQuc2hpcHMgPSBbXTtcbiAgICAgICAgcGxheWVyMUJvYXJkLm1pc3NlZEF0dGFja3MgPSBbXTtcbiAgICAgICAgcGxheWVyMUJvYXJkLmhpdEF0dGFja3MgPSBbXTtcbiAgICAgICAgcGxheWVyMkJvYXJkLnNoaXBzID0gW107XG4gICAgICAgIHBsYXllcjJCb2FyZC5taXNzZWRBdHRhY2tzID0gW107XG4gICAgICAgIHBsYXllcjJCb2FyZC5oaXRBdHRhY2tzID0gW107XG4gICAgICAgIHNldHRpbmdCb2FyZCgpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiByZXN0cmljdFAxKCkge1xuICAgIGNvbnN0IHAxQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucDFcIikucXVlcnlTZWxlY3RvckFsbChcImJ1dHRvblwiKTtcbiAgICBwMUJ0bnMuZm9yRWFjaCgoYnRuKSA9PiB7XG4gICAgICAgIGJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlc3RyaWN0UDIoKSB7XG4gICAgY29uc3QgcDJCdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wMlwiKS5xdWVyeVNlbGVjdG9yQWxsKFwiYnV0dG9uXCIpO1xuICAgIHAyQnRucy5mb3JFYWNoKChidG4pID0+IHtcbiAgICAgICAgYnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9KTtcbn1cblxuc2V0dGluZ0JvYXJkKCk7XG4iXSwibmFtZXMiOlsiR2FtZUNvbnRyb2xsZXIiLCJwbGF5ZXIxIiwiY29tIiwiYWN0aXZlUGxheWVyIiwibmV4dFBsYXllciIsInRlbXBQbGF5ZXIiLCJnZXRBY3RpdmVQbGF5ZXIiLCJnZXRPcHBvbmVudCIsInN3aXRjaFBsYXllclR1cm4iLCJ3aW5Db25kaXRpb24iLCJvcHBvbmVudCIsImdhbWVib2FyZCIsImFsbFNoaXBzU3VuayIsInBsYXlSb3VuZCIsIngiLCJ5IiwibWVzc2FnZSIsIm5hbWUiLCJjaGVja0F0dGFjayIsImF0dGFjayIsIlNoaXAiLCJHYW1lYm9hcmQiLCJjb25zdHJ1Y3RvciIsImJvYXJkIiwiQXJyYXkiLCJmcm9tIiwibGVuZ3RoIiwiZmlsbCIsIm1pc3NlZEF0dGFja3MiLCJoaXRBdHRhY2tzIiwic2hpcHMiLCJsYXN0SGl0IiwicGxhY2VTaGlwUmFuZG9tIiwic2hpcExlbmd0aHMiLCJmb3JFYWNoIiwicGxhY2VkIiwiaXNWZXJ0aWNhbCIsIk1hdGgiLCJyYW5kb20iLCJmbG9vciIsImNhblBsYWNlU2hpcCIsInBsYWNlU2hpcCIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsImkiLCJzaGlwIiwiY29vcmQiLCJwdXNoIiwicmVtb3ZlQWxsU2hpcCIsInJlbW92ZVNoaXAiLCJzaGlwTGVuZ3RoIiwic2hpcEluZGV4IiwiZmluZEluZGV4IiwidGhlU2hpcCIsImEiLCJiIiwic3BsaWNlIiwiY3JlYXRlR2hvc3RTaGlwIiwicm90YXRlU2hpcCIsIm5ld0RpciIsImNyZWF0ZUNvbnRhaW5lciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwiZ3JpZFRlbXBsYXRlUm93cyIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJjbGFzc0xpc3QiLCJhZGQiLCJkYXRhc2V0IiwiZ2hvc3RTaGlwIiwiYXBwZW5kQ2hpbGQiLCJtb3ZlQ3Vyc29yIiwiZXZlbnQiLCJwYWdlWSIsInBhZ2VYIiwic2Nyb2xsTGVmdCIsIndpbmRvdyIsInNjcm9sbFgiLCJkb2N1bWVudEVsZW1lbnQiLCJib2R5IiwicGFyZW50Tm9kZSIsInNjcm9sbFRvcCIsInNjcm9sbFkiLCJsZWZ0IiwidG9wIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUdob3N0U2hpcCIsInF1ZXJ5U2VsZWN0b3IiLCJyZW1vdmUiLCJyZWNlaXZlQXR0YWNrIiwiaGl0IiwiZXZlcnkiLCJpc1N1bmsiLCJQbGF5ZXIiLCJpc0NvbXB1dGVyIiwiY29tcHV0ZXIiLCJzb21lIiwiY29tYm8iLCJnZXRSYW5kb21Qb3MiLCJnZXRSYW5kb21EaXJlY3Rpb24iLCJkaXJlY3Rpb25zIiwidmFsaWREaXJlY3Rpb25zIiwiZmlsdGVyIiwibmV3WCIsIm5ld1kiLCJpc1ZhbGlkIiwicmFuZG9tSW5kZXgiLCJuZXdQb3MiLCJiZWVuSGl0Iiwic3VuayIsIlNjcmVlbkNvbnRyb2xsZXIiLCJwbGF5ZXIyIiwiZ2FtZSIsInBsYXllcjFCb2FyZERpdiIsInBsYXllcjJCb2FyZERpdiIsIm1lc3NhZ2VEaXYxIiwibWVzc2FnZURpdjIiLCJwbGF5ZXIxQm9hcmQiLCJwbGF5ZXIyQm9hcmQiLCJyYW5kb21QbGFjZUJ0biIsInN0YXJ0QnRuIiwicmVzdGFydEJ0biIsImNvbVJhZGlvIiwicDJSYWRpbyIsImRpc2FibGVkIiwidXBkYXRlQm9hcmQiLCJ0ZXh0Q29udGVudCIsInJvdyIsInJvd0luZGV4IiwiY2VsbCIsImNvbHVtbkluZGV4IiwiY2VsbEJ1dHRvbiIsImNvbHVtbiIsIk51bWJlciIsImJ1dHRvbnMxIiwicXVlcnlTZWxlY3RvckFsbCIsImJ1dHRvbiIsImJ1dHRvbnMyIiwiY29tQXV0b01vdmVzIiwiaGlkZUJvYXJkIiwicDFCdG5zIiwicDJCdG5zIiwiYnRuIiwiYm9hcmRDbGlja0hhbmRsZXIiLCJlIiwic2VsZWN0ZWRSb3ciLCJ0YXJnZXQiLCJzZWxlY3RlZENvbHVtbiIsInJlc3RyaWN0UDIiLCJyZXN0cmljdFAxIiwic2V0VGltZW91dCIsInNldHRpbmdCb2FyZCIsImlzQ29tIiwiY2hlY2tlZCIsImN1cnJlbnRQbGF5ZXIiLCJ1cGRhdGVTZXR0aW5nQm9hcmQiLCJyZXNldFN0YXJ0QnV0dG9uRXZlbnQiLCJwYXJzZUludCIsIm5ld1N0YXJ0QnRuIiwiY2xvbmVOb2RlIiwicmVwbGFjZVdpdGgiLCJzd2l0Y2hTZXR0aW5nQm9hcmQiXSwic291cmNlUm9vdCI6IiJ9