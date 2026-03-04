import Phaser from 'phaser';

import { ScalePanel } from '../scale-panel';
import { buttonManager, panels } from '../../globals';

class FactoryLocationPanel extends ScalePanel {
  public constructor(scene: Phaser.Scene) {
    super(scene, panels.factory);

    const resources = this.createButton(110, 50, 'Resources', 'resources');
    const employees = this.createButton(resources.x, resources.y + 50, 'Employees', 'employees');

    buttonManager.setButton('employees', employees);
    buttonManager.setButton('resources', resources);

    this.add([resources, employees]);
  }
}

export { FactoryLocationPanel };
