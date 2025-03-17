import { Ship, Gameboard} from "./logic";

const ship = new Ship(4)
const gameboard = new Gameboard()
gameboard.inssertShipIn(0,0,3)

test("if a ship have less hits that their length, dont should be sunk", ()=>{
    ship.hit()
    ship.hit()
    ship.hit()
    expect(ship.isSunk()).toBe(false)
})

test("If i put a ship in (0,0,3) it will be there",()=>{
    expect(gameboard.thereIsShipIn(0,0)).toBe(true)
    expect(gameboard.thereIsShipIn(0,1)).toBe(true)
    expect(gameboard.thereIsShipIn(0,2)).toBe(true)
    expect(gameboard.thereIsShipIn(0,3)).toBe(true)
})
