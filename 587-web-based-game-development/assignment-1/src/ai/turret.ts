import { Director } from "../director";
import { GuiController } from "../ui/guiController";
import { EnemyController } from "./enemy";
import { Entity } from "./entity";

export class TurretController extends Entity {
  turretState: string;
  sprite: Phaser.GameObjects.Sprite;
  scene: Phaser.Scene;
  atlas: string;
  clicked: boolean;
  guiController: GuiController;
  overlaySprite: Phaser.GameObjects.Sprite;
  director: Director;
  id: number;
  shootTime: number = 0;
  shootTimeSprite: number = 0;
  shootRate: number = 5;
  target: EnemyController | null = null;
  tier: number = -1;

  constructor(
    director: Director,
    maxHealth: number,
    sprite: Phaser.GameObjects.Sprite,
    turretState: string,
    scene: Phaser.Scene,
    atlas: string,
    guiController: GuiController,
    id: number,
    shootRate: number
  ) {
    super(maxHealth, sprite);
    this.turretState = turretState;
    this.scene = scene;
    this.atlas = atlas;
    this.clicked = false;
    this.guiController = guiController;
    this.director = director;
    this.sprite = sprite;
    this.overlaySprite = this.scene.add
      .sprite(this.sprite.x, this.sprite.y, this.atlas, "blank")
      .setOrigin(0)
      .setScale(2);
    this.id = id;
    this.shootRate = shootRate;
  }

  init() {
    this.sprite.setInteractive();
    this.sprite.on("pointerup", () => {
      this.guiController.clickTurret(this.sprite);
    });
    this.sprite.on("pointerover", () => {
      this.guiController.overTurret(this.sprite);
    });
    this.sprite.on("pointerout", () => {
      this.guiController.outTurret(this.sprite);
    });
  }

  setSprite(type: string) {
    switch (type) {
      case "turret":
        this.tier = 0;
        this.overlaySprite.setTexture(this.atlas, "turret_0_up");
        break;

      case "upgrade":
        this.tier++
        this.overlaySprite.setTexture(this.atlas, "turret_1_up")
        if (this.tier > 4) {this.tier = 4};
        break;

      case "destroy":
        this.tier = -1;
        this.overlaySprite.setTexture(this.atlas, "blank");
        break;

      default:
        break;
    }
  }

  calcDistance(enemy: EnemyController): number {
    let xDelta = enemy.sprite.x - this.sprite.y;
    let yDelta = enemy.sprite.y - this.sprite.y;

    return Math.sqrt(xDelta ** 2 + yDelta ** 2);
  }

  calcDistanceFromDelta(xDelta: number, yDelta: number) {
    return Math.sqrt(Math.abs(xDelta) ** 2 + yDelta ** 2);
  }

  getClosestEnemy(): EnemyController | null {
    let distanceMax = 1024;
    let closest: EnemyController | null = null;
    this.director.enemyControllers.forEach((element) => {
      if (element != null) {
        let elementDistance = this.calcDistance(element);
        if (Math.abs(elementDistance) < distanceMax) {
          closest = element;
          distanceMax = Math.abs(elementDistance);
        }
      }
    });
    return closest;
  }

  changeSprite(xDelta: number, yDelta: number, tier: number, firing: boolean) {

    let firingVal = "";
    if (firing) {
      firingVal += "_fire";
    }

    let slope = Math.abs(yDelta / xDelta);
    if (slope > 2) {
      if (yDelta >= 0) {
        this.overlaySprite.setTexture(this.atlas, `turret_${tier}_up${firingVal}`);
      } else {
        this.overlaySprite.setTexture(this.atlas, `turret_${tier}_down${firingVal}`);
      }
    } else if (slope < 1 / 2) {
      if (xDelta >= 0) {
        this.overlaySprite.setTexture(this.atlas, `turret_${tier}_left${firingVal}`);
      } else {
        this.overlaySprite.setTexture(this.atlas, `turret_${tier}_right${firingVal}`);
      }
    } else {
      if (xDelta >= 0) {
        if (yDelta >= 0) {
          this.overlaySprite.setTexture(this.atlas, `turret_${tier}_up_left${firingVal}`);
        } else {
          this.overlaySprite.setTexture(this.atlas, `turret_${tier}_down_left${firingVal}`);
        }
      } else {
        if (yDelta >= 0) {
          this.overlaySprite.setTexture(this.atlas, `turret_${tier}_up_right${firingVal}`);
        } else {
          this.overlaySprite.setTexture(
            this.atlas,
            `turret_${tier}_down_right${firingVal}`
          );
        }
      }
    }
  }

  step(time: number, delta: number) {
    if (this.tier >= 0) {
      let closest: EnemyController | null = this.getClosestEnemy();

      // we have our closest target now, and know it's distance
      if (closest != null) {
        let xDelta = this.sprite.x - closest.sprite.x;
        let yDelta = this.sprite.y - closest.sprite.y;

        if (time > this.shootTime) {
          if (this.calcDistanceFromDelta(xDelta, yDelta) < 256) {
            closest.damage(this.director.turretDamageTable[this.tier]);
            this.shootTime = time + 1000 / this.shootRate;
            this.shootTimeSprite = time + 1000 / this.shootRate / 2;
            this.changeSprite(xDelta, yDelta, this.tier, true);
          } else {
            this.changeSprite(xDelta, yDelta, this.tier, false);
          }
        } else if (time > this.shootTimeSprite) {
          this.changeSprite(xDelta, yDelta, this.tier, true);
        } else {
          this.changeSprite(xDelta, yDelta, this.tier, false);
        }
      }
    }
  }

  // out of scope
  damage() {}
}
