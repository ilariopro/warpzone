import Phaser from 'phaser';

import { PaginatedText } from '@warpzone/game-utils';
import { SlidePanel } from './slide-panel';
import { eventManager, panelManager, styles } from '../globals';

type TutorialConfig = { title: string; text: string };

class TutorialPanel extends SlidePanel {
  protected title: Phaser.GameObjects.Text;
  protected text: PaginatedText;

  public constructor(scene: Phaser.Scene, tutorial: TutorialConfig, exitButton = false) {
    super(scene);

    this.title = this.scene.add.text(24, 25, tutorial.title, styles.title);
    this.text = new PaginatedText(this.scene, {
      closeCursor: true,
      width: this.width - 50,
      height: this.height - 80,
      text: tutorial.text,
      style: styles.text,
      x: 24,
      y: 62,
      onComplete: () => {
        panelManager.closePanel();
        eventManager.emit('nextTutorialStep');
      },
    });

    this.add([this.title, this.text]);

    if (exitButton) {
      this.createExitButton(() => eventManager.emit('skipTutorial'));
    }
  }

  public open() {
    eventManager.emit('pauseTimer');
    super.open();
    this.text.animate();
  }

  public close() {
    super.close();
    eventManager.emit('resumeTimer');
    this.text.reset();
  }
}

export { TutorialPanel };
