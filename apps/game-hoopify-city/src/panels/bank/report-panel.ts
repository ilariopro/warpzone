import Phaser from 'phaser';

import { NineSlice } from '@warpzone/game-utils';
import { SlidePanel } from '../slide-panel';
import { eventManager, gameState, ShopType, styles } from '../../globals';

class ReportPanel extends SlidePanel {
  // sales
  private earningsPercentage: Record<ShopType, Phaser.GameObjects.Text>;
  private earnings: Record<ShopType, Phaser.GameObjects.Text>;
  private earningsIcons: Record<ShopType, Phaser.GameObjects.Image>;
  private salesPercentage: Record<ShopType, Phaser.GameObjects.Text>;
  private salesTexts: Record<ShopType, Phaser.GameObjects.Text>;
  private sales: Record<ShopType, Phaser.GameObjects.Text>;
  private salesIcons: Record<ShopType, Phaser.GameObjects.Image>;

  // expenses
  private employees: Phaser.GameObjects.Text;
  private marketingTexts: Record<ShopType, Phaser.GameObjects.Text>;
  private marketing: Record<ShopType, Phaser.GameObjects.Text>;
  private marketingIcons: Record<ShopType, Phaser.GameObjects.Image>;
  private loanTitle: Phaser.GameObjects.Text;
  private loanText: Phaser.GameObjects.Text;
  private loan: Phaser.GameObjects.Text;
  private loanIcon: Phaser.GameObjects.Image;

  private style: Partial<Phaser.GameObjects.TextStyle>;
  private subStyle: Partial<Phaser.GameObjects.TextStyle>;
  private greenStyle: Partial<Phaser.GameObjects.TextStyle>;
  private redStyle: Partial<Phaser.GameObjects.TextStyle>;

  private turnCounter = 1;

