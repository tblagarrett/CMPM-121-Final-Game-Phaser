import Phaser from "phaser";
import { Cell } from "./Cell";
export default class Grid extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, cellSize) {
    super(scene, x, y);
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.chanceToGen = 0.1;

    this.cells = [];

    for (let i = 0; i < this.width; i++) {
      let row = [];
      for (let j = 0; j < this.height; j++) {
        let newCell = new Cell(
          this.scene,
          i * cellSize,
          j * cellSize,
          "blank-cell", // Cell Texture
          null,
          cellSize
        );
        row.push(newCell);
        this.add(newCell);
      }
      this.cells.push(row);
    }
    this.scene.add.existing(this);
  }

  timeStep() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        let random = Math.random();
        let cell = this.cells[i][j];
        if (random < this.chanceToGen / 2) {
          cell.addSun();
        } else if (random < this.chanceToGen) {
          cell.addWater(getRandomInt(1, 5));
        }

        cell.updateIndicators();
        // check parameters for plant leveling
      }
    }
  }

  getCell(x, y) {
    return this.cells[y][x];
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
