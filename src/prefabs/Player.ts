import { Game } from "../scenes/Game"; // Import the Game class

export class Player extends Phaser.GameObjects.Sprite {
  private CELLSIZE: number;
  private GAMEWIDTH: number;
  private GAMEHEIGHT: number;
  public cell: { i: number; j: number };
  public actions: { i: number; j: number }[];
  private gameScene: Game;

  constructor(
    scene: Game,
    x: number,
    y: number,
    texture: string,
    gridSizeX: number,
    gridSizeY: number,
    cellSize: number
  ) {
    super(scene, x, y, texture);
    this.gameScene = scene;
    this.scene.add.existing(this);
    this.setScale(3.5);
    this.setOrigin(0.5, 0.5);

    // Global constants
    this.CELLSIZE = cellSize;
    this.GAMEWIDTH = gridSizeX;
    this.GAMEHEIGHT = gridSizeY;

    // Initialize cell and actions
    this.cell = this.localToCell(x, y);
    this.actions = [this.cell];

    // Add event listeners for key inputs
    this.scene.input?.keyboard?.on("keydown-LEFT", () =>
      this.move(-this.CELLSIZE, 0)
    );
    this.scene.input?.keyboard?.on("keydown-RIGHT", () =>
      this.move(this.CELLSIZE, 0)
    );
    this.scene.input?.keyboard?.on("keydown-UP", () =>
      this.move(0, -this.CELLSIZE)
    );
    this.scene.input?.keyboard?.on("keydown-DOWN", () =>
      this.move(0, this.CELLSIZE)
    );
  }

  localToCell(x: number, y: number): { i: number; j: number } {
    return {
      i: Math.floor(x / this.CELLSIZE),
      j: Math.floor(y / this.CELLSIZE),
    };
  }

  cellToLocal(i: number, j: number): { x: number; y: number } {
    return {
      x: i * this.CELLSIZE + this.CELLSIZE / 2,
      y: j * this.CELLSIZE + this.CELLSIZE / 2,
    };
  }

  reset(): void {
    if (this.actions.length <= 0) return;
    const { i, j } = this.actions[this.actions.length - 1];
    const { x, y } = this.cellToLocal(i, j);
    this.x = x;
    this.y = y;
  }

  move(x: number, y: number): void {
    this.gameScene.timeStep();

    // Calculate new position
    const newX = this.x + x;
    const newY = this.y + y;

    // Calculate new cell
    const newCell = this.localToCell(newX, newY);

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
