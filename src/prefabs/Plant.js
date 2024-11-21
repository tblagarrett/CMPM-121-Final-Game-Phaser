import Phaser from "phaser";
export class Plant extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, type) {
    super(scene, x, y);
    this.plant = null;
    this.waterStored = 0;
    this.sunStored = 0;
    this.level = 1;

    if (type == 1) {
      this.maxLevel = 3;
      this.maxSun = 5;
      this.maxWater = 8;
    } else if (type == 2) {
      this.maxLevel = 5;
      this.maxSun = 3;
      this.maxWater = 5;
    } else if (type == 3) {
      this.maxLevel = 2;
      this.maxSun = 8;
      this.maxWater = 10;
    }
  }

  needsWater() {
    return this.maxWater - this.waterStored >= 1;
  }

  needsSun() {
    return this.maxSun - this.sunStored >= 1;
  }

  addWater() {
    this.waterStored++;
  }

  addSun() {
    this.sunStored++;
  }

  isMaxLevel() {
    return this.level >= this.maxLevel;
  }
}
