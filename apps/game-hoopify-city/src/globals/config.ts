import Phaser from 'phaser';

import { ButtonManager, PanelManager } from '@warpzone/game-utils';
import { TypedEventEmitter } from '@warpzone/shared-utils';
import { GameEvents } from './types';

export const animationFrameRate = 10;

export const buttonManager = new ButtonManager();

export const buttons = {
  bank: { x: 148, y: 328 },
  employees: { x: 250, y: 220 },
  factory: { x: 32, y: 328 },
  shop: { x: 90, y: 328 },
  resources: { x: 250, y: 170 },
  settings: { x: 608, y: 32 },
  news: { x: 550, y: 32 },
};

export const cameraMovements = {
  bank: { x: 1040, y: 500 },
  factory: { x: 40, y: 500 },
  market: { x: 940, y: 500 },
  shoppingCenter: { x: 0, y: 0 },
  temporaryShop: { x: 1040, y: 250 },
  warehouse: { x: 350, y: 524 },
};

export const chartManager = new PanelManager();

export const customers = {
  market: [
    {
      // outside map bottom right
      x: 1290,
      y: 605,
      entryPath: [
        { animationKey: 'walkLeft', duration: 2200, x: 1080, y: 605 },
        { animationKey: 'walkUp', duration: 800, x: 1080, y: 585 },
      ],
      exitPath: [
        { animationKey: 'walkDown', duration: 500, x: 1080, y: 600 },
        { animationKey: 'walkLeft', duration: 800, x: 1020, y: 600 },
        { animationKey: 'walkDown', duration: 500, x: 1020, y: 625 },
      ],
    },
    {
      // school left door
      x: 667,
      y: 555,
      entryPath: [
        { animationKey: 'walkDown', duration: 1000, x: 667, y: 598 },
        { animationKey: 'walkRight', duration: 3200, x: 1080, y: 598 },
        { animationKey: 'walkUp', duration: 800, x: 1080, y: 585 },
      ],
      exitPath: [
        { animationKey: 'walkDown', duration: 500, x: 1080, y: 600 },
        { animationKey: 'walkLeft', duration: 800, x: 1020, y: 600 },
        { animationKey: 'walkDown', duration: 500, x: 1020, y: 625 },
      ],
    },
    {
      // school right door
      x: 764,
      y: 555,
      entryPath: [
        { animationKey: 'walkDown', duration: 1000, x: 764, y: 598 },
        { animationKey: 'walkRight', duration: 2600, x: 1080, y: 598 },
        { animationKey: 'walkUp', duration: 800, x: 1080, y: 585 },
      ],
      exitPath: [
        { animationKey: 'walkDown', duration: 500, x: 1080, y: 600 },
        { animationKey: 'walkLeft', duration: 800, x: 1020, y: 600 },
        { animationKey: 'walkDown', duration: 500, x: 1020, y: 625 },
      ],
    },
  ],
  shoppingCenter: [
    {
      // top left
      x: -16,
      y: 260,
      entryPath: [
        { animationKey: 'walkRight', duration: 1700, x: 160, y: 260 },
        { animationKey: 'walkUp', duration: 500, x: 160, y: 242 },
      ],
      exitPath: [{ animationKey: 'walkDown', duration: 500, x: 160, y: 270 }],
    },
    {
      // mid left
      x: -16,
      y: 330,
      entryPath: [
        { animationKey: 'walkRight', duration: 1200, x: 112, y: 330 },
        { animationKey: 'walkUp', duration: 200, x: 112, y: 320 },
        { animationKey: 'walkRight', duration: 500, x: 160, y: 320 },
        { animationKey: 'walkUp', duration: 1200, x: 160, y: 242 },
      ],
      exitPath: [{ animationKey: 'walkDown', duration: 500, x: 160, y: 270 }],
    },
    {
      // behind warehouse
      x: 327,
      y: 470,
      entryPath: [
        { animationKey: 'walkUp', duration: 2000, x: 327, y: 320 },
        { animationKey: 'walkLeft', duration: 800, x: 255, y: 320 },
        { animationKey: 'walkUp', duration: 1200, x: 255, y: 242 },
      ],
      exitPath: [
        { animationKey: 'walkDown', duration: 500, x: 255, y: 270 },
        { animationKey: 'walkLeft', duration: 1000, x: 160, y: 270 },
      ],
    },
  ],
  temporaryShop: [],
};

