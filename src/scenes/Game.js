import Cell from "../prefabs/Cell";
import Grid from "../prefabs/Grid";
import { Scene } from "phaser";
import { Player } from "../prefabs/Player";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.cameras.main.setBackgroundColor(0xffffff);

    this.gridSizeX = 10;
    this.gridSizeY = 10;
    this.cellSize = 80;

    this.grid = new Grid(
      this,
      this.cellSize / 2,
      this.cellSize / 2,
      this.gridSizeX,
      this.gridSizeY,
      this.cellSize
    );
    this.player = new Player(
      this,
      this.cellSize / 2,
      this.cellSize / 2,
      "hero",
      this.gridSizeX,
      this.gridSizeY,
      this.cellSize
    );

    this.plantsReaped = 0;

    // sow/reap input
    this.input.keyboard.on("keydown-SPACE", () =>
      this.sowOrReap(this.player.cell.i, this.player.cell.j)
    );
  }

  timeStep() {
    this.grid.timeStep();
  }

  sowOrReap(x, y) {
    let cell = this.grid.getCell(x, y);

    if (cell.canSow()) {
      cell.sow();
    } else if (cell.canReap()) {
      cell.reap();
    }
  }

  checkForComplete() {}
}
