import Phaser from "phaser";
export class Plant extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, type) {
    super(scene, x, y, this.type);
    this.plant = null;
    this.waterStored = 0;
    this.sunStored = 0;
    this.level = 1;

    if (this.type == 1) {
      this.maxLevel = 3;
      this.maxSun = 5;
      this.maxWater = 8;
    } else if (this.type == 2) {
      this.maxLevel = 4;
      this.maxSun = 3;
      this.maxWater = 5;
    } else if (this.type == 3) {
      this.maxLevel = 2;
      this.maxSun = 8;
      this.maxWater = 10;
    }
  }

    needWater(){
        return typeWaterMax - this.waterStored >= 1;
    }
    
    needSun(){
        return typeSunMax - this.sunStored >= 1;
    }

    addWater(){
        this.waterStored++;
    }

    addSun(){
        this.sunStored++;
    }
}