export const deliveryMan = {
  market: { duration: 800, startX: 1080, startY: 610, shopY: 585 },
  shoppingCenter: { duration: 1000, startX: 255, startY: 320, shopY: 242 },
  temporaryShop: { duration: 1500, startX: 1080, startY: 610, shopY: 585 },
};

export const deliveryVan = {
  warehouse: {
    direction: 'driveDown',
    durationIn: 0,
    durationOut: 2000,
    startX: 428,
    startY: 645,
    endX: 428,
    endY: 640,
    exitX: 428,
    exitY: 840,
  },
  market: {
    direction: 'driveLeft',
    durationIn: 2500,
    durationOut: 3000,
    startX: 1440,
    startY: 600,
    endX: 1062,
    endY: 600,
    exitX: 440,
    exitY: 600,
  },
  shoppingCenter: {
    direction: 'driveRight',
    durationIn: 1600,
    durationOut: 2000,
    startX: 0,
    startY: 320,
    endX: 280,
    endY: 320,
    exitX: 700,
    exitY: 320,
  },
  temporaryShop: {
    direction: 'driveRight',
    durationIn: 2500,
    durationOut: 3000,
    startX: 0,
    startY: 320,
    endX: 280,
    endY: 320,
    exitX: 500,
    exitY: 320,
  },
};

export const depths = {
  terrains: 0,
  below: 1,
  buildings: 2,
  npc: 5,
  vehicles: 6,
  above: 10,
  aboveAll: 20,
};

export const eventManager = new Phaser.Events.EventEmitter() as unknown as TypedEventEmitter<GameEvents>;

export const locationManager = new PanelManager();

export const npcWalking = [
  {
    textureKey: 'npc1',
    x: 112,
    y: 304,
    path: [
      { animationKey: 'walkRight', duration: 1000, x: 182, y: 304 },
      { animationKey: 'idleRight', duration: 2000, x: 182, y: 304 },
      { animationKey: 'walkLeft', duration: 1000, x: 112, y: 304 },
      { animationKey: 'idleLeft', duration: 2000, x: 112, y: 304 },
    ],
  },
  {
    textureKey: 'npc2',
    x: 328,
    y: 204,
    path: [
      { animationKey: 'walkDown', duration: 1200, x: 328, y: 280 },
      { animationKey: 'idleDown', duration: 2000, x: 328, y: 280 },
      { animationKey: 'walkUp', duration: 1200, x: 328, y: 204 },
      { animationKey: 'idleUp', duration: 2000, x: 328, y: 204 },
    ],
  },
  {
    textureKey: 'npc3',
    x: 784,
    y: 320,
    path: [
      { animationKey: 'walkUp', duration: 1200, x: 784, y: 248 },
      { animationKey: 'idleUp', duration: 1800, x: 784, y: 248 },
      { animationKey: 'walkDown', duration: 1200, x: 784, y: 320 },
      { animationKey: 'idleDown', duration: 1800, x: 784, y: 320 },
    ],
  },
  {
    textureKey: 'npc4',
    x: 1020,
    y: 320,
    path: [
      { animationKey: 'walkLeft', duration: 1700, x: 904, y: 320 },
      { animationKey: 'idleLeft', duration: 2000, x: 904, y: 320 },
      { animationKey: 'walkRight', duration: 1700, x: 1020, y: 320 },
      { animationKey: 'idleRight', duration: 2000, x: 1020, y: 320 },
    ],
  },
  {
    textureKey: 'npc5',
    x: 596,
    y: 248,
    path: [
      { animationKey: 'walkUp', duration: 1800, x: 596, y: 108 },
      { animationKey: 'idleUp', duration: 2000, x: 596, y: 108 },
      { animationKey: 'walkDown', duration: 1800, x: 596, y: 248 },
      { animationKey: 'idleDown', duration: 2000, x: 596, y: 248 },
    ],
  },
  {
    textureKey: 'npc6',
    x: 1128,
    y: 148,
    path: [
      { animationKey: 'walkLeft', duration: 2000, x: 1032, y: 148 },
      { animationKey: 'idleLeft', duration: 2000, x: 1032, y: 148 },
      { animationKey: 'walkRight', duration: 2000, x: 1128, y: 148 },
      { animationKey: 'idleRight', duration: 2000, x: 1128, y: 148 },
    ],
  },
  {
    textureKey: 'npc7',
    x: 200,
    y: 480,
    path: [
      { animationKey: 'walkLeft', duration: 2500, x: 28, y: 480 },
      { animationKey: 'idleLeft', duration: 2000, x: 28, y: 480 },
      { animationKey: 'walkRight', duration: 2500, x: 200, y: 480 },
      { animationKey: 'idleRight', duration: 2000, x: 200, y: 480 },
    ],
  },
  {
    textureKey: 'npc8',
    x: 1100,
    y: 620,
    path: [
      { animationKey: 'walkLeft', duration: 1500, x: 1020, y: 620 },
      { animationKey: 'idleLeft', duration: 2000, x: 1020, y: 620 },
      { animationKey: 'walkRight', duration: 1500, x: 1100, y: 620 },
      { animationKey: 'idleRight', duration: 2000, x: 1100, y: 620 },
    ],
  },
];

