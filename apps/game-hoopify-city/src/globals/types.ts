export type EmployeeType = 'junior' | 'middle' | 'senior';

export type LocationType = 'bank' | 'factory' | 'shop';

export type MarketingType = 'digital' | 'influencer' | 'traditional';

export type ShopType = 'market' | 'shoppingCenter' | 'temporaryShop';

export type GameEvents = {
  buttonPressed: (key: string) => void;
  changeTimeScale: (scale: number) => void;
  closeReport: () => void;
  dispatchActions: () => void;
  moveCamera: (x: number, y: number) => void;
  draggableScene: (state: boolean) => void;
  openChart: (key: string) => void;
  openPanel: (key: string) => void;
  cancelTutorial: () => void;
  nextTutorialStep: () => void;
  playMusic: (key: string) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  resumeTimer: () => void;
  skipTutorial: () => void;
  tilemapReady: () => void;
  updateBudgetCounter: (onComplete?: () => void) => void;
  updateProductCounter: (onComplete?: () => void) => void;
  updateResourceCounter: (onComplete?: () => void) => void;
};

export type GameState = {
  employees: {
    junior: { count: number; percentage: number; salary: number };
    middle: { count: number; percentage: number; salary: number };
    senior: { count: number; percentage: number; salary: number };
    salaries: number;
    total: number;
  };
  loan: {
    amount: number;
    duration: number;
    interestRate: number;
    paymentCount: number;
  };
  marketing: {
    market: {
      bestChannel: MarketingType;
      digital: { budget: number; percentage: number; trend: number[] };
      influencer: { budget: number; percentage: number; trend: number[] };
      traditional: { budget: number; percentage: number; trend: number[] };
      totalBudget: number;
    };
    shoppingCenter: {
      bestChannel: MarketingType;
      digital: { budget: number; percentage: number; trend: number[] };
      influencer: { budget: number; percentage: number; trend: number[] };
      traditional: { budget: number; percentage: number; trend: number[] };
      totalBudget: number;
    };
    temporaryShop: {
      bestChannel: MarketingType;
      digital: { budget: number; percentage: number; trend: number[] };
      influencer: { budget: number; percentage: number; trend: number[] };
      traditional: { budget: number; percentage: number; trend: number[] };
      totalBudget: number;
    };
    totalBudget: number;
  };
  money: number;
  products: {
    market: { price: number; inStock: number; restockPercentage: number };
    shoppingCenter: { price: number; inStock: number; restockPercentage: number };
    temporaryShop: { price: number; inStock: number; restockPercentage: number };
    lastBatch: number;
    total: number;
    undelivered: number;
  };
  resources: number;
  sales: {
    market: { earnings: number[]; trend: number[] };
    shoppingCenter: { earnings: number[]; trend: number[] };
    temporaryShop: { earnings: number[]; trend: number[] };
  };
  settings: { fullscreen: boolean; soundVolume: number };
  shops: { active: ShopType[]; closed: ShopType[] };
  turn: number;
  tutorial: {
    active: boolean;
    current: string | null;
  };
  canApplyForLoan(): boolean;
  canBuyResources(): boolean;
  cancelTutorial(): void;
  checkTutorial(): void;
  fireEmployee(employee: EmployeeType): void;
  hireEmployee(employee: EmployeeType): void;
  getInstallment(): number;
  getRestockPercentage(): number;
  getTutorial(): string | null;
  hasTutorial(): boolean;
  isGameOver(): boolean;
  isShopActive(shop: ShopType): boolean;
  isShopClosed(shop: ShopType): boolean;
  newProduction(): void;
  newTurn(onComplete: () => void): void;
  payEmployees(): void;
  payInstallment(): void;
  payMarketing(): void;
  resetLoan(): void;
  setMoney(value: number): void;
  setLastProductBatch(value: number): void;
  setProductPrice(shop: ShopType, value: number): void;
  setRestockPercentage(shop: ShopType, value: number): void;
  setResources(value: number): void;
  setTotalProducts(value: number): void;
  setTutorial(value: string): void;
  skipTutorial(): void;
  unlockShops(): void;
  updateLoan(amount: number, duration: number, interestRate: number): void;
  updateMarketingBudget(shop: ShopType, channel: MarketingType, budget: number): void;
  updateMarketingTrend(shop: ShopType, sales: number): void;
  updateSales(shop: ShopType): void;
  updateSoundVolume(direction: 'up' | 'down'): void;
  updateStock(shop: ShopType): void;
};

export type AnimationPath = { animationKey: string; duration: number; x: number; y: number };

export type PhaserSound =
  | Phaser.Sound.NoAudioSound
  | Phaser.Sound.HTML5AudioSound
  | Phaser.Sound.WebAudioSound;
