import Phaser from 'phaser';

import { NineSlice, PaginatedText, simpleButton } from '@warpzone/game-utils';
import { capitalize } from '@warpzone/shared-utils';
import { SlidePanel } from '../slide-panel';
import { buttonManager, eventManager, gameState, ShopType, styles } from '../../globals';

const infoText = {
  initial:
    'Mastering sales is essential to conquering the hoop world. Stay alert, flexible, and always ready to adapt to customer demand.',
  price: 'Price your hoops just right; too high scares customers away, too low sinks your profits.',
  restock:
    'Keep your shelves loaded to avoid looking like a post-apocalyptic shop. No one likes empty shelves (except zombies).',
};

class SalesPanel extends SlidePanel {
  private infoTexts: Record<string, PaginatedText>;

  private priceButton: Phaser.GameObjects.Container;
  private restockButton: Phaser.GameObjects.Container;
  private trendButton: Phaser.GameObjects.Container;

  private price: Phaser.GameObjects.Text;
  private inStock: Phaser.GameObjects.Text;
  private restockPercentage: Phaser.GameObjects.Text;

  private priceSelector: Phaser.GameObjects.Container;
  private restockSelector: Phaser.GameObjects.Container;

  private priceDelta = 10;
  private restockDelta = 10;
  private isUpdating = false;
  private shop: ShopType;

  public constructor(scene: Phaser.Scene, shop: ShopType) {
    super(scene, infoText.initial);
    this.shop = shop;

    this.infoTexts = {
      price: this.createInfoText(infoText.price),
      restock: this.createInfoText(infoText.restock),
    };

    const priceKey = `${this.shop}Price`;
    const restockKey = `${this.shop}Restock`;
    const trendKey = `${this.shop}Trend`;
    this.priceButton = this.createOptionButton(152, 74, 'moneySmall', 'Set Selling Price', priceKey);
    this.restockButton = this.createOptionButton(152, 134, 'hulaHoopSmall', 'Restock Products', restockKey);
    this.trendButton = this.createOptionButton(152, 194, 'iconChart', 'Sales Trend', trendKey);

    this.restockButton.disableInteractive().setAlpha(0.7); // TODO temporary

    const products = gameState.products[this.shop];
    this.price = this.createText(296, 80, `${products.price}`);
    this.inStock = this.createText(410, 120, `${products.inStock}`, 'right');
    this.restockPercentage = this.createText(410, 140, `${products.restockPercentage * 100}`, 'right');

    const details = [
      this.createText(296, 60, `Selling Price:`),
      this.createMoneyIcon(425, 84),

      this.createText(296, 120, `In Stock:`),
      this.createHulaHoopIcon(425, 124),

      this.createText(296, 140, `Restock:`),
      this.createText(418, 140, '%'),
    ];

    this.priceSelector = this.createAmountSelector(this.price, priceKey);
    this.restockSelector = this.createAmountSelector(this.restockPercentage, restockKey);

    this.createDetails();
    this.createTitle('Sales');

    const exitButton = this.createExitButton();

    buttonManager.setButton(`${shop}ExitSales`, exitButton);
    buttonManager.setButton(`${shop}Price`, this.priceButton);
    buttonManager.setButton(`${shop}Restock`, this.restockButton);
    buttonManager.setButton(`${shop}Trend`, this.trendButton);

    this.add([
      ...details,
      this.priceButton,
      this.restockButton,
      this.trendButton,
      this.inStock,
      this.price,
      this.priceSelector,
      this.restockPercentage,
      this.restockSelector,
    ]);

    this.trendButton.on('pointerdown', () => this.openChartPanel());
  }

  public open() {
    this.inStock.setText(`${gameState.products[this.shop].inStock}`);
    super.open();
  }

