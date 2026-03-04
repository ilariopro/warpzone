import Phaser from 'phaser';

import { QueueableAction } from '@warpzone/game-utils';
import { cameraMovements, depths, eventManager, gameState } from '../globals';

class FactoryAnimation extends Phaser.GameObjects.Image {
  private activeBubbles: Phaser.GameObjects.Image[] = [];
  private isAnimationActive = false;
  private shakeTween: Phaser.Tweens.Tween | null = null;

  public constructor(scene: Phaser.Scene) {
    const x = 200;
    const y = 505;

    super(scene, x, y, 'factoryImage');
    this.scene.add.existing(this);

    this.depth = depths.above;
  }

  public startProduction(): QueueableAction {
    return {
      isReady: () => true,
      isComplete: () => this.isAnimationActive === false,
      run: () => {
        this.isAnimationActive = true;

        eventManager.emit('moveCamera', cameraMovements.factory.x, cameraMovements.factory.y);
        gameState.newProduction();

        if (gameState.products.lastBatch === 0) {
          this.scene.time.delayedCall(1200, () => this.stopProduction());
          return;
        }

        this.scene.time.delayedCall(1200, () => {
          eventManager.emit('updateProductCounter', () => this.stopProduction());
          eventManager.emit('updateResourceCounter');
        });

        this.shakeFactory();
        this.startBubbles();
      },
    };
  }

  private shakeFactory() {
    this.shakeTween = this.scene.tweens.add({
      targets: this,
      y: this.y + 2, // muovi leggermente
      duration: 80, // durata movimento
      yoyo: true, // torna allo stato di partenza
      repeat: -1, // ripeti all'infinito
      onComplete: () => (this.isAnimationActive = false),
    });
  }

  // Crea le bolle con un ritardo casuale
  private startBubbles() {
    const maxBubbles = 20;
    const maxDelay = 5000;

    for (let i = 0; i < maxBubbles; i++) {
      this.scene.time.delayedCall(Phaser.Math.Between(0, maxDelay), () => {
        this.createBubble(215, 370);
      });

      this.scene.time.delayedCall(Phaser.Math.Between(0, maxDelay), () => {
        this.createBubble(250, 370);
      });
    }
  }

  private stopProduction() {
    this.activeBubbles = [];
    this.isAnimationActive = false;
    this.shakeTween?.destroy();
  }

  private createBubble(x: number, y: number) {
    if (!this.isAnimationActive) return;

    const bubble = this.scene.add.image(x, y, 'soapBubble').setScale(0.3);
    this.activeBubbles.push(bubble); // Aggiungi la bolla all'array delle bolle attive
    const targetY = y - 300; // Altezza finale Y

    // Tween per il movimento verticale
    this.scene.tweens.add({
      targets: bubble,
      y: targetY, // Muovi la bolla verso l'alto
      alpha: 0, // Fai scomparire la bolla
      duration: 4000, // Durata dell'animazione
      ease: 'Sine.inOut', // Tipo di easing per un movimento morbido
      scale: 0.5,
      onComplete: () => {
        bubble.destroy(); // Distruggi la bolla al termine dell'animazione
        this.activeBubbles = this.activeBubbles.filter((b) => b !== bubble); // Rimuovi la bolla dall'array
      },
    });

    // Aggiungi un movimento oscillante
    this.scene.tweens.add({
      targets: bubble,
      x: x + Phaser.Math.Between(-10, 10), // Oscillazione orizzontale limitata
      duration: 1000, // Durata dell'oscillazione
      yoyo: true, // Torna indietro
      repeat: -1, // Ripeti all'infinito
      ease: 'Sine.inOut', // Easing per un movimento morbido
    });
  }
}

export { FactoryAnimation };
