import Phaser from 'phaser';

import { checkOrientation } from '@warpzone/game-utils';
import { BootScene, LoaderScene, MainScene, PanelScene, TitleScene, TutorialScene, UiScene } from './scenes';

const game = new Phaser.Game({
  width: 640,
  height: 360,
  title: 'Hoopify City',
  type: Phaser.AUTO,
  backgroundColor: '#000000',
  pixelArt: true,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
    parent: 'game',
    zoom: 1 / window.devicePixelRatio,
  },
  scene: [BootScene, LoaderScene, MainScene, PanelScene, TitleScene, TutorialScene, UiScene],
});

window.addEventListener('load', () => checkOrientation(game, 'landscape'));
window.addEventListener('resize', () => checkOrientation(game, 'landscape'));

export default game;
