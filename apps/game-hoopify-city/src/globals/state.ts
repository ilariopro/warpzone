import { GameState, MarketingType } from './types';

export const gameState: GameState = {
  employees: {
    junior: {
      count: 0,
      salary: 100,
      get percentage() {
        return this.count / gameState.employees.total || 0;
      },
    },
    middle: {
      count: 0,
      salary: 150,
      get percentage() {
        return this.count / gameState.employees.total || 0;
      },
    },
    senior: {
      count: 0,
      salary: 200,
      get percentage() {
        return this.count / gameState.employees.total || 0;
      },
    },
    get salaries() {
      return (
        this.junior.count * this.junior.salary +
        this.middle.count * this.middle.salary +
        this.senior.count * this.senior.salary
      );
    },
    get total() {
      return this.junior.count + this.middle.count + this.senior.count;
    },
  },
  loan: {
    amount: 0,
    duration: 0,
    interestRate: 0,
    paymentCount: 0,
  },
  marketing: {
    market: {
      bestChannel: 'digital',
      digital: {
        budget: 0,
        trend: [0],
        get percentage() {
          return this.budget / gameState.marketing.market.totalBudget || 0;
        },
      },
      influencer: {
        budget: 0,
        trend: [0],
        get percentage() {
          return this.budget / gameState.marketing.market.totalBudget || 0;
        },
      },
      traditional: {
        budget: 0,
        trend: [0],
        get percentage() {
          return this.budget / gameState.marketing.market.totalBudget || 0;
        },
      },
      get totalBudget() {
        return this.digital.budget + this.influencer.budget + this.traditional.budget;
      },
    },
    shoppingCenter: {
      bestChannel: 'traditional',
      digital: {
        budget: 0,
        trend: [0],
        get percentage() {
          return this.budget / gameState.marketing.shoppingCenter.totalBudget || 0;
        },
      },
      influencer: {
        budget: 0,
        trend: [0],
        get percentage() {
          return this.budget / gameState.marketing.shoppingCenter.totalBudget || 0;
        },
      },
      traditional: {
        budget: 0,
        trend: [0],
        get percentage() {
          return this.budget / gameState.marketing.shoppingCenter.totalBudget || 0;
        },
      },
      get totalBudget() {
        return this.digital.budget + this.influencer.budget + this.traditional.budget;
      },
    },
    temporaryShop: {
      bestChannel: 'influencer',
      digital: {
        budget: 0,
        trend: [0],
        get percentage() {
          return this.budget / gameState.marketing.temporaryShop.totalBudget || 0;
        },
      },
      influencer: {
        budget: 0,
        trend: [0],
        get percentage() {
          return this.budget / gameState.marketing.temporaryShop.totalBudget || 0;
        },
      },
      traditional: {
        budget: 0,
        trend: [0],
        get percentage() {
          return this.budget / gameState.marketing.temporaryShop.totalBudget || 0;
        },
      },
      get totalBudget() {
        return this.digital.budget + this.influencer.budget + this.traditional.budget;
      },
    },
    get totalBudget() {
      return this.market.totalBudget + this.shoppingCenter.totalBudget + this.temporaryShop.totalBudget;
    },
  },
  money: 5000,
  products: {
    market: { price: 0, inStock: 0, restockPercentage: 1 },
    shoppingCenter: { price: 0, inStock: 0, restockPercentage: 0 },
    temporaryShop: { price: 0, inStock: 0, restockPercentage: 0 },
    lastBatch: 0,
    total: 0,
    undelivered: 0, // TODO gestire le rimanenze
  },
  resources: 0,
  sales: {
    market: { earnings: [0], trend: [0] },
    shoppingCenter: { earnings: [0], trend: [0] },
    temporaryShop: { earnings: [0], trend: [0] },
  },
  settings: { fullscreen: false, soundVolume: 0.6 },
  shops: { active: ['market'], closed: [] },
  turn: 1,
  tutorial: {
    active: true,
    current: 'welcome',
  },
  canApplyForLoan() {
    return this.loan.amount === 0 /* && this.money > 0 */ && this.money < 1000000;
  },
  canBuyResources() {
    return this.resources < 1000;
  },
  cancelTutorial() {
    this.tutorial.current = null;
  },
  checkTutorial() {
    if (this.turn === 2 && this.sales.market.trend[1] === 1) {
      this.setTutorial('marketing');
      return;
    }

    if (this.turn === 3 && this.employees.total === 1) {
      this.setTutorial('balance');
      return;
    }
  },
  fireEmployee(employee) {
    if (this.employees[employee].count > 0) {
      this.employees[employee].count--;
    }
  },
  hireEmployee(employee) {
    if (this.employees[employee].count < 50) {
      this.employees[employee].count++;
    }
  },
  getInstallment() {
    if (this.loan.duration === 0) {
      return 0;
    }

    const totalDebt = this.loan.amount * (1 + this.loan.interestRate); // totale da restituire con interessi
    const installment = totalDebt / this.loan.duration; // calcolo della singola rata con interessi
    return Math.round(installment); // arrotondiamo per evitare i decimali
  },
  getRestockPercentage() {
    return (
      this.products.market.restockPercentage +
      this.products.shoppingCenter.restockPercentage +
      this.products.temporaryShop.restockPercentage
    );
  },
  getTutorial() {
    return this.tutorial.current;
  },
  hasTutorial() {
    return this.tutorial.active && this.tutorial.current !== null;
  },
  isGameOver() {
    return this.money <= 0;
  },
  isShopActive(shop) {
    return this.shops.active.includes(shop);
  },
  isShopClosed(shop) {
    return this.shops.closed.includes(shop);
  },
  unlockShops() {
    const earnings = this.money - this.loan.amount;

    if (earnings >= 5000 && !this.isShopActive('market')) {
      this.shops.active.push('market');
    }

    if (earnings >= 10000 && !this.isShopActive('shoppingCenter')) {
      this.shops.active.push('shoppingCenter');
    }

    if (earnings >= 20000 && !this.isShopActive('temporaryShop')) {
      this.shops.active.push('temporaryShop');
    }

    for (let i = 0; i < this.shops.active.length; i++) {
      const shopData = this.products[this.shops.active[i]];
      shopData.restockPercentage = 0; // reset percentuale di restock

      if (this.shops.active.length === 1) {
        shopData.restockPercentage = 1;
      }

      if (this.shops.active.length === 2) {
        shopData.restockPercentage = 0.5;
      }

      if (this.shops.active.length === 3) {
        shopData.restockPercentage = i < this.shops.active.length - 1 ? 0.3 : 0.4;
      }
    }
  },
  newProduction() {
    // nessun dipendente o risorsa, nessuna produzione
    if (gameState.employees.total === 0 || gameState.resources === 0) {
      this.setLastProductBatch(0);
      return;
    }

    // deviazione rispetto ai valori ideali (in percentuale)
    const deviationJunior = Math.abs(gameState.employees.junior.percentage - 55); // 55% junior
    const deviationMiddle = Math.abs(gameState.employees.middle.percentage - 30); // 30% middle
    const deviationSenior = Math.abs(gameState.employees.senior.percentage - 15); // 15% senior

    const baseModifier = 10; // modifier di base per il calcolo del valore proporzionato
    const score = 1 - (deviationJunior + deviationMiddle + deviationSenior) / 100; // scostamento
    const multiplier = 1 + score; // moltiplicatore min x1, max x2
    const potentialProducts = Math.ceil(gameState.employees.total * baseModifier * multiplier); // numero prodotti finali con arrotondamento
    const resourcePerProduct = 2 / 10; // ogni prodotto consuma 0.2 risorse (5 prodotti per 1 risorsa)
    const productsFromResources = Math.floor(gameState.resources / resourcePerProduct); // massimo consentito dalle risorse
    const finalProducts = Math.min(potentialProducts, productsFromResources); // limita produzione anche alle risorse disponibili
    const resourcesUsed = finalProducts * resourcePerProduct; // risorse utilizzate
    const lastBatch = Math.max(1, finalProducts); // soglia minima 1 prodotto

    // TODO se restano 0.2 risorse lastBatch è sempre 1 consumando 0 risorse

    console.log('production', {
      multiplier,
      potentialProducts,
      productsFromResources,
      lastBatch,
      resourcesUsed,
    });

    this.setLastProductBatch(lastBatch); // aggiorna valore ultima produzione
    this.setTotalProducts(this.products.total + lastBatch); // aggiorna totale prodotti
    this.setResources(gameState.resources - resourcesUsed); // aggiorna numero di risorse
  },
  newTurn(onComplete: () => void) {
    this.turn++;

    this.cancelTutorial(); // reset tutorial
    this.payEmployees(); // pagamento stipendi
    this.payMarketing(); // pagamento campagne di marketing
    this.payInstallment(); // pagamento rata finanziamento
    this.unlockShops(); // check se ci sono negozi da sbloccare
    this.checkTutorial(); // check se ci sono nuovi tutorial da mostrare

    onComplete();
  },
  payEmployees() {
    this.setMoney(this.money - this.employees.salaries);
  },
  payInstallment() {
    if (this.loan.paymentCount < this.loan.duration) {
      this.setMoney(this.money - this.getInstallment()); // scala la rata dal budget
      this.loan.paymentCount++; // incrementa il conteggio dei pagamenti

      if (this.loan.paymentCount === this.loan.duration) {
        this.resetLoan(); // cancella il debito se tutte le rate sono state pagate
      }
    }
  },
  payMarketing() {
    let totalMarketingCost = 0;

    this.shops.active.forEach((shop) => {
      totalMarketingCost += this.marketing[shop].totalBudget;
    });

    this.setMoney(this.money - totalMarketingCost);
  },
  setMoney(value: number) {
    this.money = Math.max(value, 0);
  },
  setLastProductBatch(value) {
    this.products.lastBatch = Math.max(0, value);
  },
  setProductPrice(shop, value) {
    this.products[shop].price = Math.max(0, Math.min(value, 100)); // TODO decidere il prezzo ideale
  },
  setRestockPercentage(shop, value) {
    this.products[shop].restockPercentage = Math.max(0, Math.max(1, value / 100));
  },
  setResources(value) {
    this.resources = Math.min(Math.max(0, value), 1000);
  },
  setTotalProducts(value) {
    this.products.total = Math.max(0, value);
  },
  setTutorial(value) {
    this.tutorial.current = value;
  },
  skipTutorial() {
    this.tutorial.active = false;
  },
  resetLoan() {
    this.loan.amount = 0;
    this.loan.duration = 0;
    this.loan.paymentCount = 0;
  },
  updateLoan(amount: number, duration: number, interestRate: number) {
    this.loan.amount = amount;
    this.loan.duration = duration;
    this.loan.interestRate = interestRate;
  },
  updateMarketingBudget(shop, channel, budget) {
    this.marketing[shop][channel].budget = budget;
  },
  updateMarketingTrend(shop, sales) {
    const marketing = gameState.marketing[shop];
    const bestChannel = marketing.bestChannel;

    // calcolo del totale ponderato
    let totalWeight = 0;
    const weights: Record<MarketingType, number> = {
      digital: marketing.digital.percentage,
      influencer: marketing.influencer.percentage,
      traditional: marketing.traditional.percentage,
    };

    weights[bestChannel] *= 1.5; // canale di marketing con peso maggiore

    for (const channel in weights) {
      totalWeight += weights[channel as MarketingType];
    }

    // Calcolo delle vendite per canale
    for (const channel of ['digital', 'influencer', 'traditional'] as MarketingType[]) {
      const channelWeight = weights[channel] / (totalWeight || 1); // percentuale del canale
      const channelSales = Math.ceil(channelWeight * sales); // vendite attribuite al canale
      marketing[channel].trend.push(channelSales); // aggiorna il trend
    }
  },
  updateSales(shop) {
    const marketing = gameState.marketing[shop];
    const products = gameState.products[shop];

    // nessun prezzo di vendita = 0 vendite
    if (products.price === 0) {
      this.sales[shop].earnings.push(0);
      this.sales[shop].trend.push(0);
      this.updateMarketingTrend(shop, 0);
      return;
    }

    // nessun budget per marketing = 1 vendita
    if (marketing.totalBudget === 0) {
      this.sales[shop].earnings.push(1);
      this.sales[shop].trend.push(1);
      products.inStock -= 1; // rimuovi dallo stock dello shop // TODO gestire le rimanenze
      this.setTotalProducts(this.products.total - 1); // rimuovi dai prodotti totali
      this.setMoney(this.money + products.price * 1); // aggiorna i guadagni delle vendite
      this.updateMarketingTrend(shop, 1);
      return;
    }

    // configurazione ideale del budget
    const idealBudget = {
      digital: 0.25,
      influencer: 0.25,
      traditional: 0.25,
    };

    idealBudget[marketing.bestChannel] = 0.5; // il canale migliore ha il 50%

    // calcolo dello scostamento dal budget ideale
    let deviation = 0;
    for (const channel in idealBudget) {
      const marketingChannel = channel as MarketingType;
      const actualPercentage = marketing[marketingChannel].percentage; // percentuale attuale
      const idealPercentage = idealBudget[marketingChannel]; // percentuale ideale
      deviation += Math.abs(actualPercentage - idealPercentage); // deviazione accumulata
    }

    const score = 1 - deviation / 1.5; // scostamento percentuale normalizzato (il valore deviation è tra 0 e 1.5)
    const budgetMultiplier = 1 + score; // moltiplicatore min x1, max x2
    const budgetEffect = Math.sqrt(marketing.totalBudget) / 10 + 1; // più budget = più vendite (min 1, cresce con radice quadrata)
    const baseModifier = 20; // modifier di base per il calcolo del valore proporzionato
    const potentialSales = Math.ceil(baseModifier * budgetMultiplier * budgetEffect); // calcolo del potenziale di vendita
    const idealPrice = 30; // prezzo ideale per unità, per calcolare l'influenza del prezzo
    const priceMultiplier = products.price > idealPrice ? Math.exp(-(products.price - idealPrice) / 20) : 1; // penalità se il prezzo è più alto del prezzo ideale
    const finalSales = Math.min(products.inStock, Math.ceil(potentialSales * priceMultiplier)); // vendite limitate dallo stock disponibile
    const earnings = products.price * finalSales;

    console.log('sales', {
      budgetMultiplier,
      budgetEffect,
      priceMultiplier,
      potentialSales,
      finalSales,
      earnings,
    });

    this.sales[shop].earnings.push(earnings); // aggiorna le vendite dello shop
    this.sales[shop].trend.push(finalSales); // aggiorna il trend di vendita dello shop
    products.inStock -= finalSales; // rimuovi dallo stock dello shop // TODO gestire le rimanenze
    this.setTotalProducts(this.products.total - finalSales); // rimuovi dai prodotti totali
    this.setMoney(this.money + earnings); // aggiorna i guadagni delle vendite

    this.updateMarketingTrend(shop, finalSales); // aggiorna il trend graph del marketing
  },
  updateSoundVolume(direction: 'up' | 'down') {
    let soundVolume = this.settings.soundVolume;

    if (direction === 'down' && soundVolume > 0) {
      soundVolume -= 0.2;
    } else if (direction === 'up' && soundVolume < 1) {
      soundVolume += 0.2;
    }

    this.settings.soundVolume = parseFloat(soundVolume.toFixed(1));
  },
  updateStock(shop) {
    let remainingProducts = this.products.total;
    let totalRestockPercentage = 0;

    const restockPercentage = this.products[shop].restockPercentage;
    totalRestockPercentage += restockPercentage;

    if (totalRestockPercentage) {
      // calcolo della quantità di prodotti per ogni shop
      const shopProducts = Math.floor(this.products.total * restockPercentage);
      this.products[shop].inStock = shopProducts; // aggiorna stock dello shop
      remainingProducts -= shopProducts; // riduce i prodotti rimanenti
    }

    // console.log('updateStock', this.products.total, this.products[shop].inStock, remainingProducts);

    this.products.undelivered = remainingProducts; // aggiorna conteggio dei prodotti non consegnati
  },
};
