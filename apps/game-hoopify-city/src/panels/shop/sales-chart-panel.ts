import Phaser from 'phaser';

import { LineChart } from '@warpzone/game-utils';
import { numberSequence } from '@warpzone/shared-utils';
import { ChartPanel } from '../chart-panel';
import { gameState, ShopType, styles } from '../../globals';

const infoText =
  'Take a close look at your sales data: is your business skyrocketing or heading for a crash?';

class SalesChartPanel extends ChartPanel {
  private lineChart: LineChart;
  private shop: ShopType;

  public constructor(scene: Phaser.Scene, shop: ShopType) {
    super(scene, infoText);
    this.shop = shop;

    this.createTitle('Sales');
    this.createExitButton();

    const shopData = gameState.marketing[this.shop];
    const datasets = [
      { name: 'Traditional', color: 0xff0000, data: shopData.traditional.trend },
      { name: 'Digital', color: 0x00aa00, data: shopData.digital.trend },
      { name: 'Influencer', color: 0x00aaff, data: shopData.influencer.trend },
    ];

    const config = {
      background: { corner: 8, image: 'panelDetail' },
      borderColor: 0x666666,
      containerX: this.x,
      containerY: this.y,
      fontStyle: styles.chart,
      margin: {
        top: 40,
        left: 25, // sales < 100 ? 25 : sales > 99 ? 35 : sales > 999 ? 45
        bottom: 40,
        right: 20,
      },
      xLabels: numberSequence(0, gameState.turn),
      legend: 'x: sales   y: turns',
      width: this.width - 26 * 2,
      height: 170,
      x: 26,
      y: 49,
    };

    this.lineChart = new LineChart(scene, datasets, config);
    this.add(this.lineChart);
    this.createChartTitle(35, 65, 'Marketing Campaign Conversions');
  }

  public open() {
    const shopData = gameState.marketing[this.shop];
    const xLabels = numberSequence(0, gameState.turn);
    const datasets = [
      { name: 'Traditional', color: 0xff0000, data: shopData.traditional.trend },
      { name: 'Digital', color: 0x00aa00, data: shopData.digital.trend },
      { name: 'Influencer', color: 0x00aaff, data: shopData.influencer.trend },
    ];

    this.lineChart.updateChart(datasets, { xLabels });
    super.open();
  }
}

export { SalesChartPanel };
