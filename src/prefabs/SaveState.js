import { Plant } from "./Plant";

class SaveState {
  constructor(gridWidth, gridHeight) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.BYTES_PER_CELL = 5 * Int32Array.BYTES_PER_ELEMENT; // 1 cell + 4 plant attributes
    this.buffer = new ArrayBuffer(gridWidth * gridHeight * this.BYTES_PER_CELL);
    this.dataView = new DataView(this.buffer);
  }

  // Serialize grid data into the buffer
  saveGrid(grid) {
    let offset = 0;
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        const cell = grid.getCell(x, y);

        // Write cell data
        this.dataView.setInt32(offset, cell.waterStored);
        offset += Int32Array.BYTES_PER_ELEMENT;

        if (cell.plant) {
          // Write plant data
          this.dataView.setInt32(offset, cell.plant.level);
          offset += Int32Array.BYTES_PER_ELEMENT;

          this.dataView.setInt32(offset, cell.plant.type);
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
  }

  // Deserialize buffer data back into the grid
  loadGrid(grid) {
    let offset = 0;
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        const cell = grid.getCell(x, y);

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

        if (plantLevel !== -1) {
          // If plant data exists, we need to replace the existing plant (if any)
          if (cell.plant) {
            // Destroy the existing plant sprite
            cell.plant.destroy();
          }

          // Create a new plant with the loaded data
          const plant = new Plant(
            grid.scene,
            x * grid.cellSize + grid.cellSize / 2,
            y * grid.cellSize + grid.cellSize / 2,
            plantType
          );
          plant.level = plantLevel;
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
  }
}

export default SaveState;
