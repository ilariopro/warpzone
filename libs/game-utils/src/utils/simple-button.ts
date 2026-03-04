import Phaser from 'phaser';

type SimpleButtonConfig<T> = {
  target: T;
  scale?: number;
  duration?: number;
  sound?: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
  width?: number;
  heigth?: number;
  onComplete?: () => void;
  onPointerdown?: () => void;
  onPointerup?: () => void;
};

const simpleButton = <T extends Phaser.GameObjects.GameObject>(
  scene: Phaser.Scene,
  config: SimpleButtonConfig<T>
) => {
  let isTweening = false;
  const {
    target,
    scale = 0.8,
    duration = 80,
    width,
    heigth,
    sound,
    onComplete,
    onPointerdown,
    onPointerup,
  } = config;

  if (target instanceof Phaser.GameObjects.Container) {
    if (!width) {
      throw Error('The width and height properties are missing to use the Container game object');
    }

    target.setSize(width, heigth ?? width);
  }

  target.setInteractive();
  target.on('pointerdown', () => {
    if (!isTweening) {
      isTweening = true;
      scene.tweens.add({
        targets: target,
        scale,
        duration,
        yoyo: true,
        onComplete: () => {
          isTweening = false;
          if (onComplete) onComplete();
        },
      });
    }
  });

  if (onPointerdown) {
    target.on('pointerdown', () => {
      sound?.play();
      onPointerdown();
    });
  }

  if (onPointerup) {
    target.on('pointerup', () => onPointerup());
  }

  return target;
};

export { simpleButton, type SimpleButtonConfig };
