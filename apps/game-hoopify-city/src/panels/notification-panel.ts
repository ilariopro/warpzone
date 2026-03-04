import Phaser from 'phaser';

import { PaginatedText } from '@warpzone/game-utils';
import { SlidePanel } from './slide-panel';
import { eventManager, panelManager, styles } from '../globals';

type NotificationConfig = { title: string; text: string; persistent?: boolean };

abstract class NotificationPanel extends SlidePanel {
  protected isNotified = false;
  protected isPersistent = false;
  protected title: Phaser.GameObjects.Text;
  protected text: PaginatedText;

  public constructor(scene: Phaser.Scene, notification: NotificationConfig) {
    super(scene);

    this.title = this.scene.add.text(24, 25, notification.title, styles.title);
    this.text = new PaginatedText(this.scene, {
      closeCursor: true,
      width: this.width - 50,
      height: this.height - 80,
      text: notification.text,
      style: styles.text,
      x: 24,
      y: 62,
      onComplete: () => {
        if (notification.persistent === true) {
          this.isPersistent = true;
          panelManager.closePanel();
        }
      },
    });

    this.add([this.title, this.text]);
  }

  public abstract isReady(): boolean;

  public open() {
    super.open();
    this.isNotified = true;
    this.text.animate();
  }

  public close() {
    if (!this.isPersistent) {
      super.close();
      eventManager.emit('resumeTimer');
      this.text.reset();
    }
  }
}

export { NotificationPanel };
