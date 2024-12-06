import Grid from "../prefabs/Grid";
import { Player } from "../prefabs/Player";
import { SaveSession } from "../prefabs/SaveState";
import StateManager from "../prefabs/StateManager";
import { InputManager } from "../prefabs/InputManager";

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

    // Input manager bindings
    const inputManager = new InputManager(this);

    // Bind sow/reap
    inputManager.bindKey("SPACE", () => {
      this.sowOrReap(this.player.position.i, this.player.position.j);
      this.checkForComplete();
    });

    // Bind save/load/undo/redo
    inputManager.bindKey("S", () => this.saveGameState());
    inputManager.bindKey("L", () => this.loadGameState());
    inputManager.bindKey("U", () => {
      const session = this.StateManager.undo(this.grid);
      if (session) {
        this.updateGameState(session);
      }
    });

    inputManager.bindKey("R", () => {
      const session = this.StateManager.redo(this.grid);
      if (session) {
        this.updateGameState(session);
      }
    });

    // Bind save slot selection
    ["ONE", "TWO", "THREE"].forEach((key, index) => {
      inputManager.bindKey(key, () => {
        this.selectSaveSlot(index + 1);
      });
    });

    // Reset game
    inputManager.bindKey("C", () => {
      localStorage.clear();
      location.reload();
    });
  }

  selectSaveSlot(slotNumber: number): void {
    this.saveSlot = `save${slotNumber}`;
    this.loadGameState();
    console.log(`Selected save slot ${slotNumber}`);
  }

  timeStep(): void {
    this.grid.timeStep();
    this.time_steps++;
    this.saveGameState();
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
    const state: SaveSession = {
      grid: this.grid,
      position: this.player.position,
      time: this.time_steps,
    };
    this.StateManager.saveGameState(state, this.saveSlot);
  }

  // Load the game state and immediately update the visuals
  loadGameState(): void {
    const session = this.StateManager.loadGameState(this.grid, this.saveSlot);
    if (!session) return;
    this.updateGameState(session);
    console.log("Game state loaded!");
  }

  // Updates game constants and grid
  updateGameState(session: SaveSession) {
    // Update player state
    this.player.reset(session.position);
    // Update time state
    this.time_steps = session.time;
    console.log("time:", this.time_steps);
    this.updateGridVisuals();
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
