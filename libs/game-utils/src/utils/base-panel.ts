import Phaser from 'phaser';

interface BasePanelConfig {
  width: number;
  height?: number;
  x?: number;
  y?: number;
}

abstract class BasePanel extends Phaser.GameObjects.Container {
  private currentTween: Phaser.Tweens.Tween | null = null;
  private tweening = false;

  public constructor(scene: Phaser.Scene, config: BasePanelConfig) {
    super(scene, config.x, config.y);
    scene.add.existing(this);

    this.width = config.width;
    this.height = config.height ?? this.width;
  }

  public abstract open(...args: unknown[]): void;
  public abstract close(...args: unknown[]): void;

  public getCurrentTween() {
    return this.currentTween;
  }

  public isInternalPoint(x: number, y: number) {
    return this.getBounds().contains(x, y);
  }

  public isTweening() {
    return this.tweening;
  }

  public tween(config: Phaser.Types.Tweens.TweenChainBuilderConfig) {
    if (!this.tweening) {
      this.tweening = true;

      this.currentTween = this.scene?.tweens.add({
        ...config,
        onComplete: () => {
          this.currentTween = null;
          this.tweening = false;
        },
      });
    }
  }
}

export { BasePanel, type BasePanelConfig };
