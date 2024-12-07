// import { Cell } from "./prefabs/Cell";
// import Grid from "./prefabs/Grid";
// import { SaveState } from "./prefabs/SaveState";
// import { Plant } from "./prefabs/Plant";
import { Game } from "./scenes/Game";
import { End } from "./scenes/End";
import { Preloader } from "./scenes/Preloader";

import { Types } from "phaser";

import {
  updateTranslations,
  addLanguageSwitcher,
} from "./Internationalization";
import i18next from "i18next";
import HttpBackend from "i18next-http-backend";

// Wait for i18next initialization before starting the game
i18next
  .use(HttpBackend)
  .init({
    lng: "en", // Default language
    fallbackLng: "en", // Default fallback language if the key is missing
    backend: {
      // loadPath: "/locales/{{lng}}.json",
      loadPath: (lng: any) => {
        const path = `/locales/${lng}.json`;
        console.log(`Loading translations from: ${path}`);
        return path;
      },
    },
    debug: true,
  })
  .then(() => {
    // `updateTranslations` will only run once i18next has fully initialized
    updateTranslations();
    addLanguageSwitcher();
  })
  .catch((err) => {
    console.error("Error during i18next initialization", err);
  });

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
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
