import Phaser from 'phaser';

/**
 * Pause all active scenes in the game.
 *
 * @param game The running game.
 */
const pauseGame = (game: Phaser.Game) => {
  const activeScenes = game.scene.getScenes();

  activeScenes.forEach((scene) => {
    scene.scene.pause(scene.scene.key);
    scene.sound.pauseAll();
  });
};

/**
 * Resume all inactive scenes in the game.
 *
 * @param game The running game.
 */
const resumeGame = (game: Phaser.Game) => {
  const inactiveScenes = game.scene.getScenes(false);

  inactiveScenes.forEach((scene) => {
    scene.scene.resume(scene.scene.key);
    scene.sound.resumeAll();
  });
};

export { pauseGame, resumeGame };
