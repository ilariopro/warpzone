import Phaser from 'phaser';

import { SlidePanel } from '../slide-panel';
import { simpleButton, PaginatedText } from '@warpzone/game-utils';
import { buttonManager, eventManager, gameState, styles } from '../../globals';

const infoText = {
  initial:
    'Manage your resources wisely, a smart inventory strategy can make the difference between thriving or barely surviving!',
  x10: "Ideal for cautious entrepreneurs testing the waters. Perfect if you're just getting your hoop business rolling!",
  x50: 'A strategic choice for those ready to ramp up production without risking a warehouse disaster.',
  x100: 'For the daring tycoons who think big. Make sure your storage space (and nerves) can handle it!',
};

class ResourcesPanel extends SlidePanel {
  private infoTexts: Record<string, PaginatedText>;

  private x10Button: Phaser.GameObjects.Container;
  private x50Button: Phaser.GameObjects.Container;
  private x100Button: Phaser.GameObjects.Container;

  private budget: Phaser.GameObjects.Text;
  private resourceCount: Phaser.GameObjects.Text;

  private buyButton: Phaser.GameObjects.Container;

  public constructor(scene: Phaser.Scene) {
    super(scene, infoText.initial);

    this.infoTexts = {
      x10: this.createInfoText(infoText.x10),
      x50: this.createInfoText(infoText.x50),
      x100: this.createInfoText(infoText.x100),
    };

    this.x10Button = this.createOptionButton(152, 74, 'resource', 'x 10', 100);
    this.x50Button = this.createOptionButton(152, 134, 'resource', 'x 50', 400);
    this.x100Button = this.createOptionButton(152, 194, 'resource', 'x 100', 700);

    this.budget = this.createText(296, 80, `${gameState.money}`);
    this.resourceCount = this.createText(296, 200, `${gameState.resources.toFixed(1)}`);
    this.buyButton = this.createActionButton(406, 250, 'Buy', () => this.buy());

    const details = [
      this.createText(296, 60, `Your Budget:`),
      this.createMoneyIcon(425, 84),

      this.createText(296, 180, `Resources:`),
      this.scene.add.image(426, 200, 'resource'),
    ];

    this.createDetails();
    this.createTitle('Resources');

    const exitButton = this.createExitButton(() => this.buyButton.setVisible(false));

    buttonManager.setButton('exitResources', exitButton);
    buttonManager.setButton('buy', this.buyButton);
    buttonManager.setButton('x10', this.x10Button);
    buttonManager.setButton('x50', this.x50Button);
    buttonManager.setButton('x100', this.x100Button);

    this.add([
      ...details,
      this.x10Button,
      this.x50Button,
      this.x100Button,
      this.resourceCount,
      this.budget,
      this.buyButton,
    ]);
  }

  public open() {
    this.budget.setText(`${gameState.money}`);
    this.resourceCount.setText(`${gameState.resources.toFixed(1)}`);
    this.checkButtonVisibility();

    super.open();
  }

  private buy() {
    const { price, quantity } = this.getInfo(this.selectedOption);

    if (gameState.money > 0 && gameState.canBuyResources()) {
      gameState.setMoney(gameState.money - price);
      gameState.setResources(gameState.resources + quantity);
    }

    const decimals = gameState.canBuyResources() ? 1 : 0;
    this.updateCounter(this.resourceCount, this.resourceCount.text, gameState.resources, decimals);
    this.updateCounter(this.budget, this.budget.text, gameState.money);
    this.checkButtonVisibility();

    eventManager.emit('buttonPressed', 'buy');
    eventManager.emit('updateBudgetCounter');
    eventManager.emit('updateResourceCounter');
  }

  private checkButtonVisibility() {
    if (gameState.money < 100) {
      this.x10Button.disableInteractive().setAlpha(0.7);
    } else {
      this.x10Button.setInteractive().setAlpha(1);
    }

    if (gameState.money < 400) {
      this.x50Button.disableInteractive().setAlpha(0.7);
    } else {
      this.x50Button.setInteractive().setAlpha(1);
    }

    if (gameState.money < 700) {
      this.x100Button.disableInteractive().setAlpha(0.7);
    } else {
      this.x100Button.setInteractive().setAlpha(1);
    }
  }

  private createOptionButton(x: number, y: number, image: string, label: string, price: number) {
    const container = this.scene.add.container(x, y);
    const background = this.scene.add.image(0, 0, 'buttonOption');

    return simpleButton(this.scene, {
      target: container.add([
        background,
        this.scene.add.image(-105, 0, image),
        this.scene.add.text(-90, -4, label, styles.panelButton),
        this.scene.add.text(60, -4, `${price}`, styles.panelButton),
        this.scene.add.image(105, 0, 'moneySmall'),
      ]),
      scale: 0.94,
      sound: this.buttonClick,
      width: background.width,
      heigth: background.height,
      onPointerdown: () => {
        this.selectedOption = label.toLowerCase().replace(' ', '');
        const { infoText } = this.getInfo(this.selectedOption);
        this.setInfoText(infoText);
        this.infoText?.animate();
        this.buyButton.setVisible(true);

        eventManager.emit('buttonPressed', this.selectedOption);
      },
    });
  }

  private getInfo(label: string) {
    if (label === 'x10') {
      return { infoText: this.infoTexts.x10, price: 100, quantity: 10 };
    }

    if (label === 'x50') {
      return { infoText: this.infoTexts.x50, price: 400, quantity: 50 };
    }

    if (label === 'x100') {
      return { infoText: this.infoTexts.x100, price: 700, quantity: 100 };
    }

    return { infoText: this.initialInfoText, price: 0, quantity: 0 };
  }
}

export { ResourcesPanel };
