import Phaser from 'phaser';

import { simpleButton } from '@warpzone/game-utils';
import { SlidePanel } from '../slide-panel';
import { gameState, styles } from '../../globals';

class SettingsPanel extends SlidePanel {
  private fullscreenChecked: Phaser.GameObjects.Image;
  private fullscreenUnchecked: Phaser.GameObjects.Image;
  private soundBar: Phaser.GameObjects.Sprite;

  public constructor(scene: Phaser.Scene) {
    super(scene);

    this.soundBar = this.scene.add.sprite(330, 86, 'volumeBar').setScale(1.5);
    this.updateSoundVolume();

    const soundText = this.scene.add.text(40, 80, 'Sounds ', styles.label);

    const soundMinus = simpleButton(this.scene, {
      sound: this.buttonClick,
      target: this.scene.add.image(260, 86, 'minus'),
      onPointerdown: () => this.updateSoundVolume('down'),
    });

    const soundPlus = simpleButton(this.scene, {
      sound: this.buttonClick,
      target: this.scene.add.image(400, 86, 'plus'),
      onPointerdown: () => this.updateSoundVolume('up'),
    });

    const fullscreenText = this.scene.add.text(40, 140, 'Fullscreen', styles.label);

    this.fullscreenChecked = simpleButton(this.scene, {
      sound: this.buttonExit,
      target: this.scene.add.image(260, 146, 'checked'),
      onPointerdown: () => this.scene.scale.stopFullscreen(),
    });

    this.fullscreenUnchecked = simpleButton(this.scene, {
      sound: this.buttonClick,
      target: this.scene.add.image(260, 146, 'empty'),
      onPointerdown: () => this.scene.scale.startFullscreen(),
    });

    this.createTitle('Settings');
    this.createExitButton();
    this.updateFullscreenButtons();

    this.add([
      this.soundBar,
      soundMinus,
      soundPlus,
      soundText,
      fullscreenText,
      this.fullscreenChecked,
      this.fullscreenUnchecked,
    ]);

    // TODO can we handle also the browser window events?
    this.scene.scale.on('enterfullscreen', this.updateFullscreenButtons, this);
    this.scene.scale.on('leavefullscreen', this.updateFullscreenButtons, this);
  }

  public destroy() {
    this.scene.scale.off('enterfullscreen', this.updateFullscreenButtons, this);
    this.scene.scale.off('leavefullscreen', this.updateFullscreenButtons, this);
    super.destroy();
  }

  private updateFullscreenButtons() {
    const isFullscreen = this.scene.scale.isFullscreen;

    this.fullscreenChecked.setVisible(isFullscreen);
    this.fullscreenUnchecked.setVisible(!isFullscreen);
  }

  private updateSoundVolume(direction?: 'down' | 'up') {
    if (direction) {
      gameState.updateSoundVolume(direction);
    }

    const currentVolume = gameState.settings.soundVolume;
    const frameNumber = (currentVolume * 10) / 2;

    this.scene.sound.volume = currentVolume;
    this.soundBar.setFrame(frameNumber);
  }
}

export { SettingsPanel };
