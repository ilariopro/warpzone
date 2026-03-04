import Phaser from 'phaser';

import { BaseTutorial } from '@warpzone/game-utils';
import { buttonManager, eventManager, locationManager, panelManager, titleManager } from '../globals';
import { TutorialPanel } from '../panels';
import { HintCursor } from '../ui';

const info = {
  balance: {
    title: "🚀 You're in business now!",
    text: "Look at you: your first sales are rolling in, your brand is growing, and now it's time to take things to the next level.\
More sales mean more demand, and more demand means… you guessed it—it’s time to hire more employees! 👥 Expanding your team will boost production, giving you more opportunities to sell and scale your business.\
But let’s be honest—business isn’t always smooth sailing. If tough times hit and cash starts running low, you might need a little financial backup. That’s where the bank 🏦 comes in. You can take out a loan to keep things moving, but be careful—interest rates are high right now, and debt can be a slippery slope if not managed wisely.",
  },
  lastTip: {
    title: '📌 One last tip',
    text: 'Keep an eye on the news! Market trends, special events, and economic shifts can all impact your business. A smart entrepreneur stays informed and adapts to stay ahead of the game.\
Now, the training wheels are off. It’s all up to you! Will you build a Hula Hoop empire or crash and burn?\
Good luck! 🍀',
  },
};

class BalanceTutorial extends BaseTutorial {
  public constructor(scene: Phaser.Scene, hintCursor: HintCursor) {
    panelManager.setPanel('tutorialBalance', new TutorialPanel(scene, info.balance));
    panelManager.setPanel('tutorialLastTip', new TutorialPanel(scene, info.lastTip));

    super([
      {
        key: 'balance',
        action: () => {
          locationManager.closePanel();
          titleManager.closePanel();
          hintCursor.hide();
          scene.time.delayedCall(600, () => panelManager.openPanel('tutorialBalance'));
        },
      },
      {
        key: 'lastTip',
        action: () => {
          locationManager.closePanel();
          titleManager.closePanel();
          hintCursor.hide();
          scene.time.delayedCall(600, () => panelManager.openPanel('tutorialLastTip'));
        },
      },
      {
        key: 'end',
        action: () => {
          buttonManager.unlockButtons();
          eventManager.emit('cancelTutorial');
          eventManager.emit('draggableScene', true);
          hintCursor.hide();
        },
      },
    ]);
  }
}

export { BalanceTutorial };
