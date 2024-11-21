export class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, gridSizeX, gridSizeY) {
    super(scene, x, y, texture);
    this.scene.add.existing(this);
    this.actions = [];
    const GRIDX = gridSizeX;
    const GRIDY = gridSizeY;
    this.gameWidth = this.scene.sys.game.config.width;
    this.gameHeight = this.scene.sys.game.config.height;

    // Add event listeners for key inputs
    this.scene.input.keyboard.on("keydown-LEFT", () => this.move(-GRIDX, 0));
    this.scene.input.keyboard.on("keydown-RIGHT", () => this.move(GRIDX, 0));
    this.scene.input.keyboard.on("keydown-UP", () => this.move(0, -GRIDY));
    this.scene.input.keyboard.on("keydown-DOWN", () => this.move(0, GRIDY));
  }

  move(x, y) {
    // checks if outside of game bounds
    if (this.x + x < 0 || this.x + x > this.gameWidth) {
      return;
    }
    if (this.y + y < 0 || this.y + y > this.gameHeight) {
      return;
    }
    this.x += x;
    this.y += y;
    this.actions.push({ x: this.x, y: this.y });
  }

  position() {
    return { x: this.x, y: this.y };
  }
}
