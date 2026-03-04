import Phaser from 'phaser';

/**
 * Load any assets required by the Preloader scene, such as a game logo or background.
 * The assets must be lightweight because the Boot scene itself has no preloader.
 */
class BootScene extends Phaser.Scene {
  public constructor() {
    super({ key: 'bootScene' });
  }

  public preload() {
    //
  }

  public create() {
    this.scene.start('loaderScene');
  }
}

export { BootScene };
