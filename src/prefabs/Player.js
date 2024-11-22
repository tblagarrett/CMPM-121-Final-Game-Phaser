export class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, gridSizeX, gridSizeY, cellSize) {
    super(scene, x, y, texture);
    this.scene.add.existing(this);
    this.setScale(3.5);
    this.setOrigin(0.5, 0.5);

    // global constants
    this.CELLSIZE = cellSize;
    this.GAMEWIDTH = gridSizeX;
    this.GAMEHEIGHT = gridSizeY;

    //
    this.actions = [];
    this.cell = {
      i: Math.floor(this.x / this.CELLSIZE),
      j: Math.floor(this.y / this.CELLSIZE),
    };

    // Add event listeners for key inputs
    this.scene.input.keyboard.on("keydown-LEFT", () =>
      this.move(-this.CELLSIZE, 0)
    );
    this.scene.input.keyboard.on("keydown-RIGHT", () =>
      this.move(this.CELLSIZE, 0)
    );
    this.scene.input.keyboard.on("keydown-UP", () =>
      this.move(0, -this.CELLSIZE)
    );
    this.scene.input.keyboard.on("keydown-DOWN", () =>
      this.move(0, this.CELLSIZE)
    );
  }

  move(x, y) {
    this.scene.timeStep();

    // Calculate new position
    const newX = this.x + x;
    const newY = this.y + y;

    // Calculate new cell
    const newCell = {
      i: Math.floor(newX / this.CELLSIZE),
      j: Math.floor(newY / this.CELLSIZE),
    };

    // Check if new cell is within bounds
    if (newCell.i < 0 || newCell.i >= this.GAMEWIDTH) return;
    if (newCell.j < 0 || newCell.j >= this.GAMEHEIGHT) return;

    // Update player position and current cell
    this.x = newX;
    this.y = newY;
    this.cell = newCell;
    this.actions.push({ ...this.cell });
  }
}
