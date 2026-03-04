import Phaser from 'phaser';

import { tilesets } from '../globals';

class LoaderScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;

  public constructor() {
    super({ key: 'loaderScene' });
  }

  public init() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Create the progress box and bar graphics
    this.progressBox = this.add.graphics();
    this.progressBar = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(centerX - 160, centerY - 25, 320, 50);

    // Draw a brand new progress bar listening to the 'progress' event to loading progress
    this.load.on('progress', (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0xffffff, 1);
      this.progressBar.fillRect(centerX - 150, centerY - 15, 300 * value, 30);
    });

    // Clean up graphics when loading is complete
    this.load.on('complete', () => {
      this.progressBar.destroy();
      this.progressBox.destroy();
    });
  }

  public preload() {
    // audio
    this.load.audio('buttonClick', 'assets/button-click.mp3');
    this.load.audio('buttonExit', 'assets/button-exit.mp3');

    // settings
    this.load.image('checked', 'assets/button-checked.png');
    this.load.image('empty', 'assets/button-empty.png');
    this.load.image('minus', 'assets/button-minus.png');
    this.load.image('plus', 'assets/button-plus.png');
    this.load.image('settings', 'assets/button-settings.png');
    this.load.image('news', 'assets/button-tips.png');
    this.load.spritesheet('volumeBar', 'assets/volume-bar.png', { frameWidth: 48, frameHeight: 16 });

    // tilesets
    tilesets.forEach((tilesetData) => {
      this.load.image(tilesetData.key, `assets/${tilesetData.tileset}.png`);
    });
  }

  public create() {
    this.scene.start('panelScene');
    this.scene.start('titleScene');
  }
}

export { LoaderScene };
