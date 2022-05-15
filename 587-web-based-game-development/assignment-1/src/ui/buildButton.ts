import { BuildMenu } from "buildMenu";
import { TurretController } from "../ai/turret";

//todo
export class BuildButton {
  sprite: Phaser.GameObjects.Sprite;
  spriteHandle: Phaser.GameObjects.Sprite;
  parent: BuildMenu;
  buildType: string;
  turretController: TurretController;

  constructor(
    parent: BuildMenu,
    sprite: Phaser.GameObjects.Sprite,
    spriteHandle: Phaser.GameObjects.Sprite,
    buildType: string,
    turretController: TurretController
  ) {
    this.parent = parent;
    this.sprite = sprite;
    this.spriteHandle = spriteHandle;
    this.buildType = buildType;
    this.turretController = turretController;
  }

  init() {
    this.sprite.setTexture(this.parent.atlas, `buildMenu_${this.buildType}`);
    this.sprite.setInteractive();
    this.sprite.on("pointerup", () => {
      this.parent.clickButton(this.buildType);
    });
    this.sprite.on("pointerover", () => {
      this.sprite.setTexture(this.parent.atlas, `buildMenu_${this.buildType}_hover`);
    });
    this.sprite.on("pointerout", () => {
      this.sprite.setTexture(this.parent.atlas, `buildMenu_${this.buildType}`);
    });
  }

  destroy(): void {
    this.sprite.destroy();
    this.spriteHandle.destroy();
  }
}
