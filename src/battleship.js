/*
CHARACTERS SET
○    ➞ blank
●    ➞ ship
☼    ➞ miss
☀   ➞ hit
*/

class Battleship {
    mBoard = [
        ['○','○','○','○','○',],
        ['○','○','○','○','○',],
        ['○','○','○','○','○',],
        ['○','○','○','○','○',],
        ['○','○','○','○','○',]
    ];

    mHits = new Set();
    mSunk = 0;
    mPoints = 0;

    constructor(scheme, input) {
        //setup ships
        let unresolvedShipParts = new Map();
        scheme.forEach(e => {
            let pos = this.itemToPosition(e);
            unresolvedShipParts.set(pos.row+''+pos.col, pos);
        });

        function findSecondPart(ship, pos, parts) {
            let key = pos.row + '' + pos.col;
            if (parts.has(key)) {
                parts.delete(key);
                ship[1] = pos;
                return true;
            }
            return false;
        }

        function findCruiser(ship, parts) {
            let pos = ship[0];
            let right = Object.assign({}, pos); right.col++;
            let left = Object.assign({}, pos); left.col--;
            let top = Object.assign({}, pos); top.row++;
            let bottom = Object.assign({}, pos); bottom.row--;

            if (findSecondPart(ship, right, parts)
                || findSecondPart(ship, left, parts)
                || findSecondPart(ship, top, parts)
                || findSecondPart(ship, bottom, parts)
            ) {}
        }

        let ships = new Set();
        let pos2ship = new Map();
        let it = unresolvedShipParts.entries();
        let e = it.next();
        while (!e.done) {
            let ship = [e.value[1]];
            findCruiser(ship, unresolvedShipParts);
            ships.add(ship);
            ship.forEach(pos => pos2ship.set(pos.row+''+pos.col, ship));
            e = it.next();
        }

        //put ships on board
        ships.forEach(ship => ship.forEach(sPart => this.mBoard[sPart.row][sPart.col] = '●'));

        //find hits
        input.forEach(e => {
            let pos = this.itemToPosition(e);
            let key = pos.row+''+pos.col;
            if (pos2ship.has(key)) {
                this.mHits.add(key);
                this.mBoard[pos.row][pos.col] = '☀';
                this.mPoints++;
            } else {
                this.mBoard[pos.row][pos.col] = '☼';
            }
        });

        //find sunks
        ships.forEach(ship => {
            if (ship.length === 2
                && this.mHits.has(ship[0].row+''+ship[0].col)
                && this.mHits.has(ship[1].row+''+ship[1].col)
            ) {
                this.mSunk++;
                this.mPoints +=2;
            }
        })
    }

    itemToPosition(item) {
        let map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, };
        let result = {};
        result.row = map[item.charAt(0)];
        result.col = item.charAt(1) - 1;
        return result;
    }

    board() {
        return this.mBoard;
    }

    hits() {
        return this.mHits.size;
    }

    sunk() {
        return this.mSunk;
    }

    points() {
        return this.mPoints;
    }
}
