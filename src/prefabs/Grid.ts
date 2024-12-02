import Phaser from "phaser";
import { Cell } from "./Cell";

export default class Grid extends Phaser.GameObjects.Container {
  public scene: Phaser.Scene;
  public width: number;
  public height: number;
  public cellSize: number;
  private chanceToGen: number;
  private cells: Cell[][];

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    cellSize: number
  ) {
    super(scene, x, y);
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.chanceToGen = 0.1;

    this.cells = [];

    // Create the grid of cells
    for (let i = 0; i < this.width; i++) {
      let row: Cell[] = [];
      for (let j = 0; j < this.height; j++) {
        const newCell = new Cell(
          scene,
          i * cellSize,
          j * cellSize,
          "blank-cell",
          undefined,
          cellSize
        );
        row.push(newCell);
        this.add(newCell);
      }
      this.cells.push(row);
    }
    this.scene.add.existing(this);
  }

  timeStep(): void {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        let random = Math.random();
        let cell = this.cells[i][j];
        if (random < this.chanceToGen) {
          cell.addSun();
        }
        cell.addWater(random < this.chanceToGen / 2);
        if (cell.plant) {
          cell.plant.levelUp(this.countAdjacentPlants(i, j));
        }

        cell.updateIndicators();
      }
    }
  }

  getCell(x: number, y: number): Cell {
    return this.cells[y][x];
  }

  countAdjacentPlants(x: number, y: number): number {
    let neighbors = 0;
    if (y < this.height - 1) {
      if (this.cells[x][y + 1].plant) {
        neighbors++;
      }
    }
    if (y > 0) {
      if (this.cells[x][y - 1].plant) {
        neighbors++;
      }
    }
    if (x < this.width - 1) {
      if (this.cells[x + 1][y].plant) {
        neighbors++;
      }
    }
    if (x > 0) {
      if (this.cells[x - 1][y].plant) {
        neighbors++;
      }
    }

    return neighbors;
  }
}
