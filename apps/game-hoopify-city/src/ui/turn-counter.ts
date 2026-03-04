import Phaser from 'phaser';

import { NineSlice } from '@warpzone/game-utils';
import { gameState, styles, titleManager } from '../globals';

class TurnCounter extends Phaser.GameObjects.Container {
  private background: NineSlice;
  private text: Phaser.GameObjects.Text;
  private turnCount: number;
  private originalY: number;

  public constructor(scene: Phaser.Scene) {
    super(scene, scene.scale.width / 2, 32);
    this.scene.add.existing(this);

    this.originalY = this.y;
    this.turnCount = gameState.turn;
    this.text = scene.add.text(0, 1, `Turn ${this.turnCount}`, styles.timer).setOrigin(0.5);
    this.width = this.text.width;
    this.height = this.text.height + 1;
    this.background = this.createBackground();

    this.add([this.background, this.text]);

    this.scene.events.on('update', () => {
      this.setVisible(!titleManager.getCurrentPanel() ? true : false);
    });
  }

  public getTurnCount() {
    return this.turnCount;
  }

  public update(onComplete?: () => void) {
    const newTurn = gameState.turn;

    if (newTurn === this.turnCount) {
      onComplete?.();
      return;
    }

    this.turnCount = newTurn;
    this.text.setText(`Turn ${this.turnCount}`);
    this.width = this.text.width;
    this.background = this.createBackground();
    this.addAt(this.background, 0);

    this.scene.tweens.add({
      targets: this,
      y: this.originalY + 5,
      duration: 150,
      yoyo: true,
      ease: 'Power1',
      onComplete: () => {
        this.y = this.originalY;
        onComplete?.();
      },
    });
  }

  private createBackground() {
    if (this.background) {
      this.background.destroy();
    }

    const width = this.width + 20;
    const height = this.height + 20;

    return new NineSlice(this.scene, width, height, 8, 'buttonAction').setOrigin(0.5);
  }
}

export { TurnCounter };
