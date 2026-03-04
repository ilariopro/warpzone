import Phaser from 'phaser';

type AnimatedNumberUpdateConfig = {
  target: Phaser.GameObjects.Text;
  decimals?: number;
  from: number;
  to: number;
  onComplete?: () => void;
  onUpdate?: () => void;
};

const animatedNumberUpdate = (scene: Phaser.Scene, config: AnimatedNumberUpdateConfig) => {
  const { from, to, target, decimals = 0, onComplete, onUpdate } = config;

  if (from === to) {
    onComplete?.();
    return;
  }

  const distance = Math.abs(to - from);

  if (distance === 1) {
    target.setText(`${to}`);
    onComplete?.();
    return;
  }

  const baseDuration = 10;
  const durationPerUnit = 0.2;
  const maxDuration = 10000; // 10s
  const rawDuration = baseDuration + Math.log2(distance + 1) * 50 + distance * durationPerUnit;
  const duration = Phaser.Math.Clamp(rawDuration * 0.5, baseDuration, maxDuration);

  scene.tweens.addCounter({
    from,
    to,
    duration,
    onComplete,
    onUpdate: (tween) => {
      const tweenValue = tween.getValue();
      const currentValue = decimals ? tweenValue.toFixed(decimals) : Math.floor(tweenValue);
      target.setText(`${currentValue}`);

      onUpdate?.();
    },
  });
};

export { animatedNumberUpdate, type AnimatedNumberUpdateConfig };
