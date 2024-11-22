import { Scene } from "phaser";

export class End extends Scene {
  constructor() {
    super("End");
    console.log("constructing");
  }
  create() {
    // adding overlay background
    this.add.graphics().fillStyle(0x000000, 0.5);

    this.text = this.add.text("You Won!");
  }
}
