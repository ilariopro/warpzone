import Phaser from 'phaser';

import {
  BasePanel,
  simpleButton,
  InputBlocker,
  NineSlice,
  PaginatedText,
  animatedNumberUpdate,
} from '@warpzone/game-utils';
import { panels, panelManager, PhaserSound, styles } from '../globals';

class SlidePanel extends BasePanel {
  protected buttonClick: PhaserSound;
  protected buttonExit: PhaserSound;

  protected closeX: number;
  protected closeY: number;
  protected openX: number;
  protected openY: number;

  protected infoText?: PaginatedText;
  protected initialInfoText?: PaginatedText;

  protected selectedOption = '';

  public constructor(scene: Phaser.Scene, initialInfoText?: string) {
    super(scene, panels.common);

    this.buttonClick = this.scene.sound.add('buttonClick').setVolume(0.6);
    this.buttonExit = this.scene.sound.add('buttonExit').setVolume(0.6);

    this.openX = this.x;
    this.openY = this.y;
    this.closeX = this.x;
    this.closeY = this.scene.scale.height + 50;

    const background = [
      new NineSlice(this.scene, this.width, this.height, 15, 'panelPrimary'),
      new NineSlice(this.scene, this.width - 32, this.height - 32, 8, 'panelSecondary', 16),
    ];

    this.add(background);
    this.setVisible(false);

    if (initialInfoText) {
      this.initialInfoText = this.createInfoText(initialInfoText);
      this.infoText = this.initialInfoText;
    }
  }

  public open() {
    this.setVisible(true);
    this.setPosition(this.closeX, this.closeY);
    this.scene.time.delayedCall(100, () => this.scene.events.emit(InputBlocker.On));
    this.infoText?.animate();

    this.tween({
      duration: 300,
      ease: 'back.inOut',
      targets: this,
      x: this.openX,
      y: this.openY,
    });
  }

  public close() {
    this.scene.time.delayedCall(100, () => this.scene.events.emit(InputBlocker.Off));
    this.infoText?.setVisible(false);
    this.infoText = this.initialInfoText;

    this.tween({
      duration: 300,
      targets: this,
      ease: 'back.inOut',
      x: this.closeX,
      y: this.closeY,
      onComplete: () => this.setVisible(false),
    });
  }

  public createActionButton(x: number, y: number, label: string, onClick: () => void) {
    const container = this.scene.add.container(x, y);
    const background = this.scene.add.image(0, 0, 'buttonAction');
    const text = this.scene.add.text(0, 1, label, styles.panelButton).setOrigin(0.5);

    const actionButton = simpleButton(this.scene, {
      target: container.add([background, text]),
      scale: 0.88,
      sound: this.buttonClick,
      width: background.width,
      heigth: background.height,
      onPointerdown: () => onClick(),
    });

    return actionButton.setVisible(false);
  }

  public createDetails() {
    const details = new NineSlice(this.scene, 152, 168, 8, 'panelDetail', 288, 50);

    this.add(details);
    return details;
  }

  public createExitButton(onClose?: () => void) {
    const x = this.width - 32;
    const y = 32;
    const image = this.scene.add.image(x, y, 'buttonExit');
    const heigth = image.height + 10;
    const width = image.width + 10;

    const closeButton = simpleButton(this.scene, {
      target: image,
      scale: 0.8,
      heigth,
      width,
      onComplete: onClose,
      onPointerdown: () => this.buttonExit.play(),
      onPointerup: () => panelManager.closePanel(),
    });

    this.add(closeButton);
    return closeButton;
  }

  public createInfoText(text: string) {
    const infoText = new PaginatedText(this.scene, {
      width: 250,
      height: 46,
      text,
      style: styles.infoText,
      x: 26,
      y: 234,
    });

    this.add(infoText);
    return infoText;
  }

  public createMoneyIcon(x: number, y: number) {
    return this.scene.add.image(x, y, 'moneySmall');
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

  public createText(
    x: number,
    y: number,
    text: string,
    align: 'left' | 'right' = 'left',
    style?: Partial<Phaser.GameObjects.TextStyle>
  ) {
    const originX = align === 'left' ? 0 : 1;
    return this.scene.add.text(x, y, text, style ?? styles.panelDetail).setOrigin(originX, 0);
  }

  public updateCounter(
    target: Phaser.GameObjects.Text,
    from: number | string,
    to: number | string,
    decimals = 0,
    onComplete?: () => void
  ) {
    animatedNumberUpdate(this.scene, {
      decimals,
      target,
      from: Number(from),
      to: Number(to),
      onComplete,
    });
  }

  public setInfoText(infoText?: PaginatedText) {
    this.initialInfoText?.setVisible(false);
    this.infoText?.setVisible(false);
    this.infoText = infoText;
    this.infoText?.setVisible(true);
  }
}

export { SlidePanel };