  private createAmountSelector(amount: Phaser.GameObjects.Text, key: string) {
    const container = this.scene.add.container(330, 235);
    const background = new NineSlice(this.scene, 70, 30, 8, 'panelDetail', 0, 0);
    const amountText = this.scene.add.text(6, 12, `${amount.text}`, styles.panelDetail).setOrigin(0);
    const delta = key === `${this.shop}Price` ? this.priceDelta : this.restockDelta;
    const icon = key === `${this.shop}Price` ? this.createMoneyIcon(55, 15) : this.createText(52, 12, '%');

    const updateAmount = (delta: number) => {
      if (this.isUpdating) return;
      this.isUpdating = true;

      const currentValue = Number(amount.text);
      const newValue = Phaser.Math.Clamp(currentValue + delta, 0, 100); // limita tra 0 e 100

      if (key === `${this.shop}Price`) {
        gameState.setProductPrice(this.shop, newValue);
      }

      if (key === `${this.shop}Restock`) {
        gameState.setRestockPercentage(this.shop, newValue);
      }

      if (newValue === currentValue) {
        this.isUpdating = false;
        return;
      }

      amountText.setText(`${newValue}`);
      this.updateCounter(amount, currentValue, newValue, 0, () => (this.isUpdating = false));
    };

    const minusKey = `${key}Minus`; // example: marketPriceMinus
    const minusButton = simpleButton(this.scene, {
      sound: this.buttonClick,
      target: this.scene.add.image(-25, 15, 'minus'),
      onPointerdown: () => {
        eventManager.emit('buttonPressed', plusKey);
        updateAmount(-delta);
      },
    });

    const plusKey = `${key}Plus`; // example: marketPricePlus
    const plusButton = simpleButton(this.scene, {
      sound: this.buttonClick,
      target: this.scene.add.image(95, 15, 'plus'),
      onPointerdown: () => {
        eventManager.emit('buttonPressed', plusKey);
        updateAmount(delta);
      },
    });

    buttonManager.setButton(minusKey, minusButton);
    buttonManager.setButton(plusKey, plusButton);

    return container.add([background, icon, minusButton, plusButton, amountText]).setVisible(false);
  }

  private createHulaHoopIcon(x: number, y: number) {
    return this.scene.add.image(x, y, 'hulaHoopSmall');
  }

  private createOptionButton(x: number, y: number, image: string, label: string, key: string) {
    const container = this.scene.add.container(x, y);
    const background = this.scene.add.image(0, 0, 'buttonOption');

    return simpleButton(this.scene, {
      target: container.add([
        background,
        this.scene.add.image(-105, 0, image),
        this.scene.add.text(-90, -4, label, styles.panelButton),
      ]),
      scale: 0.94,
      sound: this.buttonClick,
      width: background.width,
      heigth: background.height,
      onPointerdown: () => {
        this.selectedOption = key;
        const data = this.getInfo(this.selectedOption);
        this.setInfoText(data?.infoText);
        this.infoText?.animate();
        this.setActionButtonVisibility(true);

        eventManager.emit('buttonPressed', this.selectedOption);
      },
    });
  }

  private getInfo(label: string) {
    if (label === `${this.shop}Price`) {
      return { infoText: this.infoTexts.price };
    }

    if (label === `${this.shop}Restock`) {
      return { infoText: this.infoTexts.restock };
    }

    if (label === `${this.shop}Trend`) {
      return;
    }

    return { infoText: this.initialInfoText };
  }

  private openChartPanel() {
    if (this.selectedOption === `${this.shop}Trend`) {
      eventManager.emit('buttonPressed', `${this.shop}Trend`);
      eventManager.emit('openChart', `${this.shop}Trend`);
    }
  }

  private setActionButtonVisibility(visibile: boolean) {
    const selectors: Record<string, Phaser.GameObjects.Container> = {
      price: this.priceSelector,
      restock: this.restockSelector,
    };

    for (const key in selectors) {
      if (selectors[key]) {
        const selectedOption = `${this.shop}${capitalize(key)}`; // example: marketPrice
        selectors[key].setVisible(visibile && selectedOption === this.selectedOption);
      }
    }
  }
}

export { SalesPanel };
