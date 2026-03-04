import Phaser from 'phaser';

import { ScalePanel } from '../scale-panel';
import { buttonManager, ShopType } from '../../globals';

class ShopPanel extends ScalePanel {
  private shop: ShopType;

  public constructor(scene: Phaser.Scene, shop: ShopType) {
    super(scene, { width: 220, height: 150 });
    this.shop = shop;

    switch (this.shop) {
      case 'market':
        this.setPosition(320, 130);
        break;

      case 'shoppingCenter':
        this.setPosition(50, 114);
        break;

      case 'temporaryShop':
        this.setPosition(412, 100);
        break;
    }

    const sales = this.createButton(110, 50, 'Sales', `${this.shop}Sales`);
    const marketing = this.createButton(sales.x, sales.y + 50, 'Marketing', `${this.shop}Marketing`);

    buttonManager.setButton(`${this.shop}Sales`, sales);
    buttonManager.setButton(`${this.shop}Marketing`, marketing);

    this.add([sales, marketing]);
  }
}

export { ShopPanel };
