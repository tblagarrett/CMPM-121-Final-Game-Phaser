import { Scene } from "phaser";
import { width, height } from "../main";
import i18next from "../Internationalization";

interface EndSceneData {
  time_steps: number;
}

export class End extends Scene {
  constructor() {
    super("End");
  }

  create(data: EndSceneData): void {
    const { time_steps } = data;

    if (typeof width !== "number" || typeof height !== "number") {
      throw new Error("Width and height must be numbers");
    }

    // Adding overlay background
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 0.7);
    graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

    // You Won! text
    this.add
      .text(width / 2, height / 2 - height / 12, i18next.t("end.you-won"), {
        fontSize: "64px",
      })
      .setOrigin(0.5, 0.5);

    // Total time text
    this.add
      .text(
        width / 2,
        height / 2,
        `${i18next.t("end.total-time")} ${time_steps} ${i18next.t(
          "end.steps"
        )}`,
        {
          fontSize: "32px",
        }
      )
      .setOrigin(0.5, 0.5);

    // Replay button
    this.add
      .text(width / 2, height / 2 + height / 12, i18next.t("end.play-again"), {
        fontSize: "32px",
      })
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("Game"));

    // Alternative spacebar input
    this.input.keyboard?.on("keydown-SPACE", () => {
      this.scene.start("Game");
    });
  }
}
