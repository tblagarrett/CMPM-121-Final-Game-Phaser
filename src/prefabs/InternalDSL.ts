import { PlantConfig } from "./Settings";
import { WeatherConfig } from "./Settings";
import { VictoryConditions } from "./Settings";
import Grid from "./Grid";
import { Game } from "../scenes/Game";


export class InternalDSL {
  private plants: PlantConfig[];

  private constructor() { // Make the constructor private if you're using a factory pattern
    this.plants = []; // Initialize the array
  }

  static create() {
    return new InternalDSL();
  }

  defineWeatherConfig(grid: Grid, config: WeatherConfig) {
    grid.chanceToGenWater = config.waterFrequency;
    grid.chanceToGenSun = config.sunFrequency;
    grid.events = config.events;
  }

  definePlantType(config: PlantConfig): this {
    this.plants.push(config);
    return this;
  }

  getPlantType(type: number) {
    return this.plants[type];
  }

  getRandPlantType() {
    return this.plants[getRandomInt(this.plants.length)];
  }

  removePlantType(type: number) {
    return this.plants.splice(1, type);
  }
}

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}
