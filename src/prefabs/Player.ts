import { Game } from "../scenes/Game"; // Import the Game class
import { InputManager } from "./InputManager";

// based on grid cells
export interface Position {
  i: number;
  j: number;
}

export class Player extends Phaser.GameObjects.Sprite {
  private CELLSIZE: number;
  private GAMEWIDTH: number;
  private GAMEHEIGHT: number;
  public position: Position;
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
    this.position = this.localToCell(x, y);

    // Input manager bindings
    const inputManager = new InputManager(this.scene);

    // Add event listeners for key inputs
    inputManager.bindKey("LEFT", () =>
      this.move(-this.CELLSIZE, 0)
    , "⬅️");
    inputManager.bindKey("RIGHT", () =>
      this.move(this.CELLSIZE, 0)
    , "➡️");
    inputManager.bindKey("UP", () =>
      this.move(0, -this.CELLSIZE)
    , "⬆️");
    inputManager.bindKey("DOWN", () =>
      this.move(0, this.CELLSIZE)
    , "⬇️");

    /*this.scene.input?.keyboard?.on("keydown-LEFT", () =>
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
    );*/
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

  reset(position: Position): void {
    this.position = position;
    const { x, y } = this.cellToLocal(position.i, position.j);
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
    this.position = newCell;
  }
}
