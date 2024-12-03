import Phaser from "phaser";
import { Plant } from "./Plant";
import { InternalDSL } from "./InternalDSL";

export class Cell extends Phaser.GameObjects.Sprite {
  cellSize: number;
  plant: Plant | null;
  waterStored: number;
  maxWater: number;
  waterText: Phaser.GameObjects.Text;
  plantText: Phaser.GameObjects.Text;
  isPlantThere: number;
  sprite: Phaser.GameObjects.Sprite;
  plantTypes: InternalDSL;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame: string | number | undefined,
    cellSize: number
  ) {
    super(scene, x, y, texture, frame);

    this.cellSize = cellSize;
    this.plant = null;
    this.waterStored = 0;
    this.maxWater = 6;

    // Add the cell sprite
    this.sprite = scene.add.existing(this);
    this.sprite.setDepth(0);
    this.displayWidth = cellSize;
    this.displayHeight = cellSize;

    // Add text indicators for water
    this.waterText = scene.add.text(
      y + cellSize / 2 + 5,
      x + cellSize / 2 + 5,
      `${this.waterStored}`,
      { fontSize: "16px", color: "#0000ff" } // Blue text
    );
    this.waterText.setDepth(1);

    // Initialize plant indicator
    this.isPlantThere = this.plant ? (this.plant as Plant).level : 0;
    this.plantText = scene.add.text(
      y + cellSize / 2 - 20,
      x + cellSize / 2 + 5,
      `${this.isPlantThere}`,
      { fontSize: "16px", color: "#ffff0" } // Yellow text
    );
    this.plantText.setDepth(1);
  }

  // Update visual indicators
  updateIndicators(): void {
    this.waterText.setText(`${this.waterStored}`);

    this.isPlantThere = this.plant ? this.plant.level : 0;
    this.plantText.setText(`${this.isPlantThere}`);
  }

  // Sow a new plant
  sow(): void {
    const type = this.plantTypes.getRandPlantType();
    this.plant = new Plant(
      this.scene,
      this.y + this.cellSize / 2,
      this.x + this.cellSize / 2,
      type,
      1
    );

    this.updateIndicators();
  }

  // Reap the plant
  reap(): void {
    if (this.plant) {
      this.plant.destroy();
      this.plant = null;

      this.updateIndicators();
    }
  }

  // Check if the cell can sow a plant
  canSow(): boolean {
    return this.plant === null;
  }

  // Check if the cell can reap the plant
  canReap(): boolean {
    return this.plant ? this.plant.isMaxLevel() : false;
  }

  // Add water to the cell
  addWater(isAddingWater: boolean): void {
    const amount = getRandomInt(1, 5);

    if (isAddingWater) {
      this.waterStored = Math.min(this.waterStored + amount, this.maxWater);
    }

    if (this.waterStored > 0 && this.plant?.needsWater()) {
      this.plant.addWater();
      this.waterStored--;
    }

    this.updateIndicators();
  }

  // Add sunlight to the plant
  addSun(): void {
    if (this.plant?.needsSun()) {
      this.plant.addSun();
    }
  }
}

// Utility function for generating random integers
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
