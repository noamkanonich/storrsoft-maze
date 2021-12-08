class MazeDrawer {
  constructor(
    canvas,
    maze,
    logo,
    currentCell,
    goal = null,
    lollipop,
    lollipopImg,
    lollipopTaken,
    icecream,
    icecreamImg,
    icecreamTaken,
    prizeShowTime
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.maze = maze;
    this.logo = logo;
    this.currentCell = currentCell;
    this.goal = goal;
    this.lollipop = lollipop;
    this.lollipopTaken = lollipopTaken;
    this.lollipopImg = lollipopImg;
    this.icecream = icecream;
    this.icecreamTaken = icecreamTaken;
    this.icecreamImg = icecreamImg;
    this.icecreamShowTime = 30;
    this.cellWidth = Math.floor(canvas.width / maze.cols);
    this.cellHeight = Math.floor(canvas.height / maze.rows);
    this.xOffset = Math.floor((canvas.width - maze.cols * this.cellWidth) / 2);
    this.prizeShowTime = prizeShowTime;
  }

  checkIfPrizeLocationIsEqual() {
    if(this.lollipop.row === this.icecream.row && this.lollipop.col === this.icecream.col)
        this.lollipop = this.maze.changePrizeLocation(this.maze.rows, this.maze.cols);
    else return false;
  }

  calculateCellRect({ row, col }) {
    return new DOMRect(
      this.cellWidth * col + this.xOffset,
      this.cellHeight * row,
      this.cellWidth,
      this.cellHeight
    );
  }

  draw() {

    this.ctx.fillStyle = "blue";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawWalls();

    this.drawLogo();

    if (this.prizeShowTime <= 10 && this.prizeShowTime > 0) {
      this.drawLollipop();
    }

    if (this.prizeShowTime <= 5 && this.prizeShowTime > 0) {
      this.drawIcecream();
    }

    this.drawGoal();
  }

  drawWalls() {
    this.ctx.strokeStyle = "white";

    for (let row = 0; row < this.maze.rows; row++) {
      for (let col = 0; col < this.maze.cols; col++) {
        const cellRect = this.calculateCellRect({ row, col });
        const walls = this.maze.getWalls(row, col);
        if (row === 0 && walls["north"]) {
          this.drawLine(cellRect.left, cellRect.top, cellRect.width, 0);
        }
        if (walls["east"]) {
          this.drawLine(cellRect.right, cellRect.top, 0, cellRect.height);
        }
        if (walls["south"]) {
          this.drawLine(cellRect.left, cellRect.bottom, cellRect.width, 0);
        }
        if (col === 0 && walls["west"]) {
          this.drawLine(cellRect.left, cellRect.top, 0, cellRect.height);
        }
      }
    }
  }

  drawLogo() {
    if (!this.logo) {
      return;
    }
    const logoSize = Math.min(this.cellWidth, this.cellHeight) * 0.75;
    const rect = this.calculateCellRect(this.currentCell);
    this.ctx.drawImage(
      this.logo,
      rect.left + (rect.width - logoSize) / 2,
      rect.top + (rect.height - logoSize) / 2,
      logoSize,
      logoSize
    );
  }

  drawLollipop() {
    if (!this.lollipop) {
      return;
    }
    if (this.lollipop) {
      this.checkIfPrizeLocationIsEqual();

      const lollipopSize = Math.min(this.cellWidth, this.cellHeight) * 0.75;
      const rect = this.calculateCellRect(this.lollipop);
      if (!this.lollipopTaken) {
        this.ctx.drawImage(
          this.lollipopImg,
          rect.left + (rect.width - lollipopSize) / 2,
          rect.top + (rect.height - lollipopSize) / 2,
          lollipopSize,
          lollipopSize
        );
      } else if (this.lollipopTaken) {
        this.ctx.fillStyle = "green";
        const textWidth = Math.min(
          this.ctx.measureText("+500").width,
          rect.width * 0.75
        );
        this.ctx.fillText(
          "+500",
          rect.left + (rect.width - textWidth) / 2,
          rect.top + rect.height * 0.125,
          textWidth
        );
      }
    }
  }

  drawIcecream() {
    if (!this.icecream) {
      return;
    }

    const icecreamSize = Math.min(this.cellWidth, this.cellHeight) * 0.75;
    const rect = this.calculateCellRect(this.icecream);
    if (!this.icecreamTaken) {
      this.ctx.drawImage(
        this.icecreamImg,
        rect.left + (rect.width - icecreamSize) / 2,
        rect.top + (rect.height - icecreamSize) / 2,
        icecreamSize,
        icecreamSize
      );
    } else if (this.icecreamTaken) {
      this.ctx.fillStyle = "green";
      const textWidth = Math.min(
        this.ctx.measureText("+1000").width,
        rect.width * 0.75
      );
      this.ctx.fillText(
        "+1000",
        rect.left + (rect.width - textWidth) / 2,
        rect.top + rect.height * 0.125,
        textWidth
      );
    }
  }

  drawLine(x, y, width, height) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + width, y + height);
    // this.ctx.strokeStyle = '#ff0000';
    this.ctx.stroke();
  }

  drawGoal() {
    if (!this.goal) {
      return;
    }

    const rect = this.calculateCellRect(this.goal);
    this.ctx.font = `${rect.height * 0.75}px "Joystix"`;
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = "yellow";
    const textWidth = Math.min(
      this.ctx.measureText("G").width,
      rect.width * 0.75
    );
    this.ctx.fillText(
      "G",
      rect.left + (rect.width - textWidth) / 2,
      rect.top + rect.height * 0.125,
      textWidth
    );
  }
}

export default MazeDrawer;
