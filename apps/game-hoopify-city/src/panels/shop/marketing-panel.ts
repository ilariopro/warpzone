import Phaser from 'phaser';

import { simpleButton, NineSlice, PaginatedText } from '@warpzone/game-utils';
import { capitalize } from '@warpzone/shared-utils';
import { SlidePanel } from '../slide-panel';
import { buttonManager, eventManager, gameState, MarketingType, ShopType, styles } from '../../globals';

const infoText = {
  initial:
    'Spread the word and boost your hoop brand with targeted marketing. Choose your strategy wisely to captivate your audience!',
  traditional:
    'Time-tested tactics like billboards, radio, and TV ads. Perfect for capturing classic hoop fans.',
  digital:
    'Reach audiences glued to their screens with creative online ads. Scrolling fingers will pause when they see your hoops!',
  influencer:
    'Partner with social media stars to elevate your hoop status. A modern twist that could skyrocket your popularity.',
};

class MarketingPanel extends SlidePanel {
  private infoTexts: Record<string, PaginatedText>;

  private traditionalButton: Phaser.GameObjects.Container;
  private digitalButton: Phaser.GameObjects.Container;
  private influencerButton: Phaser.GameObjects.Container;

  private traditionalBudget: Phaser.GameObjects.Text;
  private digitalBudget: Phaser.GameObjects.Text;
  private influencerBudget: Phaser.GameObjects.Text;

  private traditionalBudgetSelector: Phaser.GameObjects.Container;
  private digitalBudgetSelector: Phaser.GameObjects.Container;
  private influencerBudgetSelector: Phaser.GameObjects.Container;

  private budgetDelta = 5;
  private isUpdating = false;
  private shop: ShopType;

  public constructor(scene: Phaser.Scene, shop: ShopType) {
    super(scene, infoText.initial);
    this.shop = shop;

    this.infoTexts = {
      traditional: this.createInfoText(infoText.traditional),
      digital: this.createInfoText(infoText.digital),
      influencer: this.createInfoText(infoText.influencer),
    };

    this.traditionalButton = this.createOptionButton(152, 74, 'Traditional');
    this.digitalButton = this.createOptionButton(152, 134, 'Digital');
    this.influencerButton = this.createOptionButton(152, 194, 'Influencer');

    const marketing = gameState.marketing[this.shop];
    this.traditionalBudget = this.createText(296, 80, `${marketing.traditional.budget}`);
    this.digitalBudget = this.createText(296, 140, `${marketing.digital.budget}`);
    this.influencerBudget = this.createText(296, 200, `${marketing.influencer.budget}`);

    this.traditionalBudgetSelector = this.createBudgetSelector(this.traditionalBudget, 'traditional');
    this.digitalBudgetSelector = this.createBudgetSelector(this.digitalBudget, 'digital');
    this.influencerBudgetSelector = this.createBudgetSelector(this.influencerBudget, 'influencer');

    const details = [
      this.createText(296, 60, `Traditional:`),
      this.createText(365, 80, `/turn`),
      this.createMoneyIcon(425, 84),

      this.createText(296, 120, `Digital:`),
      this.createText(365, 140, `/turn`),
      this.createMoneyIcon(425, 144),

      this.createText(296, 180, `Influencer:`),
      this.createText(365, 200, `/turn`),
      this.createMoneyIcon(425, 204),
    ];

    this.createDetails();
    this.createTitle('Marketing');

    const exitButton = this.createExitButton(() => this.setActionButtonVisibility(false));

    buttonManager.setButton(`${shop}ExitMarketing`, exitButton);
    buttonManager.setButton(`${shop}Traditional`, this.traditionalButton);
    buttonManager.setButton(`${shop}Digital`, this.digitalButton);
    buttonManager.setButton(`${shop}Influencer`, this.influencerButton);

    this.add([
      ...details,
      this.traditionalButton,
      this.digitalButton,
      this.influencerButton,
      this.digitalBudget,
      this.influencerBudget,
      this.traditionalBudget,
      this.traditionalBudgetSelector,
      this.digitalBudgetSelector,
      this.influencerBudgetSelector,
    ]);
  }

