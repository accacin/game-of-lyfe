class Cell
{
  static width = 10;
  static height = 10;

  constructor(context, posX, posY) {
    this.context = context;
    this.posX = posX;
    this.posY = posY;
    this.alive = Math.random() > 0.5;
  }

  draw() 
  {
    this.context.fillStyle = this.alive ? '#FF0000' : '#303030';
    this.context.fillRect(this.posX * Cell.width, this.posY * Cell.height, Cell.width, Cell.height);
  }
}
  
class Game
{
  static rows = 50;
  static cols = 50;
   
  constructor(canvasId) 
  {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    this.cells = [];
    this.generateCells();
  }

  generateCells()
  {
    for (let x = 0; x < Game.cols; x++)
      for (let y = 0; y < Game.rows; y++)
       this.cells.push(new Cell(this.context, x, y));

    // Draw cells for test
    for (let i = 0; i < this.cells.length; i++)
      this.cells[i].draw();
  }
}

window.onload = () => {
  let game = new Game('cells');
}
