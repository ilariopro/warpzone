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
  marketing: {
    title: '✅ You did it!',
    text: 'Your first sale is in the books! Someone out there is now the proud owner of one of your Hula Hoops. Feels good, right? But before you start planning your victory parade… let’s be real. One sale won’t make you a tycoon.\n\
If we really want to see those numbers climb, it’s time to push the marketing game up a notch. 📢\n\
Here’s the deal: every turn, you’ll have a marketing budget to allocate across different channels. Will you go all-in on social media? Invest in flashy ads? Maybe a mix of everything? The choice is yours! \n\
But don’t just set it and forget it—keep an eye on the results. If something isn’t working, tweak your strategy, shift your spending, and optimize for maximum impact.',
  },
};

class MarketingTutorial extends BaseTutorial {
  public constructor(scene: Phaser.Scene, hintCursor: HintCursor) {
    panelManager.setPanel('tutorialMarketing', new TutorialPanel(scene, info.marketing));

    super([
      {
        key: 'marketing',
        action: () => {
          locationManager.closePanel();
          titleManager.closePanel();
          hintCursor.hide();
          scene.time.delayedCall(600, () => panelManager.openPanel('tutorialMarketing'));
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
        key: 'marketMarketing',
        action: () => {
          buttonManager.lockButtons();
          buttonManager.unlockButtons('marketMarketing', 'shop', 'settings');
          hintCursor.show({ x: 490, y: 242 });
          scene.events.emit('disableSpotlight');
        },
      },
      {
        key: 'marketDigital',
        action: () => {
          hintCursor.hide();
          buttonManager.lockButtons();
          buttonManager.unlockButtons('marketTraditional', 'marketDigital', 'marketInfluencer');
          hintCursor.show({ x: 270, y: 185, delay: 250 });
        },
      },
      {
        key: 'marketDigitalPlus',
        action: () => {
          buttonManager.lockButtons();
          buttonManager.unlockButtons('marketDigitalPlus');
          hintCursor.show({ x: 525, y: 300 });
        },
      },
      {
        key: 'marketDigitalPlus',
        action: () => buttonManager.unlockButtons('marketDigitalPlus'),
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

export { MarketingTutorial };
