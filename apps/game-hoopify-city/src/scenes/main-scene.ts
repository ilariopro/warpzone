import Phaser from 'phaser';

import { ActionQueue, createAnimatedTiles, DraggableScene } from '@warpzone/game-utils';
import { CustomerAnimation, DeliveryAnimation, FactoryAnimation, WalkingAnimation } from '../animations';
import {
  buttonManager,
  chartManager,
  depths,
  eventManager,
  gameState,
  locationManager,
  npcWalking,
  panelManager,
  PhaserSound,
  tilesets,
  titleManager,
} from '../globals';

class MainScene extends DraggableScene {
  private actionQueue!: ActionQueue;

  private currentMusic: PhaserSound | null = null;
  private music!: Record<string, PhaserSound>;

  private customerAnimation!: CustomerAnimation;
  private deliveryAnimation!: DeliveryAnimation;
  private factoryAnimation!: FactoryAnimation;
  private npcWalking: WalkingAnimation[] = [];

  private tilemap!: Phaser.Tilemaps.Tilemap;
  private tilesets: Phaser.Tilemaps.Tileset[] = [];

  private canDispatch: 'yes' | 'no' | 'wait' = 'no';
  private clickPosition: { x: number; y: number } | null = null;
  private currentTimeScale = 1;
  private currentTurn: number;

  public constructor() {
    super({ key: 'mainScene' });

    this.currentTurn = gameState.turn;
  }

  public preload() {
    this.load.audio('dispatchMusic', 'assets/dispatch-music.mp3');
    this.load.audio('mainMusic', 'assets/main-music.mp3');

    this.load.image('factoryImage', 'assets/factory.png');
    this.load.image('soapBubble', 'assets/soap-bubble.png');

    // npc
    this.loadSpritesheet('npc1', 'assets/human-1.png', 16, 25);
    this.loadSpritesheet('npc2', 'assets/human-2.png', 16, 24);
    this.loadSpritesheet('npc3', 'assets/human-3.png', 16, 23);
    this.loadSpritesheet('npc4', 'assets/human-4.png', 16, 25);
    this.loadSpritesheet('npc5', 'assets/human-5.png', 16, 23);
    this.loadSpritesheet('npc6', 'assets/human-6.png', 16, 25);
    this.loadSpritesheet('npc7', 'assets/human-7.png', 16, 23);
    this.loadSpritesheet('npc8', 'assets/human-8.png', 16, 25);
    this.loadSpritesheet('npc9', 'assets/human-9.png', 16, 23);
    this.loadSpritesheet('npc10', 'assets/human-10.png', 16, 23);

    // customers
    this.loadSpritesheet('marketCustomer1', 'assets/human-7.png', 16, 23);
    this.loadSpritesheet('marketCustomer1HulaHoop', 'assets/human-7-hula-hoop.png', 22, 22);
    this.loadSpritesheet('marketCustomer2', 'assets/kid-1.png', 16, 21);
    this.loadSpritesheet('marketCustomer2HulaHoop', 'assets/kid-1-hula-hoop.png', 22, 20);
    this.loadSpritesheet('marketCustomer3', 'assets/kid-2.png', 16, 20);
    this.loadSpritesheet('marketCustomer3HulaHoop', 'assets/kid-2-hula-hoop.png', 22, 19);
    this.loadSpritesheet('marketCustomer4', 'assets/human-6.png', 16, 25);
    this.loadSpritesheet('marketCustomer4HulaHoop', 'assets/human-6-hula-hoop.png', 22, 24);
    this.loadSpritesheet('marketCustomer5', 'assets/kid-3.png', 16, 20);
    this.loadSpritesheet('marketCustomer5HulaHoop', 'assets/kid-3-hula-hoop.png', 22, 19);
    this.loadSpritesheet('marketCustomer6', 'assets/kid-4.png', 16, 20);
    this.loadSpritesheet('marketCustomer6HulaHoop', 'assets/kid-4-hula-hoop.png', 22, 19);
    this.loadSpritesheet('marketCustomer7', 'assets/human-10.png', 16, 23);
    this.loadSpritesheet('marketCustomer7HulaHoop', 'assets/human-10-hula-hoop.png', 22, 22);
    this.loadSpritesheet('marketCustomer8', 'assets/kid-5.png', 16, 20);
    this.loadSpritesheet('marketCustomer8HulaHoop', 'assets/kid-5-hula-hoop.png', 22, 19);
    this.loadSpritesheet('marketCustomer9', 'assets/kid-6.png', 16, 21);
    this.loadSpritesheet('marketCustomer9HulaHoop', 'assets/kid-6-hula-hoop.png', 22, 20);

    // delivery
    this.loadSpritesheet('deliveryMan', 'assets/delivery-man.png', 16, 26);
    this.loadSpritesheet('staticDeliveryVan', 'assets/static-delivery-van.png', 144, 144);
    this.loadSpritesheet('movingDeliveryVan', 'assets/moving-delivery-van.png', 144, 144);

    this.load.tilemapTiledJSON('tilemap', 'assets/tilemap.json');
  }

  public init() {
    super.init();
  }

