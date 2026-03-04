import Phaser from 'phaser';

class NineSlice extends Phaser.GameObjects.Container {
  public corner: number;
  public textureKey: string;

  private topLeft = 'top-left' as const;
  private topCenter = 'top-center' as const;
  private topRight = 'top-right' as const;

  private middleLeft = 'middle-left' as const;
  private middleCenter = 'middle-center' as const;
  private middleRight = 'middle-right' as const;

  private bottomLeft = 'bottom-left' as const;
  private bottomCenter = 'bottom-center' as const;
  private bottomRight = 'bottom-right' as const;

  private customOriginX = 0;
  private customOriginY = 0;
  private originalX: number;
  private originalY: number;

  public constructor(
    scene: Phaser.Scene,
    width: number,
    height: number,
    corner: number,
    textureKey: string,
    x = 0,
    y = x
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this.width = width;
    this.height = height;
    this.corner = corner;
    this.textureKey = textureKey;
    this.originalX = x;
    this.originalY = y;

    this.createNineSlice();
  }

  private createNineSlice() {
    const texture = this.scene.sys.textures.get(this.textureKey);
    const baseFrame = texture.get('__BASE');

    texture.add(this.topLeft, 0, 0, 0, this.corner, this.corner);
    texture.add(this.topCenter, 0, this.corner, 0, baseFrame.width - this.corner * 2, this.corner);
    texture.add(this.topRight, 0, baseFrame.width - this.corner, 0, this.corner, this.corner);
    texture.add(this.middleLeft, 0, 0, this.corner, this.corner, baseFrame.height - this.corner * 2);
    texture.add(
      this.middleCenter,
      0,
      this.corner,
      this.corner,
      baseFrame.width - this.corner * 2,
      baseFrame.height - this.corner * 2
    );
    texture.add(
      this.middleRight,
      0,
      baseFrame.width - this.corner,
      this.corner,
      this.corner,
      baseFrame.height - this.corner * 2
    );
    texture.add(this.bottomLeft, 0, 0, baseFrame.height - this.corner, this.corner, this.corner);
    texture.add(
      this.bottomCenter,
      0,
      this.corner,
      baseFrame.height - this.corner,
      baseFrame.width - this.corner * 2,
      this.corner
    );
    texture.add(
      this.bottomRight,
      0,
      baseFrame.width - this.corner,
      baseFrame.height - this.corner,
      this.corner,
      this.corner
    );

    const topLet = this.scene.add.image(0, 0, this.textureKey, this.topLeft).setOrigin(0);

    const topCenter = this.scene.add
      .image(topLet.displayWidth, 0, this.textureKey, this.topCenter)
      .setOrigin(0);

    topCenter.displayWidth = this.width - this.corner * 2;

    const topRight = this.scene.add
      .image(topLet.displayWidth + topCenter.displayWidth, 0, this.textureKey, this.topRight)
      .setOrigin(0);

    const middleLeft = this.scene.add
      .image(0, topLet.displayHeight, this.textureKey, this.middleLeft)
      .setOrigin(0);

    middleLeft.displayHeight = this.height - this.corner * 2;

    const middleCenter = this.scene.add
      .image(middleLeft.displayWidth, middleLeft.y, this.textureKey, this.middleCenter)
      .setOrigin(0);

    middleCenter.displayHeight = this.height - this.corner * 2;
    middleCenter.displayWidth = this.width - this.corner * 2;

    const middleRight = this.scene.add
      .image(
        middleLeft.displayWidth + middleCenter.displayWidth,
        middleLeft.y,
        this.textureKey,
        this.middleRight
      )
      .setOrigin(0);

    middleRight.displayHeight = middleCenter.displayHeight;

    const bottomLeft = this.scene.add
      .image(0, topLet.displayHeight + middleLeft.displayHeight, this.textureKey, this.bottomLeft)
      .setOrigin(0);

    const bottomCenter = this.scene.add
      .image(bottomLeft.displayWidth, bottomLeft.y, this.textureKey, this.bottomCenter)
      .setOrigin(0);

    bottomCenter.displayWidth = topCenter.displayWidth;

    const bottomRight = this.scene.add
      .image(
        bottomLeft.displayWidth + bottomCenter.displayWidth,
        bottomLeft.y,
        this.textureKey,
        this.bottomRight
      )
      .setOrigin(0);

    this.add([
      topLet,
      topCenter,
      topRight,
      middleLeft,
      middleCenter,
      middleRight,
      bottomLeft,
      bottomCenter,
      bottomRight,
    ]);
  }

  public setOrigin(x = 0, y = x) {
    if (this.customOriginX !== x) {
      this.customOriginX = x;
    }

    if (this.customOriginY !== y) {
      this.customOriginY = y;
    }

    this.setX(this.originalX - this.displayWidth * x);
    this.setY(this.originalY - this.displayHeight * y);

    return this;
  }

  public override setPosition(x = 0, y = x, z?: number, w?: number) {
    this.originalX = x;
    this.originalY = y;
    this.setOrigin(this.customOriginX, this.customOriginY);
    this.setW(w);
    this.setZ(z);

    return this;
  }
}

export { NineSlice };
