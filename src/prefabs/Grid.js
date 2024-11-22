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
        }
        cell.addWater(random < this.chanceToGen);
        console.log(cell.plant, i,j);
        if(cell.plant) {
          //console.log("i,j", i,j);
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
    console.log(this.cells[x][y+1].plant);
    if(this.cells[x][y+1].plant) {
      neighbors++;
      console.log(x, y+1);
    }
    if(this.cells[x][y-1].plant) {
      neighbors++;
      console.log(x, y-1);
    }
    if(this.cells[x+1][y].plant) {
      neighbors++;
      console.log(x+1, y);
    }
    if(this.cells[x-1][y].plant) {
      neighbors++;
      console.log(x-1, y);
    }
    
  }
}
