import { Plant } from "./Plant";
import { Cell } from "./Cell";
import Grid from "./Grid";
import { Position } from "./Player";

export class SaveState {
  private gridWidth: number;
  private gridHeight: number;
  private BYTES_PER_CELL: number;
  private BYTES_PER_ACTION: number;
  private gridSize: number;
  public buffer: ArrayBuffer | null;
  public dataView: DataView | null;

  constructor(gridWidth: number, gridHeight: number) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.BYTES_PER_CELL = 5 * Int32Array.BYTES_PER_ELEMENT; // 1 cell + 4 plant attributes
    this.BYTES_PER_ACTION = 2 * Int32Array.BYTES_PER_ELEMENT; // 2 integers per action (x, y)
    this.gridSize = gridWidth * gridHeight * this.BYTES_PER_CELL;
    this.buffer = null;
    this.dataView = null;
  }

  // Serialize grid data and player actions into the buffer
  save(grid: Grid, position: Position): ArrayBuffer {
    const totalSize = this.gridSize + this.BYTES_PER_ACTION; // Only one action (i, j)
    this.buffer = new ArrayBuffer(totalSize);
    this.dataView = new DataView(this.buffer);

    let offset = 0;

    // Serialize grid data
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        const cell: Cell = grid.getCell(x, y);

        // Write cell data
        this.dataView.setInt32(offset, cell.waterStored);
        offset += Int32Array.BYTES_PER_ELEMENT;

        if (cell.plant) {
          // Write plant data
          this.dataView.setInt32(offset, cell.plant.level);
          offset += Int32Array.BYTES_PER_ELEMENT;

          this.dataView.setInt32(offset, cell.plant.plant_type);
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

    // Serialize the single action
    this.dataView.setInt32(offset, position.i);
    offset += Int32Array.BYTES_PER_ELEMENT;
    this.dataView.setInt32(offset, position.j);
    offset += Int32Array.BYTES_PER_ELEMENT;

    return this.buffer;
  }

  // Deserialize buffer data back into the grid and player actions
  load(
    grid: Grid
  ): { grid: Grid; position: Position } | { grid: null; position: Position } {
    if (!this.buffer || !this.dataView)
      return { grid: null, position: { i: 0, j: 0 } };

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

        const plantType = this.dataView.getInt32(offset);
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

    return { grid, position };
  }
}

export default SaveState;
