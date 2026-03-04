import Phaser from 'phaser';

import { animationFrameRate, AnimationPath, depths } from '../globals';

type WalkingAnimationConfig = {
  path?: AnimationPath[];
  textureKey: string;
  x: number;
  y: number;
};

class WalkingAnimation extends Phaser.GameObjects.Sprite {
  private path: AnimationPath[] | null = null;
  private textureKey: string;

  public constructor(scene: Phaser.Scene, config: WalkingAnimationConfig) {
    super(scene, config.x, config.y, config.textureKey, 18);

    this.depth = depths.npc;
    this.scene.add.existing(this);
    this.textureKey = config.textureKey;

    if (config.path) {
      this.path = config.path;
    }

    this.createAnimation('idleRight', 0, 5);
    this.createAnimation('idleUp', 6, 11);
    this.createAnimation('idleLeft', 12, 17);
    this.createAnimation('idleDown', 18, 23);
    this.createAnimation('walkRight', 24, 29);
    this.createAnimation('walkUp', 30, 35);
    this.createAnimation('walkLeft', 36, 41);
    this.createAnimation('walkDown', 42, 47);
  }

  private createAnimation(key: string, start: number, end: number) {
    this.anims.create({
      key,
      frames: this.anims.generateFrameNumbers(this.textureKey, { start, end }),
      frameRate: animationFrameRate,
      repeat: -1,
    });
  }

  private moveAlongPath(currentPath: AnimationPath[], cyclic: boolean, onComplete?: () => void) {
    if (currentPath.length === 0) {
      if (cyclic && this.path) {
        this.moveAlongPath(this.path, true, onComplete); // ricomincia il percorso se è ciclico
      } else {
        onComplete?.(); // chiama il completamento se non è ciclico
      }

      return;
    }

    const [nextPoint, ...remainingPath] = currentPath;

    this.scene.tweens.add({
      targets: this,
      x: nextPoint.x,
      y: nextPoint.y,
      duration: nextPoint.duration,
      onStart: () => this.play(nextPoint.animationKey), // cambia l'animazione
      onComplete: () => this.moveAlongPath(remainingPath, cyclic, onComplete), // continua con il percorso rimanente
    });
  }

  public followCyclicPath() {
    if (!this.path || this.path.length === 0) {
      return;
    }

    this.moveAlongPath(this.path, true);
  }

  public followPath(onComplete: () => void) {
    if (!this.path || this.path.length === 0) {
      onComplete();
      return;
    }

    this.moveAlongPath(this.path, false, onComplete);
  }

  public setPath(path: AnimationPath[]) {
    this.path = path;
  }
}

export { WalkingAnimation };
