import Phaser from 'phaser';

import { NineSlice } from './nine-slice';

type LineChartConfig = {
  borderColor?: number;
  background: { corner: number; image: string };
  containerX?: number;
  containerY?: number;
  fontStyle: Phaser.Types.GameObjects.Text.TextStyle;
  margin?: number | Partial<LineChartMargin>;
  windowSize?: number;
  width: number;
  height: number;
  xLabels?: number[];
  legend?: string;
  x?: number;
  y?: number;
};

type LineChartDataset = {
  name: string;
  color: number;
  data: number[];
};

type LineChartMargin = { top: number; bottom: number; left: number; right: number };

class LineChart extends Phaser.GameObjects.Container {
  private borderColor: number;
  private chartHeight: number;
  private chartWidth: number;
  private fontStyle: Phaser.Types.GameObjects.Text.TextStyle;
  private graphics: Phaser.GameObjects.Graphics;
  private datasets: LineChartDataset[];
  private xLabels: number[];
  private xLabelsText: Phaser.GameObjects.Text[] = [];
  private yLabelsText: Phaser.GameObjects.Text[] = [];
  private margin: LineChartMargin;
  private currentMaxValue = 5;
  private offset = 0;
  private windowSize: number;
  private lastPointerX = 0;
  private isDragging = false;
  private scrollVelocity = 0.5;

