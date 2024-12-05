import Grid from "../prefabs/Grid";
import { Player } from "../prefabs/Player";
import StateManager from "../prefabs/StateManager";

// Define the types for the grid, player, and other properties
export class Game extends Phaser.Scene {
  grid: Grid;
  player: Player;
  plantsReaped: number;
  gridSizeX: number;
  gridSizeY: number;
  cellSize: number;
  ENDGOAL: number;
  saveSlot: string;
  StateManager: StateManager;
  time_steps: number;

  constructor() {
    super("Game");
  }

  init(): void {
    this.ENDGOAL = 10;
    this.saveSlot = "save1";
    this.time_steps = 0;
  }

  create(): void {
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

    // Initialize StateManager
    this.StateManager = new StateManager(this.gridSizeX, this.gridSizeY);
    this.loadGameState();

    // sow/reap input
    this.input.keyboard?.on("keydown-SPACE", () => {
      this.sowOrReap(this.player.position.i, this.player.position.j);
      this.checkForComplete();
    });

    // Save/Load inputs
    this.input.keyboard?.on("keydown-S", () => {
      this.saveGameState();
    });

    this.input.keyboard?.on("keydown-L", () => {
      this.loadGameState();
    });

    this.input.keyboard?.on("keydown-U", () => {
      const { grid, position } = this.StateManager.undo(this.grid);
      console.log(position);
      if (grid) {
        this.player.reset(position);
        this.updateGridVisuals();
        console.log("Undo performed!");
      }
    });

    this.input.keyboard?.on("keydown-R", () => {
      const { grid, position } = this.StateManager.redo(this.grid);
      if (grid) {
        this.player.reset(position);
        this.updateGridVisuals();
        console.log("Redo performed!");
      }
    });

    // Save slot selection inputs
    this.input.keyboard?.on("keydown-ONE", () => {
      this.saveSlot = "save1";
      this.loadGameState();
      console.log("Selected save slot 1");
    });

    this.input.keyboard?.on("keydown-TWO", () => {
      this.saveSlot = "save2";
      this.loadGameState();
      console.log("Selected save slot 2");
    });

    this.input.keyboard?.on("keydown-THREE", () => {
      this.saveSlot = "save3";
      this.loadGameState();
      console.log("Selected save slot 3");
    });
  }

  timeStep(): void {
    this.saveGameState();
    this.grid.timeStep();
    this.time_steps++;
  }

  sowOrReap(x: number, y: number): void {
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

  checkForComplete(): void {
    if (this.plantsReaped >= this.ENDGOAL) {
      this.scene.pause("Game");
      this.scene.launch("End", { time_steps: this.time_steps });
    }
  }

  // Save the game state
  saveGameState(): void {
    this.StateManager.saveGameState(
      this.grid,
      this.player.position,
      this.saveSlot
    );
  }

  // Load the game state and immediately update the visuals
  loadGameState(): void {
    const { grid, position } = this.StateManager.loadGameState(
      this.grid,
      this.saveSlot
    );
    if (!grid) return;

    // Update player state
    this.player.reset(position);

    this.updateGridVisuals(); // Update visuals
    console.log("Game state loaded!");
  }

  // Force update the grid visuals after loading the game state
  updateGridVisuals(): void {
    for (let i = 0; i < this.grid.width; i++) {
      for (let j = 0; j < this.grid.height; j++) {
        let cell = this.grid.getCell(i, j);
        cell.updateIndicators();
      }
    }
  }
}
