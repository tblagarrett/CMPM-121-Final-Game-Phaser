import externalDSL from '../../externalDSL.json' with {type: "json"};
import Grid from "./Grid";

export interface WeatherEventConfig {
    name: string;
    description: string;
    sunFrequency: number;
    waterFrequency: number;
    scheduleTime: number;
    duration: number;
}

export interface WeatherConfig {
    random: boolean;
    waterFrequency: number;
    sunFrequency: number;
    events: WeatherEventConfig[];
}

export interface PlantConfig {
    type: number;
    waterRequired: number;
    sunRequired: number;
    neighborsRequired: number;
    maxLevel: number;
}

export interface VictoryConditions {
    typeSpecific: Record<string, number>;
    overallHarvest: number;
}

export class InternalDSL {
  weather: WeatherConfig;
  plants: PlantConfig[];
  victoryConditions: VictoryConditions;

  constructor(
    weather: WeatherConfig,
    plants: PlantConfig[],
    victoryConditions: VictoryConditions
  ) {
    this.weather = weather;
    this.plants = plants;
    this.victoryConditions = victoryConditions;
  }

  static fromJSON(json: string): InternalDSL {
    const data = JSON.parse(json);
    return new InternalDSL(data.weather, data.plants, data.victoryConditions);
  }

  defineWeather(grid: Grid) {
    grid.chanceToGenWater = this.weather.waterFrequency;
    grid.chanceToGenSun = this.weather.sunFrequency;

    if (grid.events == null) {
        grid.events = this.weather.events;
    }
  }

  defineWeatherEvent(grid: Grid, config: WeatherEventConfig) {
    grid.chanceToGenWater = config.waterFrequency;
    grid.chanceToGenSun = config.sunFrequency;
  }

  /*definePlantType(config: PlantConfig): this {
    this.plants.push(config);
    return this;
  }*/

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

// Set up internal DSL
export const settings = InternalDSL.fromJSON(JSON.stringify(externalDSL));
console.log(settings)

console.log(settings);
