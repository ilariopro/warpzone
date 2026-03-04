import Phaser from 'phaser';

import { ScalePanel } from '../scale-panel';
import { buttonManager, panels } from '../../globals';

class BankPanel extends ScalePanel {
  public constructor(scene: Phaser.Scene) {
    super(scene, panels.bank);

    const loan = this.createButton(100, 50, 'Loan', 'loan');
    const report = this.createButton(loan.x, loan.y + 50, 'Report', 'report');

    buttonManager.setButton('loan', loan);
    buttonManager.setButton('report', report);

    this.add([loan, report]);
  }
}

export { BankPanel };
