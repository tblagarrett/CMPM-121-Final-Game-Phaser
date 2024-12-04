import fs from "fs";

interface WeatherEvent {
  name: string;
  description: string;
  sunFrequency: number;
  waterFrequency: number;
}

interface Weather {
  random: boolean;
  waterFrequency: number;
  sunFrequency: number;
  events: WeatherEvent[];
}

interface Plant {
  type: number;
  waterRequired: number;
  sunRequired: number;
  neighborsRequired: number;
}

interface VictoryConditions {
  typeSpecific: Record<string, number>;
  overallHarvest: number;
}

class Settings {
  weather: Weather;
  plants: Plant[];
  victoryConditions: VictoryConditions;

  constructor(
    weather: Weather,
    plants: Plant[],
    victoryConditions: VictoryConditions
  ) {
    this.weather = weather;
    this.plants = plants;
    this.victoryConditions = victoryConditions;
  }

  static fromJSON(json: string): Settings {
    const data = JSON.parse(json);
    return new Settings(data.weather, data.plants, data.victoryConditions);
  }
}

// example on how to use:
const json = fs.readFileSync("~/externalDSL.json", "utf8");
const settings = Settings.fromJSON(json);

console.log(settings);
