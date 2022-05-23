class Cell {
  constructor(context, posX, posY, width = 10, height = 10) {
    this.context = context;
    this.state = Math.random() > 0.5;
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
    this.color = '#FF0000';
  }

  draw() {
    this.context.fillStyle = this.state ? this.color : '#303030';
    this.context.fillRect(this.posX * this.width, this.posY * this.height, this.width, this.height);
  }
}

class Game {
  constructor(canvasId, rows = 40, cols = 75) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    this.rows = rows;
    this.cols = cols;
    this.cells = [];
    this.isPaused = true;

    this.generateCells();
    this.drawCanvas();
    this.startSimulation();
  }

  startSimulation() {
    window.requestAnimationFrame(() => this.run());
  }

  toggleGameState() {
    this.isPaused = !this.isPaused ? true : false;
  }

  generateCells() {
    for (let y = 0; y < this.rows; y++)
      for (let x = 0; x < this.cols; x++)
        this.cells.push(new Cell(this.context, x, y));
  }

  getIndex(x, y) {
    return x + (y * this.cols);
  }

  getCellState(x, y) {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows)
      return false;

    return this.cells[this.getIndex(x, y)].state ? 1 : 0;
  }

  countNeighbours(x, y) {
    let neighbours = 0;

    if (this.getCellState(x - 1, y - 1)) neighbours++;
    if (this.getCellState(x - 1, y)) neighbours++;
    if (this.getCellState(x - 1, y + 1)) neighbours++;

    if (this.getCellState(x, y - 1)) neighbours++;
    if (this.getCellState(x, y + 1)) neighbours++;

    if (this.getCellState(x + 1, y - 1)) neighbours++;
    if (this.getCellState(x + 1, y)) neighbours++;
    if (this.getCellState(x + 1, y + 1)) neighbours++;

    return neighbours;
  }

  calculateNextState(x, y) {
    const neighbours = this.countNeighbours(x, y);
    let nextState = false;
    const idx = this.getIndex(x, y);
    const currentState = this.cells[idx].state;

    if (currentState && (neighbours === 2 || neighbours === 3))
      nextState = true;

    if (!currentState && neighbours === 3)
      nextState = true;

    this.cells[idx].nextState = nextState;
  }

  nextTick() {
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.calculateNextState(x, y);
      }
    }

    // apply state
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].state = this.cells[i].nextState;
    }
  }

  drawCanvas() {
    for (let i = 0; i < this.cells.length; i++)
      this.cells[i].draw();
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  run() {
    this.clear();
    this.nextTick();
    this.drawCanvas();

    setTimeout(() => {
      if (this.isPaused) return;
      window.requestAnimationFrame(() => this.run());
    }, 100);
  }
}
