import Phaser from 'phaser';

import { BasePanel, colorChangingText, NineSlice } from '@warpzone/game-utils';
import { panels, styles } from '../../globals';

const gameOverText =
  'You\'ve run out of cash, and your Hula Hoop empire has spun into bankruptcy. \
But don\'t feel down, every successful entrepreneur has faced setbacks! Learn from it and try again!\n\n\
"Success is not final, failure is not fatal: it is the courage to continue that counts" \n\
Winston Churchill\
';

class GameOverPanel extends BasePanel {
  private closeX: number;
  private closeY: number;
  private openX: number;
  private openY: number;

  public constructor(scene: Phaser.Scene) {
    super(scene, { ...panels.gameTitle, height: 330 });

    this.openX = this.x;
    this.openY = this.y;
    this.closeX = this.x;
    this.closeY = this.scene.scale.height + 50;

    const style = { ...styles.text, wordWrap: { width: 420 } };
    const panel = new NineSlice(this.scene, this.width, this.height, 15, 'panelTitle');
    const titleFxConfig = { ...styles.gameTitle, color: '#aaaaaa' };
    const title = scene.add.text(230, 45, 'Game Over', styles.gameTitle).setOrigin(0.5).setVisible(false);
    const titleFx = scene.add.text(title.x + 1, title.y + 2, title.text, titleFxConfig).setOrigin(0.5);
    const description = scene.add.text(230, 180, gameOverText, style).setOrigin(0.5);

    colorChangingText(this.scene, {
      colors: [0xffffff, 0x999999, 0xb7a189],
      text: titleFx,
    });

    this.add([panel, titleFx, title, description]);
    this.setVisible(false);
    title.setVisible(true);
  }

  public open() {
    this.setVisible(true);
    this.setPosition(this.closeX, this.closeY);

    this.tween({
      duration: 500,
      ease: 'back.inOut',
      targets: this,
      x: this.openX,
      y: this.openY,
    });
  }

  public close() {
    this.tween({
      duration: 300,
      targets: this,
      ease: 'back.inOut',
      x: this.closeX,
      y: this.closeY,
    });
  }
}

export { GameOverPanel };