  public constructor(scene: Phaser.Scene, datasets: LineChartDataset[], config: LineChartConfig) {
    const { x = 0, y = 0, windowSize = 40 } = config;

    super(scene, x, y);
    scene.add.existing(this);
    scene.events.on(Phaser.Scenes.Events.UPDATE, this.createVisibleChart, this);

    this.datasets = datasets;
    this.margin = this.parseMargin(config.margin);
    this.xLabels = config.xLabels || [];
    this.graphics = scene.add.graphics();
    this.borderColor = config.borderColor ?? 0xffffff;
    this.fontStyle = config.fontStyle;
    this.width = config.width;
    this.height = config.height;
    this.chartHeight = this.height - this.margin.top - this.margin.bottom;
    this.chartWidth = this.width - this.margin.left - this.margin.right;
    this.windowSize = Math.floor(config.width / windowSize);

    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, this.width, this.height),
      Phaser.Geom.Rectangle.Contains
    );

    this.createBackground(config.background.corner, config.background.image);
    this.add(this.graphics);
    this.createMask(config.containerX, config.containerY);
    this.createBorder();
    this.createLegend(this.fontStyle, config.legend);
    this.setDraggableEvents();
  }

  public updateChart(datasets: LineChartDataset[], config: Partial<LineChartConfig>) {
    this.datasets = datasets;

    if (config.xLabels) {
      this.xLabels = config.xLabels;
      this.createXLabels(config.xLabels);
    }

    this.offset = this.getMaxOffset();
    this.createVisibleChart();
  }

  private createBackground(corner: number, image: string) {
    const background = new NineSlice(this.scene, this.width, this.height, corner, image, 0, 0);

    this.add(background);
  }

  private createBorder() {
    const border = this.scene.add
      .graphics()
      .lineStyle(1, this.borderColor, 1)
      .strokeRect(this.margin.left, this.margin.top, this.chartWidth, this.chartHeight);

    this.add(border);
  }

  private createLabels(maxValue: number) {
    const steps = 5;

    this.createGridLines(steps);

    // Disegna etichette e linee X
    const visibleXLabels = this.xLabels.slice(
      Math.floor(this.offset),
      Math.floor(this.offset) + this.windowSize
    );

    this.createXLabels(visibleXLabels);
    this.createYLabels(maxValue, steps);
  }

  private createGridLines(steps: number) {
    // x axis lines
    for (let i = 0; i <= this.windowSize; i++) {
      const x = this.margin.left + (i * this.chartWidth) / (this.windowSize - 1);
      this.graphics.lineStyle(1, this.borderColor, 0.3);
      this.graphics.moveTo(x, this.margin.top);
      this.graphics.lineTo(x, this.margin.top + this.chartHeight);
    }

    // y axis lines
    for (let i = 0; i <= steps; i++) {
      const y = this.margin.top + this.chartHeight - (i * this.chartHeight) / steps;
      this.graphics.lineStyle(1, this.borderColor, 0.3);
      this.graphics.moveTo(this.margin.left, y);
      this.graphics.lineTo(this.margin.left + this.chartWidth, y);
    }

    this.graphics.strokePath();
  }

  private createLegend(fontStyle: Phaser.Types.GameObjects.Text.TextStyle, legend?: string) {
    const legendY = this.height;
    let legendX = 10;

    this.datasets.forEach(({ name, color }) => {
      const rectSize = 8;
      const colorBox = this.scene.add
        .graphics()
        .fillStyle(color, 0.6)
        .fillRect(legendX, legendY - 17, rectSize, rectSize);

      const label = this.scene.add.text(legendX + 12, legendY, name, fontStyle).setOrigin(0, 2);
      this.add([colorBox, label]);

      legendX += label.width + rectSize + 16;
    });

    if (legend) {
      const text = this.scene.add
        .text(this.width - 10, this.height, legend, { ...this.fontStyle })
        .setOrigin(1, 2);

      const legendBackground = this.scene.add
        .rectangle(text.x + 4, text.y + 6, text.width + 8, text.height + 4, 0xffffff, 0.5)
        .setOrigin(1, 2);

      this.add([legendBackground, text]);
    }
  }

  private createMask(containerX = 0, containerY = 0) {
    const maskX = containerX + this.x + this.margin.left;
    const maskY = containerY + this.y + this.margin.top;
    const maskGraphics = this.scene.add
      .graphics()
      .fillStyle(0xffffff)
      .fillRect(maskX, maskY, this.chartWidth, this.chartHeight)
      .setVisible(false);

    const mask = maskGraphics.createGeometryMask();
    this.graphics.setMask(mask);
  }

  private createXLabels(labels: number[]) {
    labels.forEach((label, index) => {
      const x = this.margin.left + (index * this.chartWidth) / (this.windowSize - 1);
      const y = this.height - this.margin.bottom;

      if (this.xLabelsText[index]) {
        this.xLabelsText[index].setText(`${label}`).setPosition(x, y);
      } else {
        const text = this.scene.add.text(x, y, `${label}`, this.fontStyle).setOrigin(0.5, -1);
        this.add(text);
        this.xLabelsText.push(text);
      }
    });

    while (labels.length < this.xLabelsText.length) {
      this.xLabelsText.pop()?.destroy();
    }
  }

  private createYLabels(maxValue: number, steps: number) {
    const yLabels = Array.from({ length: steps + 1 }, (_, i) => ((maxValue / steps) * i).toFixed(0));

    yLabels.forEach((label, index) => {
      const x = this.margin.left - 5; // Allineamento a destra
      const y = this.margin.top + this.chartHeight - (index * this.chartHeight) / steps;

      if (this.yLabelsText[index]) {
        this.yLabelsText[index].setText(label).setPosition(x, y);
      } else {
        const text = this.scene.add.text(x, y, label, this.fontStyle).setOrigin(1, 0);
        this.add(text);
        this.yLabelsText.push(text);
      }
    });

    while (yLabels.length < this.yLabelsText.length) {
      this.yLabelsText.pop()?.destroy();
    }
  }

  private createVisibleChart() {
    const deceleration = 0.9;
    const stoppingThreshold = 0.01; // Velocità minima per fermare l'inerzia

    // Aggiorna l'offset se non stai trascinando (inerzia)
    if (!this.isDragging && Math.abs(this.scrollVelocity) > stoppingThreshold) {
      this.offset = Phaser.Math.Clamp(this.offset - this.scrollVelocity, 0, this.getMaxOffset());
      this.scrollVelocity *= deceleration; // Riduce gradualmente la velocità
    } else if (!this.isDragging) {
      this.scrollVelocity = 0; // Ferma completamente il movimento
    }

    this.graphics.clear();

    const visibleData = this.datasets.map((dataset) => this.getVisibleData(dataset.data));
    const maxVisibleValue = Math.max(...visibleData.flat());
    const targetMaxValue = maxVisibleValue < 5 ? 5 : maxVisibleValue;

    // Interpolazione fluida per il valore massimo
    this.currentMaxValue += (targetMaxValue - this.currentMaxValue) * 0.5;

    // Blocca la precisione della scala per evitare oscillazioni
    if (Math.abs(targetMaxValue - this.currentMaxValue) < 0.1) {
      this.currentMaxValue = targetMaxValue;
    }

    // Disegna gli assi e il dataset con la scala interpolata
    this.createLabels(this.currentMaxValue);

    this.datasets.forEach((dataset, index) => {
      this.drawChart(visibleData[index], dataset.color, this.currentMaxValue);
    });
  }

  private drawChart(data: number[], color: number, maxValue: number) {
    if (data.length < 2) return;

    const points = data.map((value, index) => ({
      x: this.margin.left + (index * this.chartWidth) / (this.windowSize - 1),
      y: this.margin.top + this.chartHeight - (value / maxValue) * this.chartHeight,
    }));

    this.graphics.lineStyle(2, color, 0.6).beginPath();

    points.forEach((point, index) => {
      if (index === 0) this.graphics.moveTo(point.x, point.y);
      else this.graphics.lineTo(point.x, point.y);
    });

    this.graphics.strokePath();
  }

  private getMaxOffset(): number {
    const maxDataLength = Math.max(...this.datasets.map((dataset) => dataset.data.length));
    return Math.max(0, maxDataLength - this.windowSize);
  }

  private getVisibleData(data: number[]): number[] {
    const start = Math.floor(this.offset);
    return data.slice(start, start + this.windowSize);
  }

  private isInternalPoint(x: number, y: number): boolean {
    return this.getBounds().contains(x, y);
  }

  private parseMargin(margin?: number | Partial<LineChartMargin>): LineChartMargin {
    if (typeof margin === 'number') {
      return { top: margin, bottom: margin, left: margin, right: margin };
    }
    return {
      top: margin?.top ?? 0,
      bottom: margin?.bottom ?? 0,
      left: margin?.left ?? 0,
      right: margin?.right ?? 0,
    };
  }

  private setDraggableEvents() {
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isInternalPoint(pointer.x, pointer.y)) {
        this.isDragging = true;
        this.lastPointerX = pointer.x;
        this.scrollVelocity = 0; // Resetta la velocità al momento del drag
      }
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging) {
        const deltaX = pointer.x - this.lastPointerX;
        this.lastPointerX = pointer.x;

        const step = (this.width - this.margin.left - this.margin.right) / this.windowSize;
        this.offset = Phaser.Math.Clamp(this.offset - deltaX / step, 0, this.getMaxOffset());
        this.scrollVelocity = deltaX / step; // Calcola la velocità attuale
      }
    });

    this.scene.input.on('pointerup', () => (this.isDragging = false));
  }
}

export { LineChart, type LineChartConfig, type LineChartDataset };
