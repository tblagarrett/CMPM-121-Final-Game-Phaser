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
        if (random < this.chanceToGen) {
          cell.addSun();
        }
        cell.addWater(random < this.chanceToGen / 2);
        if(cell.plant) {
          cell.plant.levelUp(this.countAdjacentPlants(i,j));
        }
        
        cell.updateIndicators();
      }
    }
  }

  getCell(x, y) {
    return this.cells[y][x];
  }

  countAdjacentPlants(x,y) {
    let neighbors = 0;
    if(y < this.height-1) {
      if(this.cells[x][y+1].plant) {
        neighbors++;
      }
    }
    if(y > 0) {
      if(this.cells[x][y-1].plant) {
        neighbors++;
      }

    }
    if(x < this.width-1) {
      if(this.cells[x+1][y].plant) {
        neighbors++;
      }
    }
    if(x > 0) {
      if(this.cells[x-1][y].plant) {
        neighbors++;
      }
    }

    return neighbors;
  }
}
