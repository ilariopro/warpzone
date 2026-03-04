import Phaser from 'phaser';

import { pauseGame, resumeGame } from './pause-resume-game';

/**
 * Check if the game is in the desidered orientation, if not pause the game.
 *
 * @param game The running game.
 * @param orientation The desidered orientation, it can be 'landscape' or 'portrait'.
 */
const checkOrientation = (game: Phaser.Game, orientation: 'landscape' | 'portrait') => {
  const { innerWidth, innerHeight } = window;

  const screenOrientation = innerWidth > innerHeight ? 'landscape' : 'portrait';
  const rotateAlert = document.getElementById('rotateAlert');
  const rotateAlertText = document.getElementById('rotateAlertText');

  if (!rotateAlert || !rotateAlertText) return;

  if (orientation === screenOrientation) {
    rotateAlert.classList.add('hidden');
    rotateAlert.classList.remove('flex');

    resumeGame(game);
  } else {
    rotateAlert.classList.remove('hidden');
    rotateAlert.classList.add('flex');
    rotateAlertText.textContent = `Please rotate your device to ${orientation} mode`;

    pauseGame(game);
  }
};

export { checkOrientation };
