import Phaser from 'phaser';

type PieChartConfig = {
  radius: number;
  borderColor?: number;
  fontStyle: Phaser.Types.GameObjects.Text.TextStyle;
  legendX: number;
  legendY: number;
  x?: number;
  y?: number;
};

type PieChartDataset = {
  name: string;
  color: number;
  data: number;
};

class PieChart extends Phaser.GameObjects.Container {
  private borderColor: number;
  private datasets: PieChartDataset[];
  private fontStyle: Phaser.Types.GameObjects.Text.TextStyle;
  private legendContainer!: Phaser.GameObjects.Container;
  private legendX: number;
  private legendY: number;
  private radius: number;

  constructor(scene: Phaser.Scene, datasets: PieChartDataset[], config: PieChartConfig) {
    const { x = 0, y = 0 } = config;
    super(scene, x, y);
    scene.add.existing(this);

    this.borderColor = config.borderColor ?? 0xffffff;
    this.datasets = datasets;
    this.legendX = config.legendX;
    this.legendY = config.legendY;
    this.fontStyle = config.fontStyle;
    this.radius = config.radius;

    this.createChart();
    this.createLegend();
  }

  public updateChart(datasets: PieChartDataset[]) {
    this.datasets = datasets;

    this.createChart();
    this.createLegend();
  }

  private createChart() {
    const total = this.datasets.reduce((sum, item) => sum + item.data, 0);

    let startAngle = -Math.PI / 2; // inizia da 12:00
    this.datasets.forEach((item) => {
      const sliceAngle = (item.data / total) * Math.PI * 2;

      const graphics = this.scene.add
        .graphics()
        .fillStyle(item.color, 1)
        .slice(0, 0, this.radius, startAngle, startAngle + sliceAngle, false)
        .fillPath()
        .lineStyle(1, this.borderColor, 1)
        .strokePath();

      this.add(graphics);
      startAngle += sliceAngle; // aggiorna l'angolo di partenza
    });
  }

  private createLegend() {
    this.legendContainer?.destroy();
    this.legendContainer = this.scene.add.container(this.legendX, this.legendY);

    let offsetX = 8;

    this.datasets.forEach((item, index) => {
      const legendY = index * 16;
      const rectSize = 8;
      const colorBox = this.scene.add.rectangle(0, legendY, rectSize, rectSize, item.color);
      const label = this.scene.add.text(10, legendY, item.name, this.fontStyle);

      if (label.width > offsetX) {
        offsetX += label.width;
      }

      const total = this.datasets.reduce((sum, item) => sum + item.data, 0);
      const percentageText = `${((item.data / total) * 100).toFixed(1) + '%'}`;
      const percentage = this.scene.add.text(label.x + offsetX, legendY - 4, percentageText, this.fontStyle);

      label.setOrigin(0, 0.5); // Allinea il testo verticalmente
      this.legendContainer.add([colorBox, label, percentage]);
    });

    this.add(this.legendContainer);
  }
}

export { PieChart, type PieChartConfig, type PieChartDataset };
