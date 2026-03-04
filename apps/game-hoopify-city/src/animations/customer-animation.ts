import Phaser from 'phaser';

import { QueueableAction } from '@warpzone/game-utils';
import { AnimationPath, customers, deliveryVan, eventManager, gameState, ShopType } from '../globals';
import { WalkingAnimation } from './walking-animation';
import { HulaHoopAnimation } from './hula-hoop-animation';

type CustomerAnimationConfig = {
  textureKey: string;
  x: number;
  y: number;
  entryPath: AnimationPath[]; // percorso verso la porta del negozio
  exitPath: AnimationPath[]; // percorso di uscita dal negozio
  onComplete: () => void;
};

class CustomerAnimation {
  private customers: Phaser.GameObjects.Sprite[] = [];
  private delayCustomers = 300;
  private isAnimationActive = false;
  private scene: Phaser.Scene;

  public constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public customerToShop(shop: ShopType): QueueableAction {
    return {
      isReady: () => {
        const { inStock, price } = gameState.products[shop];
        const isShopActive = gameState.isShopActive(shop);

        gameState.updateSales(shop);

        return isShopActive && inStock > 0 && price > 0;
      },
      isComplete: () => !this.isAnimationActive,
      run: () => {
        this.isAnimationActive = true;

        eventManager.emit('moveCamera', deliveryVan[shop].endX, deliveryVan[shop].endY);

        const salesCount = gameState.sales[shop].trend[gameState.sales[shop].trend.length - 1];
        const customersCount = this.calculateCustomers(salesCount);
        let activeAnimations = customersCount;

        for (let i = 0; i < customersCount; i++) {
          const spriteIndex = (i % 9) + 1; // from 1 to 9
          const customerIndex = i % customers[shop].length;
          const customerData = customers[shop][customerIndex];

          // ritarda l'invocazione di customerAnimation per ogni cliente
          this.scene.time.delayedCall(this.delayCustomers * i, () => {
            this.customerAnimation({
              textureKey: `${shop}Customer${spriteIndex}`,
              x: customerData.x,
              y: customerData.y,
              entryPath: customerData.entryPath,
              exitPath: customerData.exitPath,
              onComplete: () => {
                eventManager.emit('updateProductCounter');

                activeAnimations--;

                if (activeAnimations === 0) {
                  this.isAnimationActive = false;
                }
              },
            });
          });
        }
      },
    };
  }

  /**
   * Resetta lo stato delle animazioni e rimuove tutti i clienti attivi.
   */
  public initialState() {
    this.customers.forEach((customer) => {
      this.scene.tweens.killTweensOf(customer); // ferma i tween del cliente
      customer.destroy(); // rimuove il cliente dalla scena
    });

    this.customers = [];
    this.isAnimationActive = false;
  }

  /**
   * Calcola il numero di clienti da mostrare in base al numero di vendite.
   * Usa una proporzione non lineare per determinare il numero di clienti.
   *
   * @param sales Numero di vendite
   * @returns Numero di clienti da mostrare
   */
  private calculateCustomers(sales: number): number {
    if (sales < 1) return 0;
    if (sales === 1) return 1;
    if (sales <= 5) return 3;
    if (sales <= 10) return 5;
    if (sales <= 15) return 7;
    if (sales <= 20) return 9;
    if (sales <= 25) return 10;

    return Math.min(30, Math.ceil(sales / 2)); // limita a un massimo di 30 clienti
  }

  /**
   * Mappa il percorso di ingresso e di uscita con le animazioni appropriate.
   *
   * @param config The animation configuration object.
   */
  private customerAnimation(config: CustomerAnimationConfig) {
    const mappedEntryPath = config.entryPath.map((point) => ({
      animationKey: point.animationKey,
      duration: point.duration,
      x: point.x,
      y: point.y,
    }));

    const mappedExitPath = config.exitPath.map((point) => ({
      animationKey: point.animationKey,
      duration: point.duration,
      x: point.x,
      y: point.y,
    }));

    const customer = new WalkingAnimation(this.scene, {
      path: mappedEntryPath,
      textureKey: config.textureKey,
      x: config.x,
      y: config.y,
    });

    const customerHulaHoop = new HulaHoopAnimation(this.scene, `${config.textureKey}HulaHoop`);

    this.customers.push(customer);
    this.customers.push(customerHulaHoop);

    customer.followPath(() => {
      customer.setVisible(false); // cliente entra nel negozio (scompare brevemente)
      eventManager.emit('updateBudgetCounter');

      this.scene.time.delayedCall(500, () => {
        customer.setPath(mappedExitPath);
        customer.setVisible(true); // cliente esce dal negozio

        customer.followPath(() => {
          const exitPath = config.exitPath[config.exitPath.length - 1];
          const finalPositions = this.arrangeCustomers(exitPath.x, exitPath.y); // calcola le posizioni finali
          const position = finalPositions[this.customers.indexOf(customer)];

          customer.setPath([
            {
              animationKey: 'walkRight', // cammina verso la posizione finale
              duration: Phaser.Math.Distance.Between(customer.x, customer.y, position.x, position.y) * 15, // calcola durata in base alla distanza
              x: position.x,
              y: position.y,
            },
          ]);

          customer.followPath(() => {
            customerHulaHoop.setPosition(customer.x, customer.y);
            customer.setVisible(false);
            customerHulaHoop.play('hulaHoop'); // animazione finale
            this.scene.time.delayedCall(2000, () => config.onComplete());
          });
        });
      });
    });
  }

  private arrangeCustomers(startX: number, startY: number) {
    const positions: { x: number; y: number }[] = [];
    const offsetX = 12; // spazio orizzontale tra i clienti
    const offsetY = 14; // spazio verticale tra i clienti
    const columns = 15; // numero di colonne del rettangolo

    this.customers.forEach((_, index) => {
      const x = startX + (index % columns) * offsetX; // calcola la colonna
      const y = startY + Math.floor(index / columns) * offsetY; // calcola la riga
      positions.push({ x, y });
    });

    return positions;
  }
}

export { CustomerAnimation };
