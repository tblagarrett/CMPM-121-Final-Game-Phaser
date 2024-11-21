import { Scene } from "phaser";
import { Player } from "../prefabs/Player";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.cameras.main.setBackgroundColor(0xffffff);

    this.gridSizeX = 8;
    this.gridSizeY = 8;

    this.player = new Player(
      this,
      8,
      8,
      "hero",
      this.gridSizeX,
      this.gridSizeY
    );
    this.grid = null;

    this.plantsReaped = 0;
  }

  timeStep() {
    this.grid.timeStep();
  }

  sowOrReap(x, y) {
    let cell = this.grid.getCell(x, y);

    let sown = cell.sow();
    if (!sown) {
      if (cell.reap()) {
        this.plantsReaped++;
      } // Returns the plant reaped
    }
  }

  checkForComplete() {}
}
