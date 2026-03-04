import Phaser from 'phaser';

import { InputBlocker } from '@warpzone/game-utils';
import { chartManager, eventManager, locationManager, panelManager, titleManager } from '../globals';
import {
  BankPanel,
  EmployeesPanel,
  FactoryLocationPanel,
  GameOverPanel,
  GameTitlePanel,
  LoanPanel,
  MarketingPanel,
  NewsPanel,
  NotificationPanel,
  ReportPanel,
  ResourcesPanel,
  SalesChartPanel,
  SalesPanel,
  SettingsPanel,
  ShopPanel,
  StoreUnlocked,
  TitlePanel,
} from '../panels';

class PanelScene extends Phaser.Scene {
  private notifications!: Record<string, NotificationPanel>;

  public constructor() {
    super({ key: 'panelScene' });
  }

  public preload() {
    this.load.image('buttonAction', 'assets/button-action.png');
    this.load.image('buttonExit', 'assets/button-exit.png');
    this.load.image('buttonOption', 'assets/button-option.png');
    this.load.image('panelDetail', 'assets/panel-detail.png');
    this.load.image('panelPrimary', 'assets/panel-primary.png');
    this.load.image('panelSecondary', 'assets/panel-secondary.png');
    this.load.image('panelTitle', 'assets/panel-title.png');

    this.load.image('iconBank', 'assets/icon-bank.png');
    this.load.image('iconFactory', 'assets/icon-factory.png');
    this.load.image('iconShop', 'assets/icon-shop.png');

    this.load.image('iconChart', 'assets/icon-chart.png');
    this.load.image('junior', 'assets/static-human-1.png');
    this.load.image('hulaHoopSmall', 'assets/hula-hoop-small.png');
    this.load.image('moneySmall', 'assets/money-small.png');
    this.load.image('resource', 'assets/resource.png');
  }

  public init() {
    this.scene.moveAbove('uiScene');
  }

  public create() {
    // locations
    locationManager.setPanel('bank', new BankPanel(this));
    locationManager.setPanel('factory', new FactoryLocationPanel(this));
    locationManager.setPanel('market', new ShopPanel(this, 'market'));
    locationManager.setPanel('shoppingCenter', new ShopPanel(this, 'shoppingCenter'));
    locationManager.setPanel('temporaryShop', new ShopPanel(this, 'temporaryShop'));

    // titles
    titleManager.setPanel('bank', new TitlePanel(this, 'Bank', 'iconBank'));
    titleManager.setPanel('factory', new TitlePanel(this, 'Factory', 'iconFactory'));
    titleManager.setPanel('market', new TitlePanel(this, 'Market', 'iconShop'));
    titleManager.setPanel('shoppingCenter', new TitlePanel(this, 'Shopping Center', 'iconShop'));
    titleManager.setPanel('temporaryShop', new TitlePanel(this, 'Temporary Shop', 'iconShop'));

    new InputBlocker(this); // input blocker

    // factory
    panelManager.setPanel('employees', new EmployeesPanel(this));
    panelManager.setPanel('resources', new ResourcesPanel(this));

    // bank
    panelManager.setPanel('loan', new LoanPanel(this));
    panelManager.setPanel('report', new ReportPanel(this));

    // shops
    panelManager.setPanel('marketMarketing', new MarketingPanel(this, 'market'));
    panelManager.setPanel('marketSales', new SalesPanel(this, 'market'));
    panelManager.setPanel('shoppingCenterMarketing', new MarketingPanel(this, 'shoppingCenter'));
    panelManager.setPanel('shoppingCenterSales', new SalesPanel(this, 'shoppingCenter'));
    panelManager.setPanel('temporaryShopMarketing', new MarketingPanel(this, 'temporaryShop'));
    panelManager.setPanel('temporaryShopSales', new SalesPanel(this, 'temporaryShop'));

    // other
    panelManager.setPanel('gameOver', new GameOverPanel(this));
    panelManager.setPanel('gameTitle', new GameTitlePanel(this));
    panelManager.setPanel('settings', new SettingsPanel(this));
    panelManager.setPanel('news', new NewsPanel(this));

    // charts
    chartManager.setPanel('marketTrend', new SalesChartPanel(this, 'market'));

    // notifications
    this.notifications = {
      shoppingCenterUnlocked: new StoreUnlocked(this, 'shoppingCenter'),
    };

    panelManager.setPanel('shoppingCenterUnlocked', this.notifications.shoppingCenterUnlocked);

    eventManager.on('closeReport', () => this.notify());
  }

  private notify() {
    chartManager.closePanel();
    panelManager.closePanel();
    locationManager.closePanel();
    titleManager.closePanel();

    eventManager.emit('playMusic', 'main');

    for (const key in this.notifications) {
      if (this.notifications[key].isReady()) {
        panelManager.openPanel(key);
      }
    }
  }
}

export { PanelScene };
