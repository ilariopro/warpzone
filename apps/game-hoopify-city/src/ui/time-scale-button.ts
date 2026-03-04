import Phaser from 'phaser';

import { styles } from '../globals';

class TimeScaleButton extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Image;
  private text: Phaser.GameObjects.Text;

  private openX = 596;
  private openY = 220;

  private closeX = 696;
  private closeY = 220;

  private timeScale = 1;

  public constructor(scene: Phaser.Scene) {
    super(scene);
    this.scene.add.existing(this);

    this.text = this.scene.add.text(0, 1, `x ${this.timeScale}`, styles.infoText).setOrigin(1, 0.5);
    this.background = this.scene.add.image(0, 0, 'buttonTimeScale');

    this.x = this.closeX;
    this.y = this.closeY;
    this.width = this.text.width + 20;
    this.height = this.text.height + 20;

    this.add([this.background, this.text]).setSize(this.width, this.height);
  }

  public changeTimeScale() {
    this.timeScale = this.timeScale < 3 ? this.timeScale + 1 : 1;
    this.text.setText(`x ${this.timeScale}`);
  }

  public getTimeScale() {
    return this.timeScale;
  }

  public show() {
    this.resetTimeScale();

    this.scene.tweens.add({
      targets: this,
      duration: 200,
      ease: 'back.inOut',
      x: this.openX,
      y: this.openY,
    });
  }

  public hide() {
    this.scene.tweens.add({
      targets: this,
      duration: 200,
      ease: 'back.inOut',
      x: this.closeX,
      y: this.closeY,
    });
  }

  private resetTimeScale() {
    this.timeScale = 1;
    this.text.setText(`x ${this.timeScale}`);
  }
}

export { TimeScaleButton };