  public create() {
    this.music = {
      dispatch: this.sound.add('dispatchMusic', { loop: true }),
      main: this.sound.add('mainMusic', { loop: true }),
    };

    this.playMusic('main');

    this.tilemap = this.make.tilemap({
      key: 'tilemap',
      tileWidth: 16,
      tileHeight: 16,
      width: 80,
      height: 45,
    });

    tilesets.forEach((tilesetData) => {
      const tileset = this.tilemap.addTilesetImage(tilesetData.tileset, tilesetData.key);
      this.tilesets.push(tileset as Phaser.Tilemaps.Tileset);
    });

    this.tilemap.createLayer('terrains', this.tilesets)?.setDepth(depths.terrains);
    this.tilemap.createLayer('below', this.tilesets)?.setDepth(depths.below);
    this.tilemap.createLayer('buildings', this.tilesets)?.setDepth(depths.buildings);

    npcWalking.forEach((npcData) => {
      const npc = new WalkingAnimation(this, {
        path: npcData.path,
        textureKey: npcData.textureKey,
        x: npcData.x,
        y: npcData.y,
      });

      npc.followCyclicPath();
      this.npcWalking.push(npc);
    });

    this.deliveryAnimation = new DeliveryAnimation(this);
    this.factoryAnimation = new FactoryAnimation(this);
    this.customerAnimation = new CustomerAnimation(this);

    this.tilemap.createLayer('above', this.tilesets)?.setDepth(depths.above);
    this.tilemap.createLayer('above-all', this.tilesets)?.setDepth(depths.aboveAll);

    createAnimatedTiles(this, this.tilemap);
    this.setCameraBounds(this.tilemap.widthInPixels, this.tilemap.heightInPixels);

    this.actionQueue = new ActionQueue(this, [
      this.factoryAnimation.startProduction(),
      this.deliveryAnimation.startFromWarehouse(),
      this.deliveryAnimation.deliveryToShop('market'),
      this.customerAnimation.customerToShop('market'),
      this.deliveryAnimation.deliveryToShop('shoppingCenter'),
      this.customerAnimation.customerToShop('shoppingCenter'),
      this.startNewTurn(),
    ]);

    // DEBUG
    // new WalkingAnimation(this, {
    //   textureKey: 'npc1',
    //   x: 337,
    //   y: 470,
    // });

    eventManager.emit('tilemapReady');
    eventManager.on('changeTimeScale', (scale) => (this.currentTimeScale = scale));
    eventManager.on('dispatchActions', () => this.dispatchActions());
    eventManager.on('draggableScene', (state) => this.handleDraggableSceneState(state));
    eventManager.on('moveCamera', (x, y) => this.handleCameraMovement(x, y));
    eventManager.on('playMusic', (key) => this.playMusic(key));

    this.input.on('pointerdown', this.handlePointerDown, this);
    this.input.on('pointerup', this.handlePointerUp, this);
  }

  public update(_time: number, delta: number) {
    this.tweens.getTweens().forEach((tween) => {
      tween.timeScale = this.currentTimeScale;
    });

    this.npcWalking.forEach((npc) => {
      npc.update(delta);

      if (!npc.visible && this.canDispatch === 'no') {
        npc.setVisible(true);
      }

      if (npc.visible && this.canDispatch === 'yes') {
        npc.setVisible(false);
      }
    });

    if (this.canDispatch === 'wait') {
      this.dispatchActions();
    }
  }

  private dispatchActions() {
    if (gameState.hasTutorial()) {
      this.canDispatch = 'wait';
      return;
    }

    chartManager.closePanel();
    panelManager.closePanel();
    locationManager.closePanel();
    titleManager.closePanel();

    buttonManager.lockButtons();

    this.setDraggable(false);
    this.stopMusic();
    this.playMusic('dispatch');
    this.canDispatch = 'yes';
    this.actionQueue.dispatch();
  }

  private playMusic(key: string) {
    this.currentMusic?.stop();
    this.currentMusic = this.music[key];
    this.currentMusic.play();
  }

  private stopMusic() {
    this.currentMusic?.stop();
  }

  private startNewTurn() {
    return {
      isReady: () => true,
      isComplete: () => this.currentTurn === gameState.turn,
      run: () => {
        gameState.newTurn(() => eventManager.emit('updateBudgetCounter')); // refresh budget counter

        this.canDispatch = 'no';
        this.currentTimeScale = 1;
        this.currentTurn = gameState.turn;
        this.deliveryAnimation.initialState();
        this.customerAnimation.initialState();

        this.moveCamera(this.tilemap.widthInPixels / 2, this.tilemap.heightInPixels / 2);
        this.setDraggable(true);

        if (gameState.isGameOver()) {
          this.stopMusic();
          panelManager.openPanel('gameOver');
          return;
        }

        this.stopMusic();
        buttonManager.unlockButtons();
        eventManager.emit('resetTimer');
        panelManager.openPanel('report');
      },
    };
  }

  private handleCameraMovement(x: number, y: number) {
    if (locationManager.isTweening()) return;

    if (this.actionQueue.isDispatching()) {
      this.moveCamera(x, y, () => this.setDraggable(false));
    } else {
      this.moveCamera(x, y);
    }
  }

  private handleDraggableSceneState(state: boolean) {
    this.time.delayedCall(500, () => this.setDraggable(state));
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    this.clickPosition = { x: pointer.x, y: pointer.y };

    if (this.isInternalPoint(this.clickPosition.x, this.clickPosition.y)) {
      this.setDraggable(false);
    }

    if (
      this.isDraggable() &&
      !this.isInternalPoint(this.clickPosition.x, this.clickPosition.y) &&
      !buttonManager.hasLockedButtons()
    ) {
      locationManager.closePanel();
      titleManager.closePanel();
    }
  }

  private handlePointerUp() {
    this.clickPosition = null;

    if (!this.actionQueue.isDispatching()) {
      this.setDraggable(true);
    }
  }

  private isInternalPoint(x: number, y: number) {
    return Boolean(locationManager.getCurrentPanel()?.isInternalPoint(x, y));
  }
}

export { MainScene };
