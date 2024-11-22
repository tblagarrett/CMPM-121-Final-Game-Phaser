import Phaser from "phaser";
import { Plant } from "./Plant";
export class Cell extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, cellSize) {
    super(scene, x, y, texture, frame);
    this.cellSize = cellSize;
    this.plant = null;
    this.waterStored = 0;
    this.maxWater = 6;

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
    let type = getRandomInt(1, 3);
    this.plant = new Plant(this.scene, this.y + (this.cellSize / 2), this.x + (this.cellSize / 2), type, "plant1-level1");

    this.updateIndicators();
  }

  reap() {
    const plant = this.plant;
    plant.destroy();
    this.plant = null;

    this.updateIndicators();
    //return plant;
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

  addWater(isAddingWater) {
    let amount = getRandomInt(1, 5);

    if (isAddingWater) {
      if (amount + this.waterStored > this.maxWater) {
        this.waterStored = this.maxWater;
      } else {
        this.waterStored += amount;
      }
    }

    if (this.waterStored > 0) {
      if (this.plant && this.plant.needsWater()) {
        this.plant.addWater();
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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
