import Phaser from 'phaser';

import { BaseTutorial, InputBlocker } from '@warpzone/game-utils';
import { buttonManager, eventManager, gameState, panelManager } from '../globals';
import { BalanceTutorial, MarketingTutorial, WelcomeTutorial } from '../tutorials';
import { HintCursor, SpotlightOverlay } from '../ui';

class TutorialScene extends Phaser.Scene {
  private currentTutorial: string | null = null;
  private hintCursor!: HintCursor;
  private isTilemapReady = false;
  private skipCountdownTimerClick = false;
  private spotlight!: SpotlightOverlay;
  private tutorials!: Record<string, BaseTutorial>;

  public constructor() {
    super({ key: 'tutorialScene' });
  }

  public init() {
    this.scene.moveAbove('panelScene');
  }

  public preload() {
    this.load.image('hintCursor', 'assets/hint-cursor.png');
  }

  public create() {
    new InputBlocker(this); // input blocker

    this.hintCursor = new HintCursor(this);
    this.spotlight = new SpotlightOverlay(this);

    this.spotlight.follow(this.hintCursor);

    this.tutorials = {
      welcome: new WelcomeTutorial(this, this.hintCursor),
      marketing: new MarketingTutorial(this, this.hintCursor),
      balance: new BalanceTutorial(this, this.hintCursor),
    };

    eventManager.on('dispatchActions', () => (this.skipCountdownTimerClick = true));
    eventManager.on('buttonPressed', (key) => this.buttonPressed(key));
    eventManager.on('cancelTutorial', () => this.cancelTutorial());
    eventManager.on('nextTutorialStep', () => this.nextTutorialStep());
    eventManager.on('resetTimer', () => this.hintCursor.unlock());
    eventManager.on('skipTutorial', () => this.skipTutorial());
    eventManager.on('tilemapReady', () => (this.isTilemapReady = true));

    this.events.on('enableSpotlight', () => this.spotlight.enable());
    this.events.on('disableSpotlight', () => this.spotlight.disable());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(_time: number, _delta: number) {
    if (this.currentTutorial) {
      if (panelManager.getCurrentKey() === 'settings') {
        this.hintCursor.hide();
      }

      if (panelManager.getLastKey() === 'settings' && !this.hintCursor.visible) {
        panelManager.reset();
        this.hintCursor.show({ delay: 170 });
      }

      if (this.skipCountdownTimerClick) {
        this.skipCountdownTimerClick = false;
        this.skipHintCursor();
      }
    } else {
      if (this.hasTutorial() && this.isTilemapReady && panelManager.getCurrentKey() === null) {
        this.currentTutorial = gameState.getTutorial() as string;
        this.tutorials[this.currentTutorial].start();
      }
    }
  }

  private buttonPressed(key: string) {
    if (this.getCurrentTutorial()?.getCurrentStep() === key) {
      buttonManager.lockButtons();
      this.nextTutorialStep();
    }
  }

  private cancelTutorial() {
    buttonManager.unlockButtons();
    gameState.cancelTutorial();
    this.currentTutorial = null;
  }

  private skipTutorial() {
    buttonManager.unlockButtons();
    gameState.skipTutorial();
    this.currentTutorial = null;
    this.scene.sleep();
  }

  private getCurrentTutorial() {
    return this.currentTutorial ? this.tutorials[this.currentTutorial] : null;
  }

  private hasTutorial() {
    return gameState.hasTutorial() && (gameState.getTutorial() as string) in this.tutorials;
  }

  private nextTutorialStep() {
    const currentTutorial = this.getCurrentTutorial();

    if (currentTutorial) {
      eventManager.emit('draggableScene', false);
      currentTutorial.nextStep();
    }
  }

  private skipHintCursor() {
    if (this.getCurrentTutorial()?.getCurrentStep() === 'countdownTimer') {
      this.hintCursor.hide();
      this.hintCursor.lock();
      this.nextTutorialStep();
    }
  }
}

export { TutorialScene };
