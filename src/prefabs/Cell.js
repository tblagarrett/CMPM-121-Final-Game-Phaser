import Phaser from "phaser";
import { Plant } from "./Plant";
export class Cell extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, cellSize) {
    super(scene, x, y, texture, frame);
    this.plant = null;
    this.waterStored = 0;

    this.sprite = scene.add.existing(this);
    this.displayWidth = cellSize;
    this.displayHeight = cellSize;

    // console.log(`${x}, ${y}`);
  }

  sow() {
    let type = Math.floor(Math.random() * (1 - 3) + 1);
    this.plant = new Plant(this.scene, this.x, this.y, type);
  }

  reap() {
    const plant = this.plant;
    this.plant = null;
    return plant;
  }

  canSow() {
    if (this.plant != null) {
      return true;
    }
    return false;
  }

  canReap() {
    return this.plant.isMaxLevel();
  }

  addWater(amount) {
    this.waterStored += amount;

    if (this.waterStored > 0) {
      if (this.plant && this.plant.needsWater(amount)) {
        this.plant.addWater(1);
        this.waterStored--;
      }
    }
  }

  addSun() {
    if (this.plant && this.plant.needsSun()) {
      this.plant.addSun();
    }
  }
}
