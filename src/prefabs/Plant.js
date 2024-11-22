import Phaser from "phaser";
export class Plant extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, type) {
    super(scene, x, y, this.type);
    this.plant = null;
    this.waterStored = 0;
    this.sunStored = 0;
    this.level = 1;
    this.plantReq = 1;

    if (this.type == 1) {
      this.maxLevel = 3;
      this.maxSun = 5;
      this.maxWater = 8;
      this.sprite = scene.add.sprite("plant1-level1");
    } else if (this.type == 2) {
      this.maxLevel = 4;
      this.maxSun = 3;
      this.maxWater = 5;
      this.sprite = scene.add.sprite("plant2-level1");
    } else if (this.type == 3) {
      this.maxLevel = 2;
      this.maxSun = 8;
      this.maxWater = 10;
      this.sprite = scene.add.sprite("plant2-level1");
    }
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

  levelUp(num){
    if(!this.needsWater() && !this.needsSun()){
        if(this.plantReq < num){
            this.level++;
            const spriteName = "plant" + this.type + "-level" + this.level;
            this.waterStored = 0;
            this.sunStored = 0;
           this.sprite.setTexture(spriteName);
        }
    }
  }

}
