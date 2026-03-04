import Phaser from 'phaser';

import { NotificationPanel } from '../notification-panel';
import { cameraMovements, eventManager, gameState, ShopType } from '../../globals';

const info: Record<ShopType, { title: string; text: string; persistent?: boolean }> = {
  market: { title: '', text: '' },
  shoppingCenter: {
    persistent: true,
    title: '🎉 New shop unlocked!',
    text: "You’ve just hit 10,000 sales, an incredible milestone! Your hoop empire is growing fast, and you've officially unlocked a brand new shop.\n\n\
But don't pop that bubbly just yet, your journey to world hoop domination has only just begun. There's a whole world out there waiting to spin your Hula Hoops!\n\n\
Thank you for playing the beta version of Hoopify City! \n\
More exciting developments and expansions are coming soon. Stay tuned and keep spinning toward success!\n\n\
Onwards and upwards, future tycoon! 🚀",
  },
  temporaryShop: { title: '', text: '' },
};

class StoreUnlocked extends NotificationPanel {
  private shop: ShopType;

  public constructor(scene: Phaser.Scene, shop: ShopType) {
    super(scene, info[shop]);
    this.shop = shop;
  }

  public isReady(): boolean {
    return gameState.isShopActive(this.shop) && !this.isNotified;
  }

  public open(): void {
    eventManager.emit('moveCamera', cameraMovements[this.shop].x, cameraMovements[this.shop].y);
    super.open();

    if (info[this.shop].persistent === true) {
      this.scene.time.delayedCall(25, () => eventManager.emit('resetTimer'));
    }
  }
}

export { StoreUnlocked };
