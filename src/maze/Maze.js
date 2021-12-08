import {mazeGenerator} from "@miketmoore/maze-generator";
import {coordFactory} from "@miketmoore/maze-generator/dist/coord";

class Maze {
    constructor(rows, columns) {
        this.grid = mazeGenerator({rows, columns});
        this.grid.carveCellWall(coordFactory(0, 0), 'west');
        this.grid.carveCellWall(coordFactory(rows - 1, columns - 1), 'east');
        this._rows = rows;
        this._cols = columns;
        this._start = coordFactory(0, 0);
        this._goal = coordFactory(rows - 1, columns - 1);
        this._lollipop = coordFactory(rows - Math.floor(Math.random() * 16), columns -  Math.floor(Math.random() * 32));
        this._icecream = coordFactory(rows - Math.floor(Math.random() * 16), columns -  Math.floor(Math.random() * 32));
    }

    get rows() {
        return this._rows;
    }

    get cols() {
        return this._cols;
    }

    get start() {
        return this._start;
    }

    get goal() {
        return this._goal;
    }

    get lollipop() {
        return this._lollipop;
    }

    get icecream() {
        return this._icecream;
    }

    changePrizeLocation(rows, cols){
        if(this._lollipop.row === this._icecream.row && this._lollipop.col === this._icecream.col){
            return coordFactory(rows - Math.floor(Math.random() * 16), cols -  Math.floor(Math.random() * 32));
        }
    }

    getWalls(row, col) {
        return this.grid.getCell(coordFactory(row, col)).getWalls();
    }

    tryMove({row, col}, direction) {
        console.log("TRY MOVE", {row, col})
        const [dy, dx] = {
            'north': [-1, 0],
            'east': [0, 1],
            'south': [1, 0],
            'west': [0, -1]
        }[direction];
        const walls = this.grid.getCell(coordFactory(row, col)).getWalls();
        console.log(walls)
        if (walls[direction]) {
            return null;
        }
        const newRow = row + dy;
        const newCol = col + dx;
        console.log({newRow, newCol})
        if (newRow < 0 || newRow >= this.rows || newCol < 0 || newCol >= this.cols) {
            return null;
        }
        return coordFactory(newRow, newCol);
    }
}

export default Maze;
