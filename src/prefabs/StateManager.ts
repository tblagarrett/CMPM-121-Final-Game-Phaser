import SaveState from "./SaveState";

class StateManager {
  private bufferArray: ArrayBuffer[] = [];
  private currentStateIndex: number = -1;
  private saveState: SaveState;

  constructor(gridWidth: number, gridHeight: number) {
    this.saveState = new SaveState(gridWidth, gridHeight);
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const length = binary.length;
    const buffer = new ArrayBuffer(length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < length; i++) {
      view[i] = binary.charCodeAt(i);
    }
    return buffer;
  }

  saveToLocalStorage(slot: string = "save1"): void {
    const serializedBuffers = this.bufferArray.map((buf) =>
      this.arrayBufferToBase64(buf)
    );
    localStorage.setItem(slot, JSON.stringify(serializedBuffers));
  }

  loadFromLocalStorage(slot: string = "save1"): void {
    const serializedBuffers = JSON.parse(localStorage.getItem(slot) || "null");
    if (!serializedBuffers) {
      console.log(`No saved game state found in slot ${slot}!`);
      return;
    }
    this.bufferArray = serializedBuffers.map((base64: string) =>
      this.base64ToArrayBuffer(base64)
    );
    this.currentStateIndex = this.bufferArray.length - 1;
  }

  addBuffer(buffer: ArrayBuffer, slot: string = "save1"): void {
    if (this.currentStateIndex < this.bufferArray.length - 1) {
      this.bufferArray = this.bufferArray.slice(0, this.currentStateIndex + 1);
    }
    this.bufferArray.push(buffer);
    this.currentStateIndex = this.bufferArray.length - 1;
    this.saveToLocalStorage(slot);
  }

  getLastBuffer(): ArrayBuffer | null {
    if (this.bufferArray.length === 0) {
      console.log("No buffers available!");
      return null;
    }
    return this.bufferArray[this.currentStateIndex];
  }

  saveGameState(grid: any, actions: any[], slot: string = "save1"): void {
    const buffer = this.saveState.save(grid, actions);
    this.addBuffer(buffer, slot);
  }

  loadGameState(
    grid: any,
    slot: string = "save1"
  ): { grid: any; actions: any[] } {
    this.loadFromLocalStorage(slot);
    const lastBuffer = this.getLastBuffer();
    if (!lastBuffer) return { grid: null, actions: [] };

    this.saveState.buffer = lastBuffer;
    this.saveState.dataView = new DataView(lastBuffer);

    if (!grid) {
      console.error("Grid is not initialized");
      return { grid: null, actions: [] };
    }

    return this.saveState.load(grid);
  }

  undo(grid: any): { grid: any; actions: any[] } {
    if (this.currentStateIndex > 0) {
      this.currentStateIndex--;
      const buffer = this.getLastBuffer();
      this.saveState.buffer = buffer!;
      this.saveState.dataView = new DataView(buffer!);
      return this.saveState.load(grid);
    } else {
      console.log("No more states to undo!");
      return { grid: null, actions: [] };
    }
  }

  redo(grid: any): { grid: any; actions: any[] } {
    if (this.currentStateIndex < this.bufferArray.length - 1) {
      this.currentStateIndex++;
      const buffer = this.getLastBuffer()!;
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
