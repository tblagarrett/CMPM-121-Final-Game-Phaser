import Phaser from "phaser";
export class Plant extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.plant = null;
    this.waterStored = 0;
    this.sunStored = 0;
    this.level = 1;
    this.maxLevel = 0;
    this.maxSun = 0;
    this.maxWater = 0;
  }

  setPlantType(num) {
    if (num == 1) {
      this.maxLevel = 3;
      this.maxSun = 5;
      this.maxWater = 8;
    } else if (num == 2) {
      this.maxLevel = 5;
      this.maxSun = 3;
      this.maxWater = 5;
    } else if (num == 3) {
      this.maxLevel = 2;
      this.maxSun = 8;
      this.maxWater = 10;
    }
  }

  needWater() {
    return typeWaterMax - this.waterStored >= 1;
  }

  needSun() {
    return typeSunMax - this.sunStored >= 1;
  }

  addWater() {
    this.waterStored++;
  }

  addSun() {
    this.sunStored++;
  }
}
