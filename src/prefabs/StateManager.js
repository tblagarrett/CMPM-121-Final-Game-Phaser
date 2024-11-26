import SaveState from "./SaveState.js";

class StateManager {
  constructor(gridWidth, gridHeight) {
    this.bufferArray = [];
    this.currentStateIndex = -1;
    this.saveState = new SaveState(gridWidth, gridHeight);
  }

  // Convert ArrayBuffer to Base64 string
  arrayBufferToBase64(buffer) {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return btoa(binary);
  }

  // Convert Base64 string to ArrayBuffer
  base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const length = binary.length;
    const buffer = new ArrayBuffer(length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < length; i++) {
      view[i] = binary.charCodeAt(i);
    }
    return buffer;
  }

  // Save buffer array to localStorage
  saveToLocalStorage() {
    const serializedBuffers = this.bufferArray.map((buf) =>
      this.arrayBufferToBase64(buf)
    );
    localStorage.setItem("save", JSON.stringify(serializedBuffers));
  }

  // Load buffer array from localStorage
  loadFromLocalStorage() {
    const serializedBuffers = JSON.parse(localStorage.getItem("save"));
    if (!serializedBuffers) {
      console.log("No saved game state found!");
      return;
    }
    this.bufferArray = serializedBuffers.map((base64) =>
      this.base64ToArrayBuffer(base64)
    );
    this.currentStateIndex = this.bufferArray.length - 1;
  }

  // Add buffer to the array and save to localStorage
  addBuffer(buffer) {
    // If we are not at the end of the buffer array, remove all future states
    if (this.currentStateIndex < this.bufferArray.length - 1) {
      this.bufferArray = this.bufferArray.slice(0, this.currentStateIndex + 1);
    }
    this.bufferArray.push(buffer);
    this.currentStateIndex++;
    this.saveToLocalStorage();
  }

  // Get the last buffer from the array
  getLastBuffer() {
    if (this.bufferArray.length === 0) {
      console.log("No buffers available!");
      return null;
    }
    return this.bufferArray[this.currentStateIndex];
  }

  // Save the game state
  saveGameState(grid, actions) {
    const buffer = this.saveState.save(grid, actions);
    this.addBuffer(buffer);
    console.log("Game state saved!");
  }

  // Load the game state
  loadGameState(grid) {
    this.loadFromLocalStorage();
    const lastBuffer = this.getLastBuffer();
    if (!lastBuffer) return { grid: null, actions: [] };

    this.saveState.buffer = lastBuffer;
    this.saveState.dataView = new DataView(lastBuffer);

    // Ensure the grid is properly initialized
    if (!grid) {
      console.error("Grid is not initialized");
      return { grid: null, actions: [] };
    }

    // Deserialize the game state
    return this.saveState.load(grid);
  }

  // Undo the last action
  undo(grid) {
    if (this.currentStateIndex > 0) {
      this.currentStateIndex--;
      const buffer = this.getLastBuffer();
      this.saveState.buffer = buffer;
      this.saveState.dataView = new DataView(buffer);
      return this.saveState.load(grid);
    } else {
      console.log("No more states to undo!");
      return { grid: null, actions: [] };
    }
  }

  // Redo the next action
  redo(grid) {
    if (this.currentStateIndex < this.bufferArray.length - 1) {
      this.currentStateIndex++;
      const buffer = this.getLastBuffer();
      this.saveState.buffer = buffer;
      this.saveState.dataView = new DataView(buffer);
      return this.saveState.load(grid);
    } else {
      console.log("No more states to redo!");
      return { grid: null, actions: [] };
    }
  }
}

export default StateManager;
