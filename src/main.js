import { Cell } from "./prefabs/Cell";
import { Grid } from "./prefabs/Grid";
import { SaveState } from "./prefabs/SaveState.js";
import { Plant } from "./prefabs/Plant";
import { Game } from "./scenes/Game";
import { End } from "./scenes/End";
import { Preloader } from "./scenes/Preloader";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  render: {
    pixelArt: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  parent: "game-container",
  backgroundColor: "#028af8",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Preloader, Game, End],
};

export default new Phaser.Game(config);

export const { width, height } = config;
