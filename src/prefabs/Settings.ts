import fs from "fs";
import { InternalDSL } from "./InternalDSL";

export interface WeatherEventConfig {
  name: string;
  description: string;
  sunFrequency: number;
  waterFrequency: number;
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

class Settings {
  weather: WeatherConfig;
  plants: PlantConfig[];
  victoryConditions: VictoryConditions;
  InternalDSL: InternalDSL;

  constructor(
    weather: WeatherConfig,
    plants: PlantConfig[],
    victoryConditions: VictoryConditions
  ) {
    this.weather = weather;
    this.plants = plants;
    this.victoryConditions = victoryConditions;
    this.InternalDSL = InternalDSL.create();
    this.plants.forEach((plant) => this.InternalDSL.definePlantType(plant))
  }

  static fromJSON(json: string): Settings {
    const data = JSON.parse(json);
    return new Settings(data.weather, data.plants, data.victoryConditions);
  }
}

// example on how to use:
const json = fs.readFileSync("~/externalDSL.json", "utf8");
export const settings = Settings.fromJSON(json);

console.log(settings);
