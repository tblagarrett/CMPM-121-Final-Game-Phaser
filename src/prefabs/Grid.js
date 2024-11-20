class Grid extends Phaser.GameObjects.Container {
  constructor(scene, width, height, cellSize) {
    super(scene);
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;

    this.chanceToGen = 0.1;

    this.cells = [];

    for (let i = 0; i < this.width; i++) {
      let row = [];
      for (let j = 0; j < this.height; j++) {
        let newCell = new Cell(this.scene, i, j);
        row.push(newCell);
        this.add(newCell);
      }
      this.cells.push(row);
    }
  }

  timeStep() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        let random = Math.random();
        let cell = this.cells[i][j];
        if (random < this.chanceToGen / 2) {
          cell.addSun();
        } else if (random < this.chanceToGen) {
          cell.addWater(Math.random(Range(1, 5)));
        }

        // check parameters for plants
      }
    }
  }

  getCell(x, y) {
    return this.cells[y][x];
  }
}
