import { Plant, PlantMemento } from "./Plant";
import { Cell } from "./Cell";
import Grid from "./Grid";
import { Position } from "./Player";

export interface SaveSession {
  grid: Grid;
  position: Position;
  time: number;
}

export class SaveState {
  private gridWidth: number;
  private gridHeight: number;
  private BYTES_PER_CELL: number;
  private BYTES_POSITION: number;
  private BYTES_TIME: number;
  private gridSize: number;
  public buffer: ArrayBuffer | null;
  public dataView: DataView | null;

  constructor(gridWidth: number, gridHeight: number) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.BYTES_PER_CELL = 5 * Int32Array.BYTES_PER_ELEMENT; // 1 cell + 4 plant attributes
    this.BYTES_POSITION = 2 * Int32Array.BYTES_PER_ELEMENT; // 2 integers per position (x, y)
    this.BYTES_TIME = Int32Array.BYTES_PER_ELEMENT; // 1 integer for time step
    this.gridSize = gridWidth * gridHeight * this.BYTES_PER_CELL;
    this.buffer = null;
    this.dataView = null;
  }

  // Serialize grid data and player positions into the buffer
  save(saveSession: SaveSession): ArrayBuffer {
    const totalSize = this.gridSize + this.BYTES_POSITION + this.BYTES_TIME; // {i, j} player position + time (steps)
    this.buffer = new ArrayBuffer(totalSize);
    this.dataView = new DataView(this.buffer);

    let offset = 0;

    // Serialize grid data
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        const cell: Cell = saveSession.grid.getCell(x, y);

        // Write cell data
        this.dataView.setInt32(offset, cell.waterStored);
        offset += Int32Array.BYTES_PER_ELEMENT;

        if (cell.plant) {
          // Write plant data
          this.dataView.setInt32(offset, cell.plant.level);
          offset += Int32Array.BYTES_PER_ELEMENT;

          this.dataView.setInt32(
            offset,
            PlantMemento.encode(cell.plant.config)
          );
          offset += Int32Array.BYTES_PER_ELEMENT;

          this.dataView.setInt32(offset, cell.plant.waterStored);
          offset += Int32Array.BYTES_PER_ELEMENT;

          this.dataView.setInt32(offset, cell.plant.sunStored);
          offset += Int32Array.BYTES_PER_ELEMENT;
        } else {
          // Write empty plant data as -1
          for (let i = 0; i < 4; i++) {
            this.dataView.setInt32(offset, -1);
            offset += Int32Array.BYTES_PER_ELEMENT;
          }
        }
      }
    }

    // Serialize the single position
    this.dataView.setInt32(offset, saveSession.position.i);
    offset += Int32Array.BYTES_PER_ELEMENT;
    this.dataView.setInt32(offset, saveSession.position.j);
    offset += Int32Array.BYTES_PER_ELEMENT;

    // Serialize time
    this.dataView.setInt32(offset, saveSession.time);
    offset += Int32Array.BYTES_PER_ELEMENT;

    return this.buffer;
  }

  // Deserialize buffer data back into the grid and player position
  load(grid: Grid): SaveSession | undefined {
    // if buffer doesn't exist return undefined
    if (!this.buffer || !this.dataView) return;

    let offset = 0;

    // Deserialize grid data
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        const cell: Cell = grid.getCell(x, y);

        // Read cell data (water stored)
        cell.waterStored = this.dataView.getInt32(offset);
        offset += Int32Array.BYTES_PER_ELEMENT;

        // Read plant data
        const plantLevel = this.dataView.getInt32(offset);
        offset += Int32Array.BYTES_PER_ELEMENT;

        const plantType = PlantMemento.decode(this.dataView.getInt32(offset));
        offset += Int32Array.BYTES_PER_ELEMENT;

        const plantWaterStored = this.dataView.getInt32(offset);
        offset += Int32Array.BYTES_PER_ELEMENT;

        const plantSunStored = this.dataView.getInt32(offset);
        offset += Int32Array.BYTES_PER_ELEMENT;

        if (cell.plant) {
          // Destroy the existing plant sprite
          cell.plant.destroy();
        }
        if (plantLevel !== -1) {
          // If plant data exists, create a new plant
          const plant = new Plant(
            grid.scene,
            x * grid.cellSize + grid.cellSize / 2,
            y * grid.cellSize + grid.cellSize / 2,
            plantType,
            plantLevel
          );
          plant.waterStored = plantWaterStored;
          plant.sunStored = plantSunStored;

          // Assign the plant to the cell
          cell.plant = plant;
        } else {
          // If no plant data, clear the plant
          cell.plant = null;
        }

        // Update the cell's visual indicators
        cell.updateIndicators();
      }
    }

    // Deserialize the single action
    const position: Position = {
      i: this.dataView.getInt32(offset),
      j: this.dataView.getInt32(offset + Int32Array.BYTES_PER_ELEMENT),
    };

    // Deserialize time
    offset += this.BYTES_POSITION;
    const time: number = this.dataView.getInt32(offset);

    return { grid, position, time };
  }
}

export default SaveState;
