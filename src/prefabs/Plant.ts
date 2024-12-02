import Phaser from "phaser";

export class Plant extends Phaser.GameObjects.Sprite {
  plant_type: number;
  waterStored: number;
  sunStored: number;
  level: number;
  plantReq: number;
  maxLevel: number;
  maxSun: number;
  maxWater: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: number,
    level: number
  ) {
    let texture: string;
    const spriteName = `plant${type}-level${level}`;
    if (type === 1 || type === 2 || type === 3) {
      texture = spriteName;
    } else {
      throw new Error("Invalid plant type");
    }
    super(scene, x, y, texture);

    this.plant_type = type;
    this.waterStored = 0;
    this.sunStored = 0;
    this.level = level;
    this.plantReq = 1;

    if (this.plant_type === 1) {
      this.maxLevel = 3;
      this.maxSun = 5;
      this.maxWater = 8;
    } else if (this.plant_type === 2) {
      this.maxLevel = 4;
      this.maxSun = 3;
      this.maxWater = 5;
    } else if (this.plant_type === 3) {
      this.maxLevel = 2;
      this.maxSun = 8;
      this.maxWater = 10;
    } else {
      throw new Error("Invalid plant type"); // Defensive check for unsupported types
    }

    this.scene.add.existing(this);
    this.setDisplaySize(80, 80);
  }

  needsWater(): boolean {
    return this.waterStored < this.maxWater;
  }

  needsSun(): boolean {
    return this.sunStored < this.maxSun;
  }

  addWater(): void {
    this.waterStored++;
  }

  addSun(): void {
    this.sunStored++;
  }

  isMaxLevel(): boolean {
    return this.level >= this.maxLevel;
  }

  levelUp(num: number): void {
    if (this.level < this.maxLevel) {
      if (!this.needsWater() && !this.needsSun()) {
        if (this.plantReq < num) {
          this.level++;
          const spriteName = `plant${this.plant_type}-level${this.level}`;
          this.waterStored = 0;
          this.sunStored = 0;
          this.setTexture(spriteName);
          this.setDisplaySize(80, 80);
        }
      }
    }
  }
}
