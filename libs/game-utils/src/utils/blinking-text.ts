import Phaser from 'phaser';

/**
 * Set a timer to toggle the text visibility in a loop.
 *
 * @param scene The current scene.
 * @param text Text to blink.
 * @param milliseconds Blinking time.
 */
const blinkingText = (scene: Phaser.Scene, text: Phaser.GameObjects.Text, milliseconds = 300) => {
  scene.time.addEvent({
    delay: milliseconds,
    callback: () => (text.visible = !text.visible),
    callbackScope: this,
    loop: true,
  });
};

export { blinkingText };
