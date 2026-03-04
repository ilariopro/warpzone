import Phaser from 'phaser';

import { BasePanel, NineSlice } from '@warpzone/game-utils';
import { styles } from '../globals';

class TitlePanel extends BasePanel {
  public constructor(scene: Phaser.Scene, title: string, icon?: string) {
    const text = scene.add.text(0, 0, title, styles.label).setOrigin(0.5);
    const image = icon ? scene.add.image(0, 0, icon).setOrigin(0.5) : null;

    super(scene, {
      width: text.width + (image ? image.width + 10 : 0),
      height: text.height,
      x: scene.scale.width / 2,
      y: 32,
    });

    const width = this.width + 20;
    const height = this.height + 20;
    const background = new NineSlice(this.scene, width, height, 8, 'panelTitle').setOrigin(0.5);

    this.add([background, text]);
    this.setVisible(false);

    if (image) {
      image.setX(-this.width / 2 + image.width / 2 + 2);
      text.setX(image.x + image.width / 2 + text.width / 2 + 6);
      this.add(image);
    }
  }

  public open() {
    this.setScale(1, 0);
    this.setVisible(true);

    this.tween({
      duration: 500,
      ease: 'Power2',
      targets: this,
      scaleY: 1,
    });
  }

  public close() {
    this.tween({
      duration: 500,
      ease: 'Power2',
      targets: this,
      scaleY: 0,
    });
  }
}

export { TitlePanel };
