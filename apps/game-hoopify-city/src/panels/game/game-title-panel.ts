import Phaser from 'phaser';

import { BasePanel, colorChangingText, NineSlice } from '@warpzone/game-utils';
import { panels, styles } from '../../globals';

class GameTitlePanel extends BasePanel {
  private closeX: number;
  private closeY: number;
  private openX: number;
  private openY: number;

  public constructor(scene: Phaser.Scene) {
    super(scene, panels.gameTitle);

    this.openX = this.x;
    this.openY = this.y;
    this.closeX = this.x;
    this.closeY = this.scene.scale.height + 50;

    const panel = new NineSlice(this.scene, this.width, this.height, 15, 'panelTitle');
    const titleFxConfig = { ...styles.gameTitle, color: '#aaaaaa' };
    const title = scene.add.text(230, 70, 'Hoopify City', styles.gameTitle).setOrigin(0.5).setVisible(false);
    const titleFx = scene.add.text(title.x + 1, title.y + 2, title.text, titleFxConfig).setOrigin(0.5);

    colorChangingText(this.scene, {
      colors: [0xffffff, 0x999999, 0xb7a189],
      text: titleFx,
    });

    this.add([panel, titleFx, title]);
    title.setVisible(true);
  }

  public open() {
    this.setVisible(true);
    this.setPosition(this.closeX, this.closeY);

    this.tween({
      duration: 400,
      ease: 'back.inOut',
      targets: this,
      x: this.openX,
      y: this.openY,
    });
  }

  public close() {
    this.tween({
      duration: 280,
      targets: this,
      ease: 'back.inOut',
      x: this.closeX,
      y: this.closeY,
    });
  }
}

export { GameTitlePanel };