  public constructor(scene: Phaser.Scene) {
    super(scene);

    this.style = { ...styles.panelButton, fontSize: styles.chart.fontSize };
    this.subStyle = { ...this.style, color: styles.panelDetail.color };
    this.greenStyle = { ...this.style, color: '#00aa00' };
    this.redStyle = { ...this.style, color: '#ff0000' };

    const { market, shoppingCenter, temporaryShop } = gameState.sales;

    this.createSalesArea();
    this.createExpensesArea();

    this.salesTexts = {
      market: this.createText(36, 76, 'Market', 'left', this.style),
      shoppingCenter: this.createText(36, 143, 'Shopping Center', 'left', this.style),
      temporaryShop: this.createText(36, 213, 'Temporary Shop', 'left', this.style),
    };

    const marketSales = market.trend[market.trend.length - 1];
    const shoppingCenterSales = shoppingCenter.trend[shoppingCenter.trend.length - 1];
    const temporaryShopSales = temporaryShop.trend[temporaryShop.trend.length - 1];

    this.salesPercentage = {
      market: this.createText(36, 95, '', 'left', this.greenStyle),
      shoppingCenter: this.createText(36, 164, '', 'left', this.greenStyle),
      temporaryShop: this.createText(36, 234, '', 'left', this.greenStyle),
    };

    this.sales = {
      market: this.createText(200, 95, `${marketSales}`, 'right', this.subStyle),
      shoppingCenter: this.createText(200, 164, `${shoppingCenterSales}`, 'right', this.subStyle),
      temporaryShop: this.createText(200, 234, `${temporaryShopSales}`, 'right', this.subStyle),
    };

    this.salesIcons = {
      market: this.createHulaHoopIcon(214, 99),
      shoppingCenter: this.createHulaHoopIcon(214, 168),
      temporaryShop: this.createHulaHoopIcon(214, 238),
    };

    const marketEarnings = market.earnings[market.earnings.length - 1];
    const shoppingCenterEarnings = shoppingCenter.earnings[shoppingCenter.earnings.length - 1];
    const temporaryShopEarnings = temporaryShop.earnings[temporaryShop.earnings.length - 1];

    this.earningsPercentage = {
      market: this.createText(36, 112, '', 'left', this.greenStyle),
      shoppingCenter: this.createText(36, 180, '', 'left', this.greenStyle),
      temporaryShop: this.createText(36, 250, '', 'left', this.greenStyle),
    };

    this.earnings = {
      market: this.createText(200, 112, `${marketEarnings}`, 'right', this.subStyle),
      shoppingCenter: this.createText(200, 180, `${shoppingCenterEarnings}`, 'right', this.subStyle),
      temporaryShop: this.createText(200, 250, `${temporaryShopEarnings}`, 'right', this.subStyle),
    };

    this.earningsIcons = {
      market: this.createMoneyIcon(214, 115),
      shoppingCenter: this.createMoneyIcon(214, 183),
      temporaryShop: this.createMoneyIcon(214, 253),
    };

    this.createSeparator(36, 134, 186);
    this.createSeparator(36, 202, 186);

    const employeeText = this.createText(248, 76, 'Employees', 'left', this.style);
    this.employees = this.createText(410, 95, `${gameState.employees.salaries}`, 'right', this.subStyle);

    const salaryText = this.createText(248, 95, 'Salaries:', 'left', this.subStyle);
    const employeeIcon = this.createMoneyIcon(425, 98);

    const marketingTitle = this.createText(248, 126, 'Marketing', 'left', this.style);

    this.marketingTexts = {
      market: this.createText(248, 148, 'Market:', 'left', this.subStyle),
      shoppingCenter: this.createText(248, 164, 'Shopping Center:', 'left', this.subStyle),
      temporaryShop: this.createText(248, 180, 'Temporary Shop:', 'left', this.subStyle),
    };

    this.marketing = {
      market: this.createText(410, 148, `${gameState.employees.salaries}`, 'right', this.subStyle),
      shoppingCenter: this.createText(410, 164, `${gameState.employees.salaries}`, 'right', this.subStyle),
      temporaryShop: this.createText(410, 180, `${gameState.employees.salaries}`, 'right', this.subStyle),
    };

    this.marketingIcons = {
      market: this.createMoneyIcon(425, 151),
      shoppingCenter: this.createMoneyIcon(425, 167),
      temporaryShop: this.createMoneyIcon(425, 183),
    };

    this.loanTitle = this.createText(248, 213, 'Loan', 'left', this.style);
    this.loanText = this.createText(248, 234, 'Installment:', 'left', this.subStyle);
    this.loan = this.createText(410, 234, `${gameState.getInstallment()}`, 'right', this.subStyle);
    this.loanIcon = this.createMoneyIcon(425, 237);

    this.createSeparator(248, 116, 186);
    this.createSeparator(248, 202, 186);

    this.createTitle('Report');
    this.createExitButton(() => this.closeReport());

    this.add([
      ...Object.values(this.salesIcons),
      ...Object.values(this.earningsIcons),
      ...Object.values(this.salesTexts),
      ...Object.values(this.earningsPercentage),
      ...Object.values(this.salesPercentage),
      ...Object.values(this.earnings),
      ...Object.values(this.sales),
      employeeText,
      employeeIcon,
      salaryText,
      this.employees,
      marketingTitle,
      ...Object.values(this.marketingTexts),
      ...Object.values(this.marketing),
      ...Object.values(this.marketingIcons),
      this.loanTitle,
      this.loanText,
      this.loan,
      this.loanIcon,
    ]);
  }

  public open() {
    const shops: ShopType[] = ['market', 'shoppingCenter', 'temporaryShop'];

    shops.forEach((shop) => {
      const sales = gameState.sales[shop];
      const marketing = gameState.marketing[shop];
      const marketingValue = `${marketing.totalBudget > 0 ? '-' : ''}${marketing.totalBudget}`;
      const marketingStyle = this.getStyle(marketingValue);
      const earningsPercentage = this.getPercentage(sales.earnings);
      const salesPercentage = this.getPercentage(sales.trend);
      const earningsStyle = this.getStyle(earningsPercentage);
      const salesStyle = this.getStyle(salesPercentage);
      const shopEarnings = sales.earnings[sales.earnings.length - 1];
      const shopSales = sales.trend[sales.trend.length - 1];
      const shopAlpha = gameState.isShopActive(shop) ? 1 : 0.7;

      this.earningsPercentage[shop].setText(earningsPercentage).setAlpha(shopAlpha).setStyle(earningsStyle);
      this.earnings[shop].setText(`${shopEarnings}`).setAlpha(shopAlpha);
      this.salesPercentage[shop].setText(salesPercentage).setAlpha(shopAlpha).setStyle(salesStyle);
      this.sales[shop].setText(`${shopSales}`).setAlpha(shopAlpha);
      this.earningsIcons[shop].setAlpha(shopAlpha);
      this.salesIcons[shop].setAlpha(shopAlpha);
      this.salesTexts[shop].setAlpha(shopAlpha);

      this.marketingTexts[shop].setAlpha(shopAlpha);
      this.marketing[shop].setText(marketingValue).setAlpha(shopAlpha).setStyle(marketingStyle);
      this.marketingIcons[shop].setAlpha(shopAlpha);
    });

    const employeeValue = `${gameState.employees.salaries > 0 ? '-' : ''}${gameState.employees.salaries}`;
    const employeeStyle = this.getStyle(employeeValue);

    this.employees.setText(employeeValue).setStyle(employeeStyle);

    const loanValue = `${gameState.getInstallment() > 0 ? '-' : ''}${gameState.getInstallment()}`;
    const loanAlpha = !gameState.canApplyForLoan() ? 1 : 0.7;
    const loanStyle = this.getStyle(loanValue);

    this.loanTitle.setAlpha(loanAlpha);
    this.loanText.setAlpha(loanAlpha);
    this.loan.setText(loanValue).setAlpha(loanAlpha).setStyle(loanStyle);
    this.loanIcon.setAlpha(loanAlpha);

    super.open();
  }

  private createHulaHoopIcon(x: number, y: number) {
    return this.scene.add.image(x, y, 'hulaHoopSmall').setScale(0.8);
  }

  private closeReport() {
    if (this.turnCounter < gameState.turn) {
      this.turnCounter++;
      eventManager.emit('closeReport');
    }
  }

  private getPercentage(values: number[]) {
    if (values.length < 2) return '';

    const prev = values.length > 1 ? values[values.length - 2] : values[0];
    const current = values[values.length - 1];
    const change = prev === 0 ? current * 100 : ((current - prev) / prev) * 100;
    const percentage = change % 1 === 0 ? change.toFixed(0) : change.toFixed(1);

    return change >= 0 ? `+${percentage}%` : `${percentage}%`;
  }

  private getStyle(percentage: string) {
    if (percentage === '0') {
      return this.subStyle;
    }

    return percentage.startsWith('+') ? this.greenStyle : this.redStyle;
  }

  private createSalesArea() {
    const background = new NineSlice(this.scene, 202, 206, 8, 'panelDetail', 28, 66);
    const text = this.createText(28, 50, 'Sales', 'left', styles.panelButton);

    this.add([background, text]);
  }

  private createExpensesArea() {
    const background = new NineSlice(this.scene, 202, 206, 8, 'panelDetail', 240, 66);
    const text = this.createText(240, 50, 'Expenses', 'left', styles.panelButton);

    this.add([background, text]);
  }

  private createSeparator(x: number, y: number, width: number) {
    const line = this.scene.add
      .graphics()
      .lineStyle(1, 0x333333, 0.2)
      .moveTo(x, y)
      .lineTo(x + width, y)
      .strokePath();

    this.add(line);
  }
}

export { ReportPanel };
