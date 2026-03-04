import Phaser from 'phaser';

import { BasePanel, simpleButton, NineSlice, PaginatedText } from '@warpzone/game-utils';
import { chartManager, eventManager, panels, PhaserSound, styles } from '../globals';

class ChartPanel extends BasePanel {
  private buttonExit: PhaserSound;

  private closeX: number;
  private closeY: number;
  private openX: number;
  private openY: number;

  private inputBlocker: Phaser.GameObjects.Rectangle;
  private infoText?: PaginatedText;

  public constructor(scene: Phaser.Scene, infoText?: string) {
    super(scene, panels.common);

    this.buttonExit = this.scene.sound.add('buttonExit').setVolume(0.6);
    this.inputBlocker = this.createInputBlocker();

    this.openX = this.x;
    this.openY = this.y;
    this.closeX = this.x;
    this.closeY = this.scene.scale.height + 50;

    const background = new NineSlice(this.scene, this.width - 32, this.height - 32, 8, 'panelSecondary', 16);
    this.add([background, this.inputBlocker]);
    this.setVisible(false);

    if (infoText) {
      this.infoText = this.createInfoText(infoText);
    }

    eventManager.on('openChart', (key) => chartManager.openPanel(key));
  }

  public createChartTitle(x: number, y: number, text: string, position: 'left' | 'right' = 'left') {
    const originX = position === 'left' ? 0 : 1;
    const subTitle = this.scene.add.text(x, y, text, styles.panelDetail).setOrigin(originX, 0);

    this.add(subTitle);
    return subTitle;
  }

  public createExitButton(onClose?: () => void) {
    const x = this.width - 32;
    const y = 32;

    const closeButton = simpleButton(this.scene, {
      target: this.scene.add.image(x, y, 'buttonExit'),
      scale: 0.8,
      onComplete: onClose,
      onPointerdown: () => this.buttonExit.play(),
      onPointerup: () => chartManager.closePanel(),
    });

    this.add(closeButton);
    return closeButton;
  }

  public createInfoText(text: string) {
    const infoText = new PaginatedText(this.scene, {
      width: this.width - 26 * 2,
      height: 50,
      text,
      style: styles.infoText,
      x: 26,
      y: 234,
    });

    this.add(infoText);
    return infoText;
  }

  public createInputBlocker() {
    return this.scene.add
      .rectangle(this.width / 2, this.height / 2, this.width, this.height, 0xffffff, 0)
      .setInteractive()
      .setVisible(false);
  }

  public createTitle(text: string) {
    const x = this.width / 2;
    const y = 4;
    const title = this.scene.add.text(x, y, text, styles.title).setOrigin(0.5);
    const width = title.width + 32;
    const height = title.height + 32;
    const background = new NineSlice(this.scene, width, height, 8, 'panelTitle', x, y - 2).setOrigin(0.5);

    this.add([background, title]);
  }

  public open() {
    this.setVisible(true);
    this.setPosition(this.closeX, this.closeY);
    this.inputBlocker.setVisible(true);
    this.infoText?.animate();

    this.tween({
      duration: 0,
      ease: 'back.inOut',
      targets: this,
      x: this.openX,
      y: this.openY,
    });
  }

  public close() {
    this.inputBlocker.setVisible(false);
    this.infoText?.setVisible(false);

    this.tween({
      duration: 0,
      targets: this,
      ease: 'back.inOut',
      x: this.closeX,
      y: this.closeY,
      onComplete: () => this.setVisible(false),
    });
  }
}

export { ChartPanel };
