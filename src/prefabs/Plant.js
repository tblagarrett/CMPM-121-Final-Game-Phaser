import Phaser from "phaser";
export class Plant extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, type) {
    let texture;
    if (type === 1) {
      texture = "plant1-level1";
    } else if (type === 2) {
      texture = "plant2-level1";
    } else if (type === 3) {
      texture = "plant3-level1";
    }
    super(scene, x, y, texture);
    this.type = type;

    this.plant = null;
    this.waterStored = 0;
    this.sunStored = 0;
    this.level = 1;
    this.plantReq = 1;

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

    this.scene.add.existing(this);
    this.setDisplaySize(80, 80);
  }

  needsWater() {
    return this.waterStored < this.maxWater;
  }

  needsSun() {
    return this.sunStored < this.maxSun;
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

  levelUp(num) {
    if (this.level < this.maxLevel) {
      if (!this.needsWater() && !this.needsSun()) {
        if (this.plantReq < num) {
          this.level++;
          const spriteName = "plant" + this.type + "-level" + this.level;
          this.waterStored = 0;
          this.sunStored = 0;
          this.setTexture(spriteName);
          this.setDisplaySize(80, 80);
        }
      }
    }
  }
}
