import Phaser from "phaser";
import { Plant } from "./Plant";
import { Cell } from "./Cell";
import Grid from "./Grid";
import { Game } from "../scenes/Game"; 

export interface PlantConfig {
    num: number;
    water: number; 
    sun: number; 
    neighbors: number;
    level: number;
}

export class InternalDSL {
    private plants: PlantConfig[];

    static create() {
        return new InternalDSL();
    }

    definePlantType(num: number, water: number, sun: number, neighbors: number, level: number): this {
        const config = {num, water, sun, neighbors, level};
        this.plants.push(config);
        return this;
    }

    getPlantType(type: number) {
        return this.plants[type];
    }

    getRandPlantType() {
        return this.plants[getRandomInt(this.plants.length)]
    }
    
    removePlantType(type: number) {
        return this.plants.splice(1, type);
    }
} 

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }