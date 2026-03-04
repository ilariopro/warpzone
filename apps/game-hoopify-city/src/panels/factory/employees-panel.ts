import Phaser from 'phaser';

import { simpleButton, PaginatedText } from '@warpzone/game-utils';
import { SlidePanel } from '../slide-panel';
import { buttonManager, EmployeeType, eventManager, gameState, styles } from '../../globals';

const infoText = {
  initial:
    'Build the dream team that will spin your hoops to greatness. Remember, behind every successful hoop is a motivated worker!',
  junior:
    'Young, enthusiastic, and budget friendly. A great starting point but may need guidance and lots of coffee.',
  middle:
    'Skilled and experienced enough to keep things moving smoothly. Dependable, steady, and always awake.',
  senior:
    'Industry veterans who can practically spin hoops in their sleep. Expensive but will skyrocket productivity.',
};

class EmployeesPanel extends SlidePanel {
  private infoTexts: Record<string, PaginatedText>;

  private juniorButton: Phaser.GameObjects.Container;
  private middleButton: Phaser.GameObjects.Container;
  private seniorButton: Phaser.GameObjects.Container;

  private juniorCount: Phaser.GameObjects.Text;
  private middleCount: Phaser.GameObjects.Text;
  private seniorCount: Phaser.GameObjects.Text;

  private juniorCost: Phaser.GameObjects.Text;
  private middleCost: Phaser.GameObjects.Text;
  private seniorCost: Phaser.GameObjects.Text;

  private fireButton: Phaser.GameObjects.Container;
  private hireButton: Phaser.GameObjects.Container;

  public constructor(scene: Phaser.Scene) {
    super(scene, infoText.initial);

    this.infoTexts = {
      junior: this.createInfoText(infoText.junior),
      middle: this.createInfoText(infoText.middle),
      senior: this.createInfoText(infoText.senior),
    };

    this.juniorButton = this.createOptionButton(152, 74, 'junior', 'Junior', 100);
    this.middleButton = this.createOptionButton(152, 134, 'junior', 'Middle', 150);
    this.seniorButton = this.createOptionButton(152, 194, 'junior', 'Senior', 200);

    const { junior, middle, senior } = gameState.employees;
    this.juniorCost = this.createText(296, 80, `${junior.salary * junior.count}`);
    this.middleCost = this.createText(296, 140, `${middle.salary * middle.count}`);
    this.seniorCost = this.createText(296, 200, `${senior.salary * senior.count}`);

    this.juniorCount = this.createText(430, 60, `${junior.count}`, 'right');
    this.middleCount = this.createText(430, 120, `${middle.count}`, 'right');
    this.seniorCount = this.createText(430, 180, `${senior.count}`, 'right');

    const details = [
      this.createText(296, 60, `Juniors:`),
      this.createText(365, 80, `/turn`),
      this.createMoneyIcon(425, 84),

      this.createText(296, 120, `Middles:`),
      this.createText(365, 140, `/turn`),
      this.createMoneyIcon(425, 144),

      this.createText(296, 180, `Seniors:`),
      this.createText(365, 200, `/turn`),
      this.createMoneyIcon(425, 204),
    ];

    this.fireButton = this.createActionButton(324, 250, 'Fire', () => this.fire());
    this.hireButton = this.createActionButton(406, 250, 'Hire', () => this.hire());

    this.createDetails();
    this.createTitle('Employees');

    const exitButton = this.createExitButton(() => this.setActionButtonVisibility(false));

    buttonManager.setButton('exitEmployees', exitButton);
    buttonManager.setButton('fire', this.fireButton);
    buttonManager.setButton('hire', this.hireButton);
    buttonManager.setButton('junior', this.juniorButton);
    buttonManager.setButton('middle', this.middleButton);
    buttonManager.setButton('senior', this.seniorButton);

    this.add([
      ...details,
      this.juniorButton,
      this.middleButton,
      this.seniorButton,
      this.juniorCount,
      this.middleCount,
      this.seniorCount,
      this.middleCost,
      this.juniorCost,
      this.seniorCost,
      this.fireButton,
      this.hireButton,
    ]);
  }

  private createOptionButton(x: number, y: number, image: string, label: string, price: number) {
    const container = this.scene.add.container(x, y);
    const background = this.scene.add.image(0, 0, 'buttonOption');

    return simpleButton(this.scene, {
      target: container.add([
        background,
        this.scene.add.image(-105, 0, image),
        this.scene.add.text(-90, -4, label, styles.panelButton),
        this.scene.add.text(15, -4, `${price}/turn`, styles.panelButton),
        this.createMoneyIcon(105, 0),
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
        this.setActionButtonVisibility(true);

        eventManager.emit('buttonPressed', this.selectedOption);
      },
    });
  }

  private fire() {
    eventManager.emit('buttonPressed', 'fire');
    gameState.fireEmployee(this.selectedOption as EmployeeType);
    this.updateDetails();
  }

  private hire() {
    eventManager.emit('buttonPressed', 'hire');
    gameState.hireEmployee(this.selectedOption as EmployeeType);
    this.updateDetails();
  }

  private getInfo(label: string) {
    if (label === 'junior') {
      return { infoText: this.infoTexts.junior };
    }

    if (label === 'middle') {
      return { infoText: this.infoTexts.middle };
    }

    if (label === 'senior') {
      return { infoText: this.infoTexts.senior };
    }

    return { infoText: this.initialInfoText };
  }

  private setActionButtonVisibility(visibile: boolean) {
    this.fireButton.setVisible(visibile);
    this.hireButton.setVisible(visibile);
  }

  private updateDetails() {
    const { junior, middle, senior } = gameState.employees;

    this.updateCounter(this.juniorCount, this.juniorCount.text, junior.count);
    this.updateCounter(this.middleCount, this.middleCount.text, middle.count);
    this.updateCounter(this.seniorCount, this.seniorCount.text, senior.count);

    this.updateCounter(this.juniorCost, this.juniorCost.text, junior.count * junior.salary);
    this.updateCounter(this.middleCost, this.middleCost.text, middle.count * middle.salary);
    this.updateCounter(this.seniorCost, this.seniorCost.text, senior.count * senior.salary);
  }
}

export { EmployeesPanel };
