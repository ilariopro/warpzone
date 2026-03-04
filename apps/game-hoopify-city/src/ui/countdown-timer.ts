import Phaser from 'phaser';

import { Countdown } from '@warpzone/game-utils';
import { eventManager, locationManager, styles, titleManager } from '../globals';

class CountdownTimer extends Phaser.GameObjects.Container {
  private image: Phaser.GameObjects.Image;
  private timer: Countdown;
  private tickCounter = 0;

  public constructor(scene: Phaser.Scene, seconds: number) {
    super(scene, 596, 310);
    this.scene.add.existing(this);

    this.image = scene.add.image(0, 0, 'countdownTimer');
    this.timer = new Countdown(scene, {
      style: styles.timer,
      seconds,
      x: -0.5,
      y: +6,
      onTimeUp: () => eventManager.emit('dispatchActions'),
    });

    this.image.setScale(1.5);
    this.timer.setOrigin(0.5);

    const countdownTimerSound = scene.sound.add('countdownTimer').setVolume(0.6);

    this.add([this.image, this.timer])
      .setSize(this.image.width, this.image.height)
      .setInteractive()
      .on('pointerdown', () => {
        if (this.timer.getTimeLeft() > 0) {
          countdownTimerSound.play();
          eventManager.emit('buttonPressed', 'countdownTimer');
          locationManager.closePanel();
          titleManager.closePanel();

          scene.tweens.killTweensOf(this);
          scene.tweens.add({
            targets: this,
            scale: 0.8,
            duration: 80,
            yoyo: true,
            onComplete: () => this.end(),
          });
        }
      });

    // pulse and blink effects for when time is running out
    scene.events.on(Countdown.Tick, (timeLeft: number) => {
      const threshold = 11 * 1000; // 11 seconds

      if (timeLeft < threshold) {
        this.tickCounter++;

        const speed = timeLeft > threshold / 2 ? 4 : 3;
        if (this.tickCounter % speed === 0) {
          this.timer.visible = !this.timer.visible;
          scene.tweens.add({
            targets: this,
            duration: 100,
            scale: 1.12,
            yoyo: true,
          });
        }

        if (timeLeft <= 0 * 1000) {
          this.end();
        }
      }
    });
  }

  public isRunning() {
    return this.timer.isRunning();
  }

  public start() {
    this.reset();
    this.setInteractive();
    this.timer.start();
  }

  public pause() {
    this.timer.pause();
  }

  public resume() {
    this.timer.resume();
  }

  public end() {
    this.scene.tweens.killTweensOf(this);
    this.timer.end();
    this.timer.visible = true;
    this.disableInteractive();
  }

  public reset() {
    this.scale = 1;
    this.tickCounter = 0;
    this.timer.visible = true;
    this.timer.reset();
  }

  public restart() {
    this.reset();
    this.start();
  }
}

export { CountdownTimer };
