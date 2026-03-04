import Phaser from 'phaser';

import { animatedNumberUpdate, NineSlice } from '@warpzone/game-utils';
import { gameState, styles } from '../globals';

class MoneyCounter extends Phaser.GameObjects.Container {
  private background: NineSlice;
  private icon: Phaser.GameObjects.Image;
  private text: Phaser.GameObjects.Text;
  private currentBudget: number;
  private originalY: number;

  constructor(scene: Phaser.Scene) {
    super(scene, 16, 32);
    this.scene.add.existing(this);

    this.currentBudget = gameState.money;
    this.originalY = this.y;
    this.icon = scene.add.image(0, 0, 'moneySmall').setOrigin(0, 0.5);
    this.text = scene.add.text(0, 1, `${this.currentBudget}`, styles.infoText).setOrigin(0, 0.5);
    this.width = this.text.width + this.icon.width + 10;
    this.height = this.text.height;
    this.background = this.createBackground();
    this.icon.setX(10);
    this.text.setX(this.icon.x + this.icon.width + 6);

    this.add([this.background, this.icon, this.text]);
  }

  public update(onComplete?: () => void) {
    const newBudget = gameState.money;

    if (newBudget === this.currentBudget) {
      onComplete?.();
      return;
    }

    animatedNumberUpdate(this.scene, {
      target: this.text,
      from: this.currentBudget,
      to: newBudget,
      onComplete: () => {
        this.currentBudget = newBudget;
        onComplete?.();
      },
      onUpdate: () => {
        this.width = this.text.width + this.icon.width + 10;
        this.background = this.createBackground();
        this.addAt(this.background, 0);
      },
    });

    this.scene.tweens.add({
      targets: this,
      y: this.originalY - 2,
      duration: 100,
      yoyo: true,
      ease: 'Power1',
      onComplete: () => (this.y = this.originalY),
    });
  }

  private createBackground() {
    this.background?.destroy();

    const width = this.width + 16;
    const height = this.height + 16;

    return new NineSlice(this.scene, width, height, 8, 'buttonAction').setOrigin(0, 0.5);
  }
}

export { MoneyCounter };
