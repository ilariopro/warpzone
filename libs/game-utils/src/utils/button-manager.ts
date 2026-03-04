import Phaser from 'phaser';

class ButtonManager<T extends Phaser.GameObjects.GameObject> {
  private buttons: Map<string, T> = new Map();
  private lockedButtons: string[] = [];

  public getButtons() {
    return Array.from(this.buttons.keys());
  }

  public getLockedButtons() {
    return this.lockedButtons;
  }

  public hasLockedButtons() {
    return this.lockedButtons.length > 0;
  }

  public setButton(key: string, button: T) {
    if (this.buttons.has(key)) {
      console.warn(`The button "${key}" already exists.`);
      return;
    }

    this.buttons.set(key, button);
  }

  public lockButtons(...keys: string[]) {
    const buttonKeys = Array.from(this.buttons.keys());
    const buttonsToLock = keys.length > 0 ? keys : buttonKeys;

    buttonsToLock.forEach((key) => {
      const button = this.buttons.get(key);

      if (button && button.input?.enabled) {
        button.disableInteractive();
        if (!this.lockedButtons.includes(key)) {
          this.lockedButtons.push(key);
        }
      }
    });
  }

  public unlockButtons(...keys: string[]) {
    const buttonsToUnlock = keys.length > 0 ? keys : this.lockedButtons;

    buttonsToUnlock.forEach((key) => {
      const button = this.buttons.get(key);

      if (button && !button.input?.enabled) {
        button.setInteractive();
        this.lockedButtons = this.lockedButtons.filter((k) => k !== key);
      }
    });

    if (keys.length === 0) {
      this.lockedButtons = [];
    }
  }
}

export { ButtonManager };
