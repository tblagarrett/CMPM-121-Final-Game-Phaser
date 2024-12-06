import { SaveSession, SaveState } from "./SaveState";

// Used to convert binary into string for storing into localstorage
class BufferManager {
  static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return btoa(binary);
  }
  static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const length = binary.length;
    const buffer = new ArrayBuffer(length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < length; i++) {
      view[i] = binary.charCodeAt(i);
    }
    return buffer;
  }
}

export class StateManager {
  private bufferArray: ArrayBuffer[] = [];
  private currentStateIndex: number = -Infinity;
  private saveState: SaveState;
  private currentSlot: string = "save1"; // Track the current slot

  constructor(gridWidth: number, gridHeight: number) {
    this.saveState = new SaveState(gridWidth, gridHeight);
  }

  saveToLocalStorage(slot: string = "save1"): void {
    const serializedBuffers = this.bufferArray.map((buf) =>
      BufferManager.arrayBufferToBase64(buf)
    );
    localStorage.setItem(slot, JSON.stringify(serializedBuffers));
  }

  loadFromLocalStorage(slot: string = "save1"): void {
    if (slot !== this.currentSlot) {
      // Clear bufferArray and reset currentStateIndex when switching slots
      this.bufferArray = [];
      this.currentStateIndex = -1;
      this.currentSlot = slot;
    }

    const serializedBuffers = JSON.parse(localStorage.getItem(slot) || "null");
    if (!serializedBuffers) {
      console.log(`No saved game state found in slot ${slot}!`);
      return;
    }
    this.bufferArray = serializedBuffers.map((base64: string) =>
      BufferManager.base64ToArrayBuffer(base64)
    );
    this.currentStateIndex = Math.max(this.bufferArray.length - 1, 0);
  }

  addBuffer(buffer: ArrayBuffer, slot: string = "save1"): void {
    // resets redo/undo state if moving after undoing
    if (this.currentStateIndex < this.bufferArray.length - 1) {
      this.bufferArray = this.bufferArray.slice(0, this.currentStateIndex);
    }
    this.bufferArray.push(buffer);
    this.currentStateIndex = this.bufferArray.length;
    this.saveToLocalStorage(slot);
  }

  getLastBuffer(): ArrayBuffer | undefined {
    if (this.bufferArray.length === 0) {
      console.log("No buffers available!");
      return;
    }
    return this.bufferArray[this.currentStateIndex];
  }

  saveGameState(saveSession: SaveSession, slot: string = "save1"): void {
    const buffer = this.saveState.save(saveSession);
    this.addBuffer(buffer, slot);
  }

  loadGameState(grid: any, slot: string = "save1"): SaveSession | undefined {
    this.loadFromLocalStorage(slot);
    const lastBuffer = this.getLastBuffer();
    if (!lastBuffer) return undefined;

    this.saveState.buffer = lastBuffer;
    this.saveState.dataView = new DataView(lastBuffer);

    return this.saveState.load(grid);
  }

  undo(grid: any): SaveSession | undefined {
    return this.moveState(-1, grid); // Go back one state
  }

  redo(grid: any): SaveSession | undefined {
    return this.moveState(1, grid); // Go forward one state
  }

  private moveState(step: number, grid: any): SaveSession | undefined {
    const newIndex = this.currentStateIndex + step;

    // Handle out-of-bound scenarios
    if (newIndex < 0 || newIndex >= this.bufferArray.length) {
      console.log(
        step > 0 ? "No more states to redo!" : "No more states to undo!"
      );
      return undefined;
    }

    // Update currentStateIndex
    this.currentStateIndex = newIndex;

    // Load the new state
    const buffer = this.getLastBuffer();
    if (!buffer) return undefined;

    this.saveState.buffer = buffer;
    this.saveState.dataView = new DataView(buffer);
    return this.saveState.load(grid);
  }
}

export default StateManager;