export const panelManager = new PanelManager();

export const panels = {
  bank: { x: 420, y: 110, width: 200, height: 150 },
  common: { x: 85, y: 32, width: 470, height: 300 },
  factory: { x: 92, y: 130, width: 220, height: 150 },
  gameTitle: { x: 85, y: 10, width: 470, height: 140 },
};

export const styles = {
  chart: { fontFamily: 'Dogica', fontSize: '0.5rem', color: '#49596e', lineSpacing: 10 },
  timer: { fontFamily: 'Dogica Bold', fontSize: '0.8em', color: '#383851', align: 'center' },
  gameTitle: { fontFamily: 'Dogica Bold', fontSize: '3em', color: '#383851' },
  infoText: { fontFamily: 'Dogica', fontSize: '1em', color: '#1e1e2c', lineSpacing: 10 },
  label: { fontFamily: 'Dogica', fontSize: '1.2em', color: '#383851' },
  panelButton: { fontFamily: 'Dogica Bold', fontSize: '1em', color: '#393951', align: 'center' },
  panelDetail: { fontFamily: 'Dogica Bold', fontSize: '1em', color: '#415063', align: 'center' },
  title: { fontFamily: 'Dogica Bold', fontSize: '1.6em', color: '#3f4c5e', align: 'center' },
  text: { fontFamily: 'Dogica', fontSize: '1.2em', color: '#1e1e2c', lineSpacing: 10 },
};

export const tilesets = [
  { key: 'camping1', tileset: 'camping-1' },
  { key: 'camping2', tileset: 'camping-2' },
  { key: 'camping3', tileset: 'camping-3' },
  { key: 'cityProps1', tileset: 'city-props-1' },
  { key: 'cityProps2', tileset: 'city-props-2' },
  { key: 'cityTerrains1', tileset: 'city-terrains-1' },
  { key: 'customTileset', tileset: 'custom-tileset' },
  { key: 'floorModularBuildings1', tileset: 'floor-modular-buildings-1' },
  { key: 'floorModularBuildings2', tileset: 'floor-modular-buildings-2' },
  { key: 'garageSales', tileset: 'garage-sales' },
  { key: 'garden1', tileset: 'garden-1' },
  { key: 'genericBuildings1', tileset: 'generic-buildings-1' },
  { key: 'genericBuildings2', tileset: 'generic-buildings-2' },
  { key: 'hotelAndHospital', tileset: 'hotel-and-hospital' },
  { key: 'shoppingCenterAndMarkets1', tileset: 'shopping-center-and-markets-1' },
  { key: 'shoppingCenterAndMarkets2', tileset: 'shopping-center-and-markets-2' },
  { key: 'terrainsAndFences1', tileset: 'terrains-and-fences-1' },
  { key: 'vehicles1', tileset: 'vehicles-1' },
  { key: 'vehicles2', tileset: 'vehicles-2' },
  { key: 'villas', tileset: 'villas' },
];

export const titleManager = new PanelManager();
