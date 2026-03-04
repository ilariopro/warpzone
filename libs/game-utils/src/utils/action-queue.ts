import Phaser from 'phaser';

type QueueableAction = {
  isReady: () => boolean;
  isComplete: () => boolean;
  run: () => void;
};

class ActionQueue {
  private scene: Phaser.Scene;

  private actions: QueueableAction[];
  private queue: QueueableAction[] = [];

  private currentAction: QueueableAction | null;
  private dispatching = false;

  public constructor(scene: Phaser.Scene, actions: QueueableAction[] = []) {
    this.scene = scene;
    this.actions = actions;
    this.currentAction = null;
  }

  public add(action: QueueableAction) {
    this.actions.push(action);
  }

  public dispatch() {
    if (this.actions.length === 0) {
      throw Error(`ActionQueue Error: queue is empty in the scene '${this.scene.scene.key}'.`);
    }

    if (!this.dispatching) {
      this.queue = [...this.actions];
      this.dispatching = true;
      this.nextAction();
    }
  }

  public getCurrentAction() {
    return this.currentAction;
  }

  public isDispatching() {
    return this.dispatching;
  }

  private nextAction() {
    this.currentAction = this.queue.shift() as QueueableAction;

    if (!this.currentAction) return;
    if (!this.currentAction.isReady()) {
      this.nextAction();
      return;
    }

    this.currentAction.run();

    const timer = this.scene.time.addEvent({
      delay: 16, // ~60 FPS
      loop: true,
      callback: () => {
        if (this.currentAction?.isComplete()) {
          timer.remove();
          this.nextAction();
        }

        if (this.queue.length === 0) {
          this.reset();
          return;
        }
      },
    });
  }

  private reset() {
    this.currentAction = null;
    this.dispatching = false;
  }
}

export { ActionQueue, type QueueableAction };
