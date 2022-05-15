export class buildMenu {
  object: Phaser.GameObjects.Sprite;
  children: Phaser.GameObjects.Sprite[];

  getChildren(): Phaser.GameObjects.Sprite[];
  addChild(child: Phaser.GameObjects.Sprite): void;
  add(object: Phaser.GameObjects.Sprite): void;
  kill(): void;
}
