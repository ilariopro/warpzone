import Phaser from 'phaser';

class SpotlightOverlay {
  private scene: Phaser.Scene;
  private overlay: Phaser.GameObjects.Graphics;
  private circleMask: Phaser.GameObjects.Graphics;
  private mask: Phaser.Display.Masks.BitmapMask;
  private target: Phaser.GameObjects.Image | null = null;
  private radius = 50;
  private enabled = false;

  public constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.overlay = this.scene.add.graphics();
    this.overlay.fillStyle(0x000000, 0.3);
    this.overlay.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);
    this.overlay.setVisible(false);

    this.circleMask = this.scene.add.graphics();
    this.circleMask.fillStyle(0xffffff);
    this.circleMask.fillCircle(0, 0, this.radius);
    this.circleMask.setVisible(false);
    this.circleMask.setBelow(this.overlay);

    this.mask = this.overlay.createBitmapMask(this.circleMask);
    this.mask.invertAlpha = true;
    this.overlay.setMask(this.mask);

    this.scene.events.on('update', this.update, this);
  }

  public follow(target: Phaser.GameObjects.Image) {
    this.target = target;
  }

  public enable() {
    this.enabled = true;
    this.overlay.setAlpha(0);
    this.overlay.setVisible(true);

    this.scene.tweens.add({
      targets: this.overlay,
      alpha: 1,
      duration: 300,
      ease: 'Sine.easeOut',
    });
  }

  public disable() {
    this.enabled = false;

    this.scene.tweens.add({
      targets: this.overlay,
      alpha: 0,
      duration: 300,
      ease: 'Sine.easeIn',
      onComplete: () => {
        this.overlay.setVisible(false);
      },
    });
  }

  private update() {
    if (!this.enabled || !this.target) return;

    const x = this.target.x ?? 0;
    const y = this.target.y ?? 0;

    this.circleMask.clear();
    this.circleMask.fillStyle(0xffffff);
    this.circleMask.fillCircle(x, y, this.radius);
  }
}

export { SpotlightOverlay };
