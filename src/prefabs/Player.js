export class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, cellSize) {
    super(scene, x, y, texture);
    this.scene.add.existing(this);
    this.setScale(3.5);
    this.setOrigin(0.5, 0.5);

    this.CELL = cellSize;
    this.GAMEWIDTH = this.scene.sys.game.config.width;
    this.GAMEWIDTH = this.scene.sys.game.config.height;

    this.actions = [];
    this.currentCell = {
      i: Math.floor(this.x / this.CELL),
      j: Math.floor(this.y / this.CELL),
    };

    // Add event listeners for key inputs
    this.scene.input.keyboard.on("keydown-LEFT", () =>
      this.move(-this.CELL, 0)
    );
    this.scene.input.keyboard.on("keydown-RIGHT", () =>
      this.move(this.CELL, 0)
    );
    this.scene.input.keyboard.on("keydown-UP", () => this.move(0, -this.CELL));
    this.scene.input.keyboard.on("keydown-DOWN", () => this.move(0, this.CELL));
  }

  move(x, y) {
    // checks if outside of game bounds
    if (this.x + x < 0 || this.x + x > this.GAMEWIDTH) return;
    if (this.y + y < 0 || this.y + y > this.GAMEWIDTH) return;

    // adds to player position and updates current cell
    this.x += x;
    this.y += y;
    this.currentCell = {
      i: Math.floor(this.x / this.CELL),
      j: Math.floor(this.y / this.CELL),
    };
    this.actions.push({ ...this.currentCell });
  }

  position() {
    return this.currentCell;
  }
}
