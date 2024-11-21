//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
  type: Phaser.AUTO,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  width: 820,
  height: 820,
  zoom: 0.75,
  render: {
    pixelArt: true,
  },
  scene: [Preloader, Game],
};

const game = new Phaser.Game(config);

const { width, height } = game.config;
