import Phaser from "phaser";
import { Plant } from "./Plant";
export class Cell extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, cellSize) {
    super(scene, x, y, texture, frame);
    this.plant = null;
    this.waterStored = 0;

    this.sprite = scene.add.existing(this);
    this.sprite.setDepth(0);
    this.displayWidth = cellSize;
    this.displayHeight = cellSize;

    // Add text indicators
    this.waterText = scene.add.text(
      y + cellSize / 2 + 5, // Position near top-left
      x + cellSize / 2 + 5,
      `${this.waterStored}`,
      { fontSize: "16px", fill: "#0000ff" } // Blue text
    );
    this.waterText.setDepth(1);

    // Add text indicators
    this.isPlantThere;
    if (this.plant) {
      this.isPlantThere = this.plant.level;
    } else {
      this.isPlantThere = 0;
    }
    this.plantText = scene.add.text(
      y + cellSize / 2 - 20, // Position near top-left
      x + cellSize / 2 + 5,
      `${this.isPlantThere}`,
      { fontSize: "16px", fill: "#ffff0" } // Blue text
    );
    this.plantText.setDepth(1);
  }

  // Method to update the visual indicators
  updateIndicators() {
    this.waterText.setText(`${this.waterStored}`);

    if (this.plant) {
      this.isPlantThere = this.plant.level;
    } else {
      this.isPlantThere = 0;
    }
    this.plantText.setText(`${this.isPlantThere}`);
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
    if (this.plant == null) {
      return true;
    }
    return false;
  }

  canReap() {
    if (!this.plant) {
      return false;
    }

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

    this.updateIndicators();
  }

  addSun() {
    if (this.plant && this.plant.needsSun()) {
      this.plant.addSun();
    }
  }
}
