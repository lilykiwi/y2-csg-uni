export class Entity {
  health: number;
  maxHealth: number;
  sprite: Phaser.GameObjects.Sprite;

  constructor(maxHealth: number, sprite: Phaser.GameObjects.Sprite) {
    this.health = maxHealth;
    this.maxHealth = maxHealth;
    this.sprite = sprite;
  }

  // prototypes
  init(): void {}
  step(time: number, delta: number): void {}
  damage(val: number): void {}
  die(): void {}
}
