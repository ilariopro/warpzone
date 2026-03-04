import Phaser from 'phaser';

type ColorChangingTextConfig = {
  colors: number[];
  milliseconds?: number;
  text: Phaser.GameObjects.Text;
};

/**
 * Set a timer to change the text color in a loop with smooth interpolation.
 *
 * @param scene The current scene.
 * @param config Configuration for: text, colors and milliseconds (optional, default to 1000).
 */
const colorChangingText = (scene: Phaser.Scene, config: ColorChangingTextConfig) => {
  const { colors, milliseconds = 1000, text } = config;

  let colorIndex = 0;
  let interpolationFactor = 0;

  scene.time.addEvent({
    delay: milliseconds / 60, // Update 60 times per second for smooth transition
    callback: () => {
      // Get current and next color
      const currentColor = Phaser.Display.Color.IntegerToColor(colors[colorIndex]);
      const nextColor = Phaser.Display.Color.IntegerToColor(colors[(colorIndex + 1) % colors.length]);

      // Interpolate color
      const interpolatedColor = Phaser.Display.Color.Interpolate.ColorWithColor(
        currentColor,
        nextColor,
        60, // Total steps for interpolation
        interpolationFactor
      );

      // Set the text color
      const interpolatedColorHex = Phaser.Display.Color.GetColor(
        interpolatedColor.r,
        interpolatedColor.g,
        interpolatedColor.b
      );
      text.setColor(`#${interpolatedColorHex.toString(16).padStart(6, '0')}`);

      // Update the interpolation factor
      interpolationFactor++;
      if (interpolationFactor > 60) {
        interpolationFactor = 0;
        colorIndex = (colorIndex + 1) % colors.length;
      }
    },
    callbackScope: this,
    loop: true,
  });
};

export { colorChangingText, type ColorChangingTextConfig };
