import { Plant } from "./Plant";

class SaveState {
  constructor(gridWidth, gridHeight) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.BYTES_PER_CELL = 5 * Int32Array.BYTES_PER_ELEMENT; // 1 cell + 4 plant attributes
    this.BYTES_PER_ACTION = 2 * Int32Array.BYTES_PER_ELEMENT; // 2 integers per action (x, y)
    this.gridSize = gridWidth * gridHeight * this.BYTES_PER_CELL;
    this.buffer = null;
    this.dataView = null;
  }

  // Serialize grid data and player actions into the buffer
  save(grid, actions) {
    const actionsLength = actions.length;
    const totalSize =
      this.gridSize +
      Int32Array.BYTES_PER_ELEMENT +
      actionsLength * this.BYTES_PER_ACTION;
    this.buffer = new ArrayBuffer(totalSize);
    this.dataView = new DataView(this.buffer);

    let offset = 0;

    // Serialize grid data
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

    // Serialize player actions
    this.dataView.setInt32(offset, actionsLength);
    offset += Int32Array.BYTES_PER_ELEMENT;

    for (let action of actions) {
      this.dataView.setInt32(offset, action.i);
      offset += Int32Array.BYTES_PER_ELEMENT;
      this.dataView.setInt32(offset, action.j);
      offset += Int32Array.BYTES_PER_ELEMENT;
    }

    return this.buffer;
  }

  // Deserialize buffer data back into the grid and player actions
  load(grid) {
    if (!this.buffer) return { grid: null, actions: [] };

    let offset = 0;

    // Deserialize grid data
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        //console.log(offset, this.buffer.byteLength);
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

        if (plantLevel != -1) {
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

    // Deserialize player actions
    const actionsLength = this.dataView.getInt32(offset);
    offset += Int32Array.BYTES_PER_ELEMENT;
    const actions = [];
    for (let i = 0; i < actionsLength; i++) {
      const action = {
        i: this.dataView.getInt32(offset),
        j: this.dataView.getInt32(offset + Int32Array.BYTES_PER_ELEMENT),
      };
      actions.push(action);
      offset += this.BYTES_PER_ACTION;
    }

    return { grid, actions };
  }
}

export default SaveState;
