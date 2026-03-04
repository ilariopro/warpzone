import Phaser from 'phaser';

import { animatedNumberUpdate, NineSlice } from '@warpzone/game-utils';
import { gameState, styles } from '../globals';

class ResourceCounter extends Phaser.GameObjects.Container {
  private background: NineSlice;
  private icon: Phaser.GameObjects.Image;
  private text: Phaser.GameObjects.Text;
  private totalResources: number;
  private originalY: number;

  public constructor(scene: Phaser.Scene) {
    super(scene, 16, 96);
    this.scene.add.existing(this);

    this.originalY = this.y;
    this.totalResources = gameState.resources;
    this.icon = scene.add.image(0, 0, 'resource').setOrigin(0, 0.5).setScale(0.8);
    this.text = scene.add.text(0, 1, `${this.totalResources.toFixed(1)}`, styles.infoText).setOrigin(0, 0.5);
    this.width = this.text.width + this.icon.width + 10;
    this.height = this.text.height;
    this.background = this.createBackground();
    this.icon.setX(12);
    this.text.setX(this.icon.x + this.icon.width + 3);

    this.add([this.background, this.icon, this.text]);
  }

  public update(onComplete?: () => void) {
    const newTotal = gameState.resources;

    if (newTotal === this.totalResources) {
      onComplete?.();
      return;
    }

    animatedNumberUpdate(this.scene, {
      decimals: gameState.resources < 100 ? 1 : 0,
      target: this.text,
      from: this.totalResources,
      to: newTotal,
      onComplete: () => {
        this.totalResources = newTotal;
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
    if (this.background) {
      this.background.destroy();
    }

    const width = this.width + 16;
    const height = this.height + 16;

    return new NineSlice(this.scene, width, height, 8, 'buttonAction').setOrigin(0, 0.5);
  }
}

export { ResourceCounter };