  private createBudgetSelector(budget: Phaser.GameObjects.Text, channel: MarketingType) {
    const container = this.scene.add.container(330, 235);
    const background = new NineSlice(this.scene, 70, 30, 8, 'panelDetail', 0, 0);
    const budgetText = this.scene.add.text(6, 12, `${budget.text}`, styles.panelDetail).setOrigin(0);
    const moneyIcon = this.createMoneyIcon(55, 15);

    const updateBudget = (delta: number) => {
      if (this.isUpdating) return;
      this.isUpdating = true;

      const currentValue = Number(budget.text);
      const newValue = Phaser.Math.Clamp(currentValue + delta, 0, 1000); // limita tra 0 e 1000

      if (newValue === currentValue) {
        this.isUpdating = false;
        return;
      }

      budgetText.setText(`${newValue}`);
      gameState.updateMarketingBudget(this.shop, channel, newValue);
      this.updateCounter(budget, currentValue, newValue, 0, () => (this.isUpdating = false));
    };

    const minusKey = `${this.shop}${capitalize(channel)}Minus`; // example: marketTraditionalMinus
    const minusButton = simpleButton(this.scene, {
      sound: this.buttonClick,
      target: this.scene.add.image(-25, 15, 'minus'),
      onPointerdown: () => {
        eventManager.emit('buttonPressed', minusKey);
        updateBudget(-this.budgetDelta);
      },
    });

    const plusKey = `${this.shop}${capitalize(channel)}Plus`; // example: marketTraditionalPlus
    const plusButton = simpleButton(this.scene, {
      sound: this.buttonClick,
      target: this.scene.add.image(95, 15, 'plus'),
      onPointerdown: () => {
        eventManager.emit('buttonPressed', plusKey);
        updateBudget(this.budgetDelta);
      },
    });

    buttonManager.setButton(minusKey, minusButton);
    buttonManager.setButton(plusKey, plusButton);

    return container.add([background, minusButton, plusButton, budgetText, moneyIcon]).setVisible(false);
  }

  private createOptionButton(x: number, y: number, label: string) {
    const container = this.scene.add.container(x, y);
    const background = this.scene.add.image(0, 0, 'buttonOption');

    return simpleButton(this.scene, {
      target: container.add([background, this.scene.add.text(-115, -4, label, styles.panelButton)]),
      scale: 0.94,
      sound: this.buttonClick,
      width: background.width,
      heigth: background.height,
      onPointerdown: () => {
        this.selectedOption = label.toLowerCase();
        const { infoText } = this.getInfo(this.selectedOption);
        this.setInfoText(infoText);
        this.infoText?.animate();
        this.setActionButtonVisibility(true);

        eventManager.emit('buttonPressed', `${this.shop}${label}`);
      },
    });
  }

  private getInfo(label: string) {
    if (label === 'traditional') {
      return { infoText: this.infoTexts.traditional };
    }

    if (label === 'digital') {
      return { infoText: this.infoTexts.digital };
    }

    if (label === 'influencer') {
      return { infoText: this.infoTexts.influencer };
    }

    return { infoText: this.initialInfoText };
  }

  private setActionButtonVisibility(visibile: boolean) {
    const budgetSelectors: Record<string, Phaser.GameObjects.Container> = {
      traditional: this.traditionalBudgetSelector,
      digital: this.digitalBudgetSelector,
      influencer: this.influencerBudgetSelector,
    };

    for (const key in budgetSelectors) {
      if (budgetSelectors[key]) {
        budgetSelectors[key].setVisible(visibile && key === this.selectedOption);
      }
    }
  }
}

export { MarketingPanel };
