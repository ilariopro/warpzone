import Phaser from 'phaser';

import { BaseTutorial } from '@warpzone/game-utils';
import {
  buttonManager,
  buttons,
  eventManager,
  locationManager,
  panelManager,
  titleManager,
} from '../globals';
import { TutorialPanel } from '../panels';
import { HintCursor } from '../ui';

const info = {
  welcome: {
    title: '🎉 Welcome to Hoopify City!',
    text: 'Have you ever thought that a simple hoop could change your life? No? Well, get ready to find out! \n\n\
In this game, your goal is to turn your small company into a global giant 🌎 in the production and sale of Hula Hoops, the toy that has literally been spinning through generations!\n\n\
💡 Did you know? The hoop as a toy has existed since Ancient Egypt, where children would roll it along the ground. The Greeks used it for training, Native Americans saw it as a symbol of life, and in the 14th century, it became a trend in England under the name "hoop."\n\n\
The term "Hula Hoop" emerged in the 19th century when British sailors noticed the resemblance between the hip movements in the Hawaiian hula dance and the spinning hoop game.\n\n\
👉 Click on the panel to continue.',
  },
  yourTurn: {
    title: '🚀 Now it’s your turn!',
    text: "Have you ever dreamed of building an empire from a simple children’s toy? No? Well, you're here now, so get ready to become the ultimate Hula Hoop tycoon! \n\n\
Your goal? Simple: turn your company into the number ONE in the world! 🎯 But be careful—throwing colorful hoops in the air and hoping for luck won’t be enough. \n\
You’ll need to:\n\
• 📦 Source the best raw materials (no, leftover pizza boxes don’t count).\n\
• 👤 Hire a team of brilliant workers (or at least ones who wake up before noon).\n\
• 🏪 Open physical stores to bring Hula Hoops everywhere!\n\
• 💰 Set the right prices to maximize profits without scaring off customers.\n\
• 📢 Launch marketing campaigns so genius that even top advertising experts would be impressed.\n\n\
Will you be an industry visionary or it will be a financial disaster? There’s only one way to find out! \n\n\
👉 Close the tutorial and follow the arrow to get started! Good luck, CEO!",
  },
  resources: {
    title: '🎊 Congratulations!',
    text: 'You’ve just hired your first employee! 👤 That’s a huge step: your company is no longer a one-person show. Now, you’ve got an extra pair of hands to help turn your Hula Hoop empire into reality.\n\n\
But don’t start celebrating just yet… your worker is here, ready to roll, but there’s a small problem. No materials, no production! 📦\n\n\
To get things up and running, we need to buy the right amount of raw materials. Too little, and your production will come to a screeching halt. Too much, and you’ll be drowning in supplies (and unnecessary expenses).\n\n\
Let’s make it happen! Time to stock up and get those Hula Hoops rolling off the assembly line!',
  },
  productPrice: {
    title: '⏳ The moment of truth!',
    text: 'This is it, one of the toughest decisions you’ll face as a business owner. You’ve got your production up and running, your Hula Hoops are ready to roll… but now comes the big question: How much should you sell them for? 💰\n\n\
Set the price too low, and you’ll be working non-stop just to break even. Set it too high, and customers might run for the hills.\n\n\
The right price is the key to success—it needs to cover your costs, bring in profits, and still be attractive enough for customers to keep buying.',
  },
};

