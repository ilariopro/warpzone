import Phaser from 'phaser';

import { QueueableAction } from '@warpzone/game-utils';
import {
  animationFrameRate,
  deliveryMan,
  deliveryVan,
  depths,
  eventManager,
  gameState,
  ShopType,
} from '../globals';

type VanAnimationConfig = {
  direction: string;
  duration: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  onComplete?: () => void;
};

type ManAnimationConfig = {
  duration: number;
  startX: number;
  startY: number;
  shopY: number;
  onComplete?: () => void;
};

class DeliveryAnimation {
  private scene: Phaser.Scene;
  private movingVan!: Phaser.GameObjects.Sprite;
  private staticVan!: Phaser.GameObjects.Sprite;
  private deliveryMan!: Phaser.GameObjects.Sprite;
  private isAnimationActive = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.createAnimation('driveRight', 'movingDeliveryVan', 0, 5);
    this.createAnimation('driveUp', 'movingDeliveryVan', 6, 11);
    this.createAnimation('driveLeft', 'movingDeliveryVan', 12, 17);
    this.createAnimation('driveDown', 'movingDeliveryVan', 18, 23);

    this.createAnimation('walkUp', 'deliveryMan', 0, 5);
    this.createAnimation('walkDown', 'deliveryMan', 6, 11);

    this.initialState();
  }

  public initialState() {
    this.deliveryMan?.destroy();
    this.movingVan?.destroy();
    this.staticVan?.destroy();

    this.staticVan = this.scene.add
      .sprite(deliveryVan.warehouse.startX, deliveryVan.warehouse.startY, 'staticDeliveryVan', 3)
      .setDepth(depths.vehicles);
  }

  public deliveryToShop(shop: ShopType): QueueableAction {
    return {
      isReady: () => {
        return (
          gameState.isShopActive(shop) &&
          gameState.products[shop].restockPercentage > 0 &&
          gameState.products.lastBatch > 0
        );
      },
      isComplete: () => !this.isAnimationActive,
      run: () => {
        this.isAnimationActive = true;

        const destination = deliveryVan[shop];

        gameState.updateStock(shop);
        eventManager.emit('moveCamera', destination.endX, destination.endY);

        this.moveAndTurnOff({
          direction: destination.direction,
          duration: destination.durationIn,
          startX: destination.startX,
          startY: destination.startY,
          endX: destination.endX,
          endY: destination.endY,
          onComplete: () => {
            this.animateDeliveryMan({
              duration: deliveryMan[shop].duration,
              startX: deliveryMan[shop].startX,
              startY: deliveryMan[shop].startY,
              shopY: deliveryMan[shop].shopY,
              onComplete: () => {
                this.turnOnAndMove({
                  direction: destination.direction,
                  duration: destination.durationOut,
                  startX: destination.endX,
                  startY: destination.endY,
                  endX: destination.exitX,
                  endY: destination.exitY,
                  onComplete: () => {
                    this.movingVan.setVisible(false);
                    this.isAnimationActive = false;
                  },
                });
              },
            });
          },
        });
      },
    };
  }

  public startFromWarehouse(): QueueableAction {
    return {
      isReady: () => gameState.products.total > 0 && gameState.getRestockPercentage() > 0,
      isComplete: () => !this.isAnimationActive,
      run: () => {
        this.isAnimationActive = true;

        const warehouse = deliveryVan.warehouse;
        eventManager.emit('moveCamera', warehouse.endX, warehouse.endY);

        this.scene.time.delayedCall(500, () => {
          this.turnOnAndMove({
            direction: warehouse.direction,
            duration: warehouse.durationOut,
            startX: warehouse.startX,
            startY: warehouse.startY,
            endX: warehouse.exitX,
            endY: warehouse.exitY,
            onComplete: () => (this.isAnimationActive = false),
          });
        });
      },
    };
  }

  private createAnimation(key: string, textureKey: string, start: number, end: number) {
    this.scene.anims.create({
      key,
      frames: this.scene.anims.generateFrameNumbers(textureKey, { start, end }),
      frameRate: animationFrameRate,
      repeat: -1,
    });
  }

  private turnOnAndMove(config: VanAnimationConfig) {
    // Make the static van invisible
    this.staticVan.setVisible(false);

    // Make the moving van visible and start its animation
    this.movingVan = this.scene.add
      .sprite(config.startX, config.startY, 'movingDeliveryVan')
      .setDepth(depths.above + 1)
      .play(config.direction);

    // Move the van to the destination
    this.scene.tweens.add({
      targets: this.movingVan,
      x: config.endX,
      y: config.endY,
      duration: config.duration,
      delay: 1200,
      onComplete: () => {
        this.movingVan.setVisible(false);
        config.onComplete?.();
      },
    });
  }

  private moveAndTurnOff(config: VanAnimationConfig) {
    const staticVanFrames: Record<string, number> = {
      driveRight: 0,
      driveUp: 1,
      driveLeft: 2,
      driveDown: 3,
    };

    // Start moving the van
    this.movingVan.setPosition(config.startX, config.startY).setVisible(true).play(config.direction);

    // Move to the destination
    this.scene.tweens.add({
      targets: this.movingVan,
      x: config.endX,
      y: config.endY,
      duration: config.duration,
      onComplete: () => {
        this.scene.time.delayedCall(80, () => {
          this.movingVan.setVisible(false);

          // Set the static van at the final position
          this.staticVan
            .setPosition(config.endX, config.endY)
            .setFrame(staticVanFrames[config.direction] || 0)
            .setDepth(this.movingVan.depth)
            .setVisible(true);
        });

        this.scene.time.delayedCall(500, () => config.onComplete?.());
      },
    });
  }

  private animateDeliveryMan(config: ManAnimationConfig) {
    this.deliveryMan = this.scene.add
      .sprite(config.startX, config.startY, 'deliveryMan', 8)
      .setDepth(depths.npc);

    this.scene.tweens.add({
      targets: this.deliveryMan,
      y: config.shopY,
      duration: config.duration,
      onStart: () => this.deliveryMan.play('walkUp'),
      onComplete: () => {
        this.deliveryMan.setVisible(false);

        this.scene.tweens.add({
          targets: this.deliveryMan,
          y: config.startY,
          delay: 1500,
          duration: config.duration,
          onStart: () => this.deliveryMan.setVisible(true).play('walkDown'),
          onComplete: () => {
            this.deliveryMan.setVisible(false);
            config.onComplete?.();
          },
        });
      },
    });
  }
}

export { DeliveryAnimation };
