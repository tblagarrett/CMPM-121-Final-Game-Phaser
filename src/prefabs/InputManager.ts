type InputAction = () => void;

export class InputManager {
  private scene: Phaser.Scene;
  private bindings: { [key: string]: InputAction } = {};

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  // Register a key and its associated callback
  bindKey(key: string, action: InputAction): void {
    this.scene.input.keyboard?.on(`keydown-${key}`, action);
    this.bindings[key] = action;
  }

  // Clear all bindings
  clearBindings(): void {
    Object.keys(this.bindings).forEach((key) => {
      this.scene.input.keyboard?.off(`keydown-${key}`);
    });
    this.bindings = {};
  }
}
