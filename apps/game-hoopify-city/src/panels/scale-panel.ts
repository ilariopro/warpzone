import Phaser from 'phaser';

import { BasePanel, BasePanelConfig, NineSlice, simpleButton } from '@warpzone/game-utils';
import { eventManager, PhaserSound, styles } from '../globals';

class ScalePanel extends BasePanel {
  protected buttonClick: PhaserSound;
  protected textStyle = styles.title;

  public constructor(scene: Phaser.Scene, config: BasePanelConfig) {
    super(scene, config);

    this.buttonClick = this.scene.sound.add('buttonClick').setVolume(0.6);

    const background = [
      new NineSlice(this.scene, this.width, this.height, 15, 'panelPrimary'),
      new NineSlice(this.scene, this.width - 32, this.height - 32, 8, 'panelSecondary', 16),
    ];

    this.add(background);
    this.setVisible(false);
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
      duration: 300,
      ease: 'Power2',
      targets: this,
      scaleY: 0,
      onComplete: () => this.setVisible(false),
    });
  }

  createButton(x: number, y: number, text: string, eventKey: string) {
    const textObject = this.scene.add.text(0, 0, text, this.textStyle).setOrigin(0.5);
    const width = Math.max(textObject.width + 16, 140);
    const heigth = textObject.height + 16;
    const background = this.scene.add.rectangle(0, 0, width, heigth, 0xffffff, 0);
    const container = this.scene.add.container(x, y).add([background, textObject]);

    return simpleButton(this.scene, {
      sound: this.buttonClick,
      target: container,
      heigth,
      width,
      onPointerdown: () => {
        eventManager.emit('openPanel', eventKey);
        eventManager.emit('buttonPressed', eventKey);
      },
    });
  }
}

export { ScalePanel };
