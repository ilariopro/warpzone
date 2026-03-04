import Phaser from 'phaser';

import { SlidePanel } from '../slide-panel';
import { simpleButton, PaginatedText } from '@warpzone/game-utils';
import { eventManager, gameState, styles } from '../../globals';

const infoText = {
  initial: 'Facing cash flow challenges? Loans can save you or sink you, depending on how you handle them.',
  loan1: 'A modest financial boost, useful for minor hiccups. Keep repayments manageable.',
  loan2: 'Provides enough funds to stabilize shaky ground. Use with caution and careful planning.',
  loan3:
    'Significant funding to fuel major expansions. Monitor interest rates closely: big money brings bigger responsibilities!',
};

class LoanPanel extends SlidePanel {
  private infoTexts: Record<string, PaginatedText>;
  private details: Phaser.GameObjects.Group;

  private budget: Phaser.GameObjects.Text;
  private duration: Phaser.GameObjects.Text;
  private installment: Phaser.GameObjects.Text;
  private paymentCount: Phaser.GameObjects.Text;

  private applyButton: Phaser.GameObjects.Container;
  private loan1Button: Phaser.GameObjects.Container;
  private loan2Button: Phaser.GameObjects.Container;
  private loan3Button: Phaser.GameObjects.Container;

  public constructor(scene: Phaser.Scene) {
    super(scene, infoText.initial);

    this.infoTexts = {
      loan1: this.createInfoText(infoText.loan1),
      loan2: this.createInfoText(infoText.loan2),
      loan3: this.createInfoText(infoText.loan3),
    };

    this.loan1Button = this.createOptionButton(152, 74, 'loan1');
    this.loan2Button = this.createOptionButton(152, 134, 'loan2');
    this.loan3Button = this.createOptionButton(152, 194, 'loan3');

    const loan = gameState.loan;
    this.budget = this.createText(296, 80, `${gameState.money}`);
    this.installment = this.createText(296, 140, `${gameState.getInstallment()}`);
    this.duration = this.createText(296, 180, `${loan.duration}`);
    this.paymentCount = this.createText(430, 200, `${loan.paymentCount}`, 'right');
    this.applyButton = this.createActionButton(406, 250, 'Apply', () => this.apply());

    this.details = this.scene.add.group([
      this.createText(296, 120, `Installment:`),
      this.installment,
      this.createMoneyIcon(425, 144),
      this.createText(296, 160, `Duration:`),
      this.duration,
      this.createText(430, 180, `turns`, 'right'),
      this.createText(296, 200, `Payments:`),
      this.paymentCount,
    ]);

    this.createDetails();
    this.createExitButton(() => this.applyButton.setVisible(false));
    this.createTitle('Loan');

    this.add([
      ...this.details.getChildren(),
      this.createText(296, 60, `Your Budget:`),
      this.createMoneyIcon(425, 84),
      this.loan1Button,
      this.loan2Button,
      this.loan3Button,
      this.budget,
      this.duration,
      this.installment,
      this.paymentCount,
      this.applyButton,
    ]);
  }

  public open() {
    this.budget.setText(`${gameState.money}`);
    this.duration.setText(`${gameState.loan.duration}`);
    this.installment.setText(`${gameState.getInstallment()}`);
    this.paymentCount.setText(`${gameState.loan.paymentCount}`);

    if (gameState.canApplyForLoan()) {
      this.details.setVisible(false);
      this.enableOptionsButtons();
    } else {
      this.details.setVisible(true);
      this.disableOptionButtons();
    }

    super.open();
  }

  private apply() {
    if (gameState.canApplyForLoan()) {
      const loanData = this.getInfo(this.selectedOption);
      const { amount, duration, interestRate } = loanData;

      gameState.setMoney(gameState.money + amount);
      gameState.updateLoan(amount, duration, interestRate);

      this.duration.setText(`${gameState.loan.duration}`);
      this.installment.setText(`${gameState.getInstallment()}`);
      this.details.setVisible(true);
      this.updateCounter(this.budget, this.budget.text, gameState.money);
      this.disableOptionButtons();

      eventManager.emit('updateBudgetCounter');
    }
  }

  private createOptionButton(x: number, y: number, label: string) {
    const { amount, duration, interestRate } = this.getInfo(label);
    const container = this.scene.add.container(x, y);
    const background = this.scene.add.image(0, 0, 'buttonOption');
    const loan = this.scene.add.text(-115, -4, `${amount}`, styles.panelButton);
    const style = { ...styles.panelButton, fontSize: styles.chart.fontSize };
    const subStyle = { ...style, color: styles.panelDetail.color };

    return simpleButton(this.scene, {
      target: container.add([
        background,
        loan,
        this.createMoneyIcon(loan.x + loan.width + 12, 0),
        this.createText(115, -10, `Duration: ${duration} turns`, 'right', style),
        this.createText(115, 5, `Interest rate ${interestRate * 100} %`, 'right', subStyle),
      ]),
      scale: 0.94,
      sound: this.buttonClick,
      width: background.width,
      heigth: background.height,
      onPointerdown: () => {
        this.selectedOption = label.toLowerCase();
        const { infoText } = this.getInfo(this.selectedOption);
        this.setInfoText(infoText);
        this.infoText?.animate();
        this.applyButton.setVisible(true);

        if (gameState.loan.amount !== 0) {
          this.disableOptionButtons();
        }
      },
    });
  }

  private disableOptionButtons() {
    this.applyButton.disableInteractive().setAlpha(0.7);
    this.loan1Button.disableInteractive().setAlpha(0.7);
    this.loan2Button.disableInteractive().setAlpha(0.7);
    this.loan3Button.disableInteractive().setAlpha(0.7);
  }

  private enableOptionsButtons() {
    this.applyButton.setInteractive().setAlpha(1);
    this.loan1Button.setInteractive().setAlpha(1);
    this.loan2Button.setInteractive().setAlpha(1);
    this.loan3Button.setInteractive().setAlpha(1);
  }

  private getInfo(label: string) {
    if (label === 'loan1') {
      const infoText = this.infoTexts.loan1;
      return { amount: 2000, duration: 10, infoText, interestRate: 0.05 };
    }

    if (label === 'loan2') {
      const infoText = this.infoTexts.loan2;
      return { amount: 5000, duration: 20, infoText, interestRate: 0.1 };
    }

    if (label === 'loan3') {
      const infoText = this.infoTexts.loan3;
      return { amount: 10000, duration: 30, infoText, interestRate: 0.15 };
    }

    const infoText = this.initialInfoText;
    return { amount: 0, duration: 0, infoText, interestRate: 0 };
  }
}

export { LoanPanel };