class WelcomeTutorial extends BaseTutorial {
  public constructor(scene: Phaser.Scene, hintCursor: HintCursor) {
    panelManager.setPanel('tutorialWelcome', new TutorialPanel(scene, info.welcome));
    panelManager.setPanel('tutorialYourTurn', new TutorialPanel(scene, info.yourTurn));
    panelManager.setPanel('tutorialResources', new TutorialPanel(scene, info.resources));
    panelManager.setPanel('tutorialProductPrice', new TutorialPanel(scene, info.productPrice));

    super([
      {
        key: 'welcome',
        action: () => panelManager.openPanel('tutorialWelcome'),
      },
      {
        key: 'yourTurn',
        action: () => panelManager.openPanel('tutorialYourTurn'),
      },
      {
        key: 'factory',
        action: () => {
          buttonManager.lockButtons();
          buttonManager.unlockButtons('factory', 'settings');
          hintCursor.show({ x: buttons.factory.x + 16, y: buttons.factory.y + 16 });
          scene.events.emit('enableSpotlight');
        },
      },
      {
        key: 'employees',
        action: () => {
          buttonManager.lockButtons();
          buttonManager.unlockButtons('employees', 'factory', 'settings');
          hintCursor.show({ x: buttons.employees.x + 16, y: buttons.employees.y + 20 });
          scene.events.emit('disableSpotlight');
        },
      },
      {
        key: 'senior',
        action: () => {
          hintCursor.hide();
          buttonManager.lockButtons();
          buttonManager.unlockButtons('senior');
          hintCursor.show({ x: 270, y: 245, delay: 250 });
        },
      },
      {
        key: 'hire',
        action: () => {
          buttonManager.lockButtons();
          buttonManager.unlockButtons('senior', 'hire');
          hintCursor.show({ x: 505, y: 300 });
        },
      },
      {
        key: 'resourcesText',
        action: () => {
          hintCursor.hide();
          scene.time.delayedCall(600, () => panelManager.openPanel('tutorialResources'));
        },
      },
      {
        key: 'resources',
        action: () => {
          buttonManager.lockButtons();
          buttonManager.unlockButtons('resources', 'factory', 'settings');
          hintCursor.show({ x: buttons.resources.x + 16, y: buttons.resources.y + 20 });
        },
      },
      {
        key: 'x10',
        action: () => {
          hintCursor.hide();
          buttonManager.lockButtons();
          buttonManager.unlockButtons('x10');
          hintCursor.show({ x: 270, y: 120, delay: 250 });
        },
      },
      {
        key: 'buy',
        action: () => {
          buttonManager.lockButtons();
          buttonManager.unlockButtons('x50', 'buy');
          hintCursor.show({ x: 505, y: 300 });
        },
      },
      {
        key: 'productPriceText',
        action: () => {
          locationManager.closePanel();
          titleManager.closePanel();
          hintCursor.hide();
          scene.time.delayedCall(600, () => panelManager.openPanel('tutorialProductPrice'));
        },
      },
      {
        key: 'market',
        action: () => {
          buttonManager.lockButtons();
          buttonManager.unlockButtons('shop', 'settings');
          hintCursor.show({ x: buttons.shop.x + 16, y: buttons.shop.y + 16 });
          scene.events.emit('enableSpotlight');
        },
      },
      {
        key: 'marketSales',
        action: () => {
          buttonManager.lockButtons();
          buttonManager.unlockButtons('marketSales', 'shop', 'settings');
          hintCursor.show({ x: 468, y: 195 });
          scene.events.emit('disableSpotlight');
        },
      },
      {
        key: 'marketPrice',
        action: () => {
          hintCursor.hide();
          buttonManager.lockButtons();
          buttonManager.unlockButtons('marketPrice');
          hintCursor.show({ x: 270, y: 120, delay: 250 });
        },
      },
      {
        key: 'marketPricePlus',
        action: () => {
          buttonManager.lockButtons();
          buttonManager.unlockButtons('marketPricePlus');
          hintCursor.show({ x: 525, y: 300 });
        },
      },
      {
        key: 'countdownTimer',
        action: () => {
          buttonManager.lockButtons();
          buttonManager.unlockButtons('countdownTimer', 'settings');
          locationManager.closePanel();
          titleManager.closePanel();
          hintCursor.hide();

          scene.time.delayedCall(500, () => {
            panelManager.closePanel();
            hintCursor.show({ x: 610, y: 330 });
            scene.events.emit('enableSpotlight');
          });
        },
      },
      {
        key: 'end',
        action: () => {
          buttonManager.unlockButtons();
          eventManager.emit('cancelTutorial');
          eventManager.emit('draggableScene', true);
          hintCursor.hide();
          scene.events.emit('disableSpotlight');
        },
      },
    ]);
  }
}

export { WelcomeTutorial };
