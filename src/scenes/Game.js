import Cell from "../prefabs/Cell";
import Grid from "../prefabs/Grid";
import { Scene } from "phaser";
import { Player } from "../prefabs/Player";
import StateManager from "../prefabs/StateManager";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  init() {
    this.ENDGOAL = 50;
  }

  create() {
    this.cameras.main.setBackgroundColor(0xffffff);

    this.gridSizeX = 10;
    this.gridSizeY = 10;
    this.cellSize = 80;

    // Create grid and player
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
    this.player.setDepth(1);

    this.plantsReaped = 0;
    this.time = 0;

    // Initialize StateManager
    this.StateManager = new StateManager(this.gridSizeX, this.gridSizeY);
    this.loadGameState();

    // sow/reap input
    this.input.keyboard.on("keydown-SPACE", () => {
      this.sowOrReap(this.player.cell.i, this.player.cell.j);
      this.checkForComplete();
    });

    // Save/Load inputs
    this.input.keyboard.on("keydown-S", () => {
      this.saveGameState();
    });

    this.input.keyboard.on("keydown-L", () => {
      this.loadGameState();
    });

    this.input.keyboard.on("keydown-U", () => {
      const { grid, actions } = this.StateManager.undo(this.grid);
      if (grid) {
        this.player.actions = actions;
        this.player.reset();
        this.updateGridVisuals();
        console.log("Undo performed!");
      }
    });

    this.input.keyboard.on("keydown-R", () => {
      const { grid, actions } = this.StateManager.redo(this.grid);
      if (grid) {
        this.player.actions = actions;
        this.player.reset();
        this.updateGridVisuals();
        console.log("Redo performed!");
      }
    });
  }

  timeStep() {
    this.saveGameState();
    this.grid.timeStep();
    this.time++;
  }

  sowOrReap(x, y) {
    let cell = this.grid.getCell(x, y);
    if (cell.canSow()) {
      cell.sow();
      this.saveGameState();
    } else if (cell.canReap()) {
      cell.reap();
      this.plantsReaped++;
      this.saveGameState();
    }
  }

  checkForComplete() {
    if (this.plantsReaped >= this.ENDGOAL) {
      this.scene.pause("Game");
      this.scene.launch("End", { time: this.time });
    }
  }

  // Save the game state
  saveGameState() {
    this.StateManager.saveGameState(this.grid, this.player.actions);
  }

  // Load the game state and immediately update the visuals
  loadGameState() {
    const { grid, actions } = this.StateManager.loadGameState(this.grid);
    if (!grid) return;

    // Update player state
    this.player.actions = actions;
    this.player.reset();

    this.updateGridVisuals(); // Update visuals
    console.log("Game state loaded!");
  }

  // Force update the grid visuals after loading the game state
  updateGridVisuals() {
    for (let i = 0; i < this.grid.width; i++) {
      for (let j = 0; j < this.grid.height; j++) {
        let cell = this.grid.getCell(i, j);
        cell.updateIndicators(); // Update each cell's visual indicators
      }
    }
  }
}
