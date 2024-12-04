import Phaser from "phaser";
import { PlantConfig } from "./InternalDSL";

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
    plant: PlantConfig
    //level: number
  ) {
    let texture: string;
    const spriteName = `plant${plant.type}-level${plant.maxLevel}`;
    if (plant.type === 1 || plant.type === 2 || plant.type === 3) {
      texture = spriteName;
    } else {
      throw new Error("Invalid plant type");
    }
    super(scene, x, y, texture);

    this.plant_type = plant.type;
    this.waterStored = 0;
    this.sunStored = 0;
    this.level = plant.maxLevel;
    this.plantReq = plant.neighborsRequired;
    this.maxLevel = plant.maxLevel;
    this.maxSun = plant.sunRequired;
    this.maxWater = plant.waterRequired;

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
