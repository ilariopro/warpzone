import Phaser from 'phaser';

type HintCursorShowConfig = {
  delay?: number;
  x?: number;
  y?: number;
};

class HintCursor extends Phaser.GameObjects.Image {
  private float: Phaser.Tweens.Tween;
  private initialX = 0;
  private initialY = 0;
  private lockVisibility = false;

  public constructor(scene: Phaser.Scene) {
    super(scene, 40, 40, 'hintCursor');
    this.scene.add.existing(this);

    this.initialX = this.x;
    this.initialY = this.y;

    this.float = this.floatingTween();
    this.setVisible(false);
  }

  public show(config: HintCursorShowConfig) {
    const delay = config.delay ?? 0;
    const x = config.x ?? this.initialX;
    const y = config.y ?? this.initialY;

    this.scene.time.delayedCall(delay, () => {
      this.scene.tweens.remove(this.float);

      this.setPosition(x, y);

      if (!this.lockVisibility) {
        this.setVisible(true);
      }

      this.float = this.floatingTween();
      this.initialX = x;
      this.initialY = y;
    });
  }

  public hide() {
    this.scene.tweens.remove(this.float);

    if (!this.lockVisibility) {
      this.setVisible(false);
    }
  }

  public lock() {
    this.lockVisibility = true;
  }

  public unlock() {
    this.lockVisibility = false;
  }

  /**
   * Tween's end position relative to the cursor's current position + 8 pixels
   */
  private floatingTween(duration = 1000) {
    const tweenConfig = {
      acceleration: 0.5,
      duration,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    };

    return this.scene.tweens.add({
      delay: 50,
      targets: this,
      x: { getEnd: () => this.x + 8, ...tweenConfig },
      y: { getEnd: () => this.y + 8, ...tweenConfig },
    });
  }
}

export { HintCursor };
