import Phaser from 'phaser';

import { SlidePanel } from '../slide-panel';

class NewsPanel extends SlidePanel {
  public constructor(scene: Phaser.Scene) {
    super(scene);

    // this.add([]);

    this.createTitle('News');
    this.createExitButton();
  }
}

export { NewsPanel };
