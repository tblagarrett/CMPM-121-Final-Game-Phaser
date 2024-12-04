import Phaser from "phaser";
import { Cell } from "./Cell";
import { settings } from "./Settings";
import { InternalDSL } from "./InternalDSL";
import { WeatherEventConfig } from "./Settings";

export default class Grid extends Phaser.GameObjects.Container {
  public scene: Phaser.Scene;
  public width: number;
  public height: number;
  public cellSize: number;
  public chanceToGenSun: number;
  public chanceToGenWater: number;
  public events: WeatherEventConfig[]; 
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
    settings.InternalDSL.defineWeatherConfig(this, settings.weather);

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
        if (random < this.chanceToGenSun) {
          cell.addSun();
        }
        random = Math.random();
        cell.addWater(random < this.chanceToGenWater);
        if (cell.plant) {
          cell.plant.levelUp(this.countAdjacentPlants(i, j));
        }

        cell.updateIndicators();
      }
    }
  }

  getCell(i: number, j: number): Cell {
    return this.cells[j][i];
  }

  countAdjacentPlants(i: number, j: number): number {
    let neighbors = 0;
    if (j < this.height - 1) {
      if (this.cells[i][j + 1].plant) {
        neighbors++;
      }
    }
    if (j > 0) {
      if (this.cells[i][j - 1].plant) {
        neighbors++;
      }
    }
    if (i < this.width - 1) {
      if (this.cells[i + 1][j].plant) {
        neighbors++;
      }
    }
    if (i > 0) {
      if (this.cells[i - 1][j].plant) {
        neighbors++;
      }
    }

    return neighbors;
  }
}
