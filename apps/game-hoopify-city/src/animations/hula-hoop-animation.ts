import Phaser from 'phaser';

import { animationFrameRate, depths } from '../globals';

class HulaHoopAnimation extends Phaser.GameObjects.Sprite {
  private textureKey: string;

  public constructor(scene: Phaser.Scene, textureKey: string) {
    super(scene, 0, 0, textureKey);

    this.depth = depths.npc;
    this.scene.add.existing(this);
    this.textureKey = textureKey;

    this.anims.create({
      key: 'hulaHoop',
      frames: this.anims.generateFrameNumbers(this.textureKey, { start: 0, end: 3 }),
      frameRate: animationFrameRate,
      repeat: -1,
    });
  }
}

export { HulaHoopAnimation };
