import Phaser from "phaser";
import { PlantConfig } from "./InternalDSL";

// used for generating plant config as one 32 bit integer for less memory storage
export class PlantMemento {
  // Encode a PlantConfig into a unique Int32 key
  public static encode(plant: PlantConfig): number {
    // **** type can go up to 65,535, but everything else is maxed at 15
    return (
      (plant.type << 16) | // Store type in the upper 16 bits
      (plant.maxLevel << 12) | // maxLevel in bits 12-15
      (plant.neighborsRequired << 8) | // neighborsRequired in bits 8-11
      (plant.sunRequired << 4) | // sunRequired in bits 4-7
      plant.waterRequired // waterRequired in bits 0-3
    );
  }

  // Decode an Int32 key back into a PlantConfig
  public static decode(key: number): PlantConfig {
    return {
      type: (key >> 16) & 0x0f, // Extract type from bits 16-19
      maxLevel: (key >> 12) & 0x0f, // Extract maxLevel from bits 12-15
      neighborsRequired: (key >> 8) & 0x0f, // Extract neighborsRequired from bits 8-11
      sunRequired: (key >> 4) & 0x0f, // Extract sunRequired from bits 4-7
      waterRequired: key & 0x0f, // Extract waterRequired from bits 0-3
    };
  }
}

export class Plant extends Phaser.GameObjects.Sprite {
  waterStored: number;
  sunStored: number;
  level: number;
  config: PlantConfig;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config: PlantConfig,
    level: number
  ) {
    const spriteName = `plant${config.type}-level${level}`;

    super(scene, x, y, spriteName);

    this.waterStored = 0;
    this.sunStored = 0;
    this.level = level;
    this.config = config;

    this.scene.add.existing(this);
    this.setDisplaySize(80, 80);
  }

  needsWater(): boolean {
    return this.waterStored < this.config.waterRequired;
  }

  needsSun(): boolean {
    return this.sunStored < this.config.sunRequired;
  }

  addWater(): void {
    this.waterStored++;
  }

  addSun(): void {
    this.sunStored++;
  }

  isMaxLevel(): boolean {
    return this.level >= this.config.maxLevel;
  }

  levelUp(num: number): void {
    if (this.level < this.config.maxLevel) {
      if (!this.needsWater() && !this.needsSun()) {
        if (this.config.neighborsRequired < num) {
          this.level++;
          const spriteName = `plant${this.config.type}-level${this.level}`;
          this.waterStored = 0;
          this.sunStored = 0;
          this.setTexture(spriteName);
          this.setDisplaySize(80, 80);
        }
      }
    }
  }
}
