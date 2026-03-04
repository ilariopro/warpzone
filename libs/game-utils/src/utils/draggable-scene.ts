import Phaser from 'phaser';

class DraggableScene extends Phaser.Scene {
  private draggable = true;
  private isDragging = false;
  private velocity = new Phaser.Math.Vector2(0, 0);

  public constructor(config?: Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  public init() {
    this.input.mousePointer.motionFactor = 0.5;
    this.input.pointer1.motionFactor = 0.5;
    this.cameras.main.centerToSize();
    this.setDraggableEvents();
  }

  public isDraggable() {
    return this.draggable;
  }

  public moveCamera(x: number, y: number, onComplete?: () => void) {
    this.draggable = false;
    this.velocity.set(0, 0);
    this.cameras.main.pan(x, y, 400, 'Power2', false);
    this.time.delayedCall(500, () => {
      this.draggable = true;
      onComplete?.();
    });
  }

  public setCameraBounds(width: number, height: number) {
    this.cameras.main.setBounds(0, 0, width, height);
  }

  public setDraggable(draggable: boolean) {
    this.draggable = draggable;
  }

  protected loadSpritesheet(key: string, path: string, frameWidth: number, frameHeight: number) {
    this.load.spritesheet(key, path, { frameWidth, frameHeight });
  }

  private setDraggableEvents() {
    this.input.on('pointerdown', () => {
      if (this.draggable) {
        this.isDragging = true;
        this.velocity.set(0, 0);
      }
    });

    this.input.on('pointerup', () => {
      if (this.draggable) {
        this.isDragging = false;
      }
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown && this.draggable) {
        this.velocity.x = (pointer.x - pointer.prevPosition.x) * 0.7;
        this.velocity.y = (pointer.y - pointer.prevPosition.y) * 0.7;
        this.cameras.main.scrollX -= this.velocity.x / this.cameras.main.zoom;
        this.cameras.main.scrollY -= this.velocity.y / this.cameras.main.zoom;
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.events.on('update', (_time: number, _delta: number) => {
      if (this.draggable && !this.isDragging) {
        this.velocity.scale(0.98);
        this.cameras.main.scrollX -= this.velocity.x / this.cameras.main.zoom;
        this.cameras.main.scrollY -= this.velocity.y / this.cameras.main.zoom;
      }
    });
  }
}

export { DraggableScene };
