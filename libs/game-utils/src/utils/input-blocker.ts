import Phaser from 'phaser';

class InputBlocker {
  public static readonly On = 'inputBlockerOn';
  public static readonly Off = 'inputBlockerOff';

  private visible = false;

  public constructor(scene: Phaser.Scene, alpha = 0.4, color = 0x000000) {
    const { width, height } = scene.cameras.main;

    const inputBlocker = scene.add
      .rectangle(width / 2, height / 2, width, height, color, alpha)
      .setVisible(this.visible);

    scene.events.on(InputBlocker.On, () => {
      inputBlocker.setInteractive();
      inputBlocker.setVisible((this.visible = true));
    });

    scene.events.on(InputBlocker.Off, () => {
      inputBlocker.disableInteractive();
      inputBlocker.setVisible((this.visible = false));
    });
  }

  public isVisible() {
    return this.visible;
  }
}

export { InputBlocker };
