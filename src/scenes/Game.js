import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.cameras.main.setBackgroundColor(0xffffff);

    this.gridSizeX = 8;
    this.gridSizeY = 8;

    this.player = null;
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
