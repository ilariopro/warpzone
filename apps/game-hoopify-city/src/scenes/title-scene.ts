import Phaser from 'phaser';

import { blinkingText, lockOrientation } from '@warpzone/game-utils';
import { gameState, panelManager, styles } from '../globals';

class TitleScene extends Phaser.Scene {
  private background!: Phaser.GameObjects.TileSprite;
  private startText!: Phaser.GameObjects.Text;

  public constructor() {
    super({ key: 'titleScene' });
  }

  public preload() {
    this.load.audio('startGame', 'assets/start-game.mp3');

    // this.load.image('background', 'assets/background-37.png');
    this.load.image('background', 'assets/background-52.png');
  }

  public init() {
    this.sound.volume = gameState.settings.soundVolume;

    if (!this.sys.game.device.os.desktop && !this.scale.isFullscreen) {
      this.input.on('pointerup', () => {
        if (panelManager.getCurrentKey() !== 'settings') {
          this.scale.startFullscreen();
          lockOrientation('landscape');
        }
      });
    }
  }

  public create() {
    const sound = this.sound.add('startGame').setVolume(0.6);

    this.background = this.add
      .tileSprite(0, 0, this.scale.width, this.scale.height, 'background')
      .setOrigin(0, 0);

    this.time.delayedCall(100, () => {
      panelManager.openPanel('gameTitle');
      this.createStartText();
    });

    this.input.on('pointerdown', () => {
      if (!panelManager.isTweening()) {
        panelManager.deletePanel('gameTitle');
        sound.play();

        this.startText.destroy();
        this.startGame();
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(_time: number, _delta: number) {
    this.background.tilePositionX += 0.3;
    this.background.tilePositionY += 0.3;

    if (panelManager.getCurrentKey() === null && panelManager.hasPanel('gameTitle')) {
      panelManager.openPanel('gameTitle');
    }
  }

  private createStartText() {
    if (this.startText) {
      this.startText?.destroy();
    }

    this.startText = this.add
      .text(320, 240, 'CLICK TO START', { ...styles.title, fontSize: '2em' })
      .setOrigin(0.5)
      .setVisible(false);

    this.time.delayedCall(200, () => blinkingText(this, this.startText), [], this);
  }

  private startGame() {
    this.time.delayedCall(200, () => {
      this.scene.start('mainScene');
      this.scene.start('tutorialScene');
      this.scene.start('uiScene');
    });
  }
}

export { TitleScene };
