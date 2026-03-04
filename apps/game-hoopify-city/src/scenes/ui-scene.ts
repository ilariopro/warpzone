import Phaser from 'phaser';

import { simpleButton } from '@warpzone/game-utils';
import {
  buttonManager,
  buttons,
  cameraMovements,
  eventManager,
  gameState,
  locationManager,
  panelManager,
  ShopType,
  titleManager,
} from '../globals';
import {
  CountdownTimer,
  ProductCounter,
  MoneyCounter,
  ResourceCounter,
  TimeScaleButton,
  TurnCounter,
} from '../ui';

class UiScene extends Phaser.Scene {
  private countdownTimer!: CountdownTimer;
  private moneyCounter!: MoneyCounter;
  private productCounter!: ProductCounter;
  private resourceCounter!: ResourceCounter;
  private timeScaleButton!: TimeScaleButton;
  private turnCounter!: TurnCounter;
  private shopIndex = 0;

  public constructor() {
    super({ key: 'uiScene' });
  }

  public preload() {
    this.load.audio('countdownTimer', 'assets/countdown-timer.mp3');

    this.load.image('bank', 'assets/button-bank.png');
    this.load.image('buttonTimeScale', 'assets/button-time-scale.png');
    this.load.image('countdownTimer', 'assets/timer.png');
    this.load.image('hulaHoopSmall', 'assets/hula-hoop-small.png');
    this.load.image('moneySmall', 'assets/money-small.png');
    this.load.image('factory', 'assets/button-factory.png');
    this.load.image('shop', 'assets/button-shop.png');
  }

  public create() {
    const buttonClick = this.sound.add('buttonClick').setVolume(0.6);

    const settings = simpleButton(this, {
      sound: buttonClick,
      target: this.add.image(buttons.settings.x, buttons.settings.y, 'settings'),
      onPointerdown: () => this.buttonEvents('settings'),
    });

    const news = simpleButton(this, {
      sound: buttonClick,
      target: this.add.image(buttons.news.x, buttons.news.y, 'news'),
      onPointerdown: () => this.buttonEvents('news'),
    });

    const factory = simpleButton(this, {
      sound: buttonClick,
      target: this.add.image(buttons.factory.x, buttons.factory.y, 'factory'),
      onPointerdown: () => this.locationButtonEvents('factory'),
    });

    const shop = simpleButton(this, {
      sound: buttonClick,
      target: this.add.image(buttons.shop.x, buttons.shop.y, 'shop'),
      onPointerdown: () => this.shopButtonEvents(),
    });

    const bank = simpleButton(this, {
      sound: buttonClick,
      target: this.add.image(buttons.bank.x, buttons.bank.y, 'bank'),
      onPointerdown: () => this.locationButtonEvents('bank'),
    });

    const skipAnimations = new TimeScaleButton(this);

    this.timeScaleButton = simpleButton(this, {
      sound: buttonClick,
      target: skipAnimations,
      width: skipAnimations.width,
      heigth: skipAnimations.height,
      onPointerdown: () => {
        this.timeScaleButton.changeTimeScale();

        eventManager.emit('changeTimeScale', this.timeScaleButton.getTimeScale());
      },
    });

    this.moneyCounter = new MoneyCounter(this);
    this.productCounter = new ProductCounter(this);
    this.countdownTimer = new CountdownTimer(this, 120); // 2 minutes
    this.resourceCounter = new ResourceCounter(this);
    this.turnCounter = new TurnCounter(this);

    buttonManager.setButton('bank', bank);
    buttonManager.setButton('countdownTimer', this.countdownTimer);
    buttonManager.setButton('factory', factory);
    buttonManager.setButton('settings', settings);
    buttonManager.setButton('shop', shop);
    buttonManager.setButton('news', news);

    eventManager.on('closeReport', () => this.refreshUi());
    eventManager.on('dispatchActions', () => this.timeScaleButton.show());
    eventManager.on('openPanel', (key) => panelManager.openPanel(key));
    eventManager.on('pauseTimer', () => this.countdownTimer.pause());
    eventManager.on('resetTimer', () => this.countdownTimer.reset());
    eventManager.on('resumeTimer', () => this.countdownTimer.resume());
    eventManager.on('tilemapReady', () => this.startCountdownTimer());
    eventManager.on('updateBudgetCounter', (onComplete) => this.moneyCounter.update(onComplete));
    eventManager.on('updateProductCounter', (onComplete) => this.productCounter.update(onComplete));
    eventManager.on('updateResourceCounter', (onComplete) => this.resourceCounter.update(onComplete));
  }

  private buttonEvents(key: string) {
    eventManager.emit('buttonPressed', key);

    panelManager.openPanel(key);
  }

  private locationButtonEvents(key: keyof typeof cameraMovements) {
    eventManager.emit('moveCamera', cameraMovements[key].x, cameraMovements[key].y);
    eventManager.emit('buttonPressed', key);

    locationManager.openPanel(key);
    titleManager.openPanel(key);
  }

  private refreshUi() {
    if (!this.countdownTimer.isRunning()) {
      this.countdownTimer.restart();
    }

    if (this.turnCounter.getTurnCount() !== gameState.turn) {
      this.turnCounter.update();
    }

    this.timeScaleButton.hide();
  }

  private shopButtonEvents() {
    const openedLocationKey = locationManager.getCurrentKey() as ShopType;
    const shopIndex = openedLocationKey ? gameState.shops.active.indexOf(openedLocationKey) : -1;

    if (shopIndex !== -1) {
      this.shopIndex = (shopIndex + 1) % gameState.shops.active.length;
    } else {
      this.shopIndex = 0;
    }

    const shopName = gameState.shops.active[this.shopIndex];

    if (shopName) {
      eventManager.emit('moveCamera', cameraMovements[shopName].x, cameraMovements[shopName].y);
      eventManager.emit('buttonPressed', shopName);
      locationManager.openPanel(shopName);
      titleManager.openPanel(shopName);
    }

    this.shopIndex++;
  }

  private startCountdownTimer() {
    this.countdownTimer.start();
  }
}

export { UiScene };
