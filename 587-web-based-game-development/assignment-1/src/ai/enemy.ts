import { Time } from "phaser";
import { Director } from "../director";
import { Entity } from "./entity";

export class EnemyController extends Entity {
  constructor(
    director: Director,
    maxHealth: number,
    speed: number,
    sprite: Phaser.GameObjects.Sprite,
    spawnPoint: Phaser.GameObjects.Sprite,
    id: number
  ) {
    super(maxHealth, sprite);

    this.director = director;
    this.lastTile = spawnPoint;
    this.nextTile = spawnPoint;
    this.speed = 1000 / speed;
    this.id = id;
  }

  director: Director;
  nextTile: Phaser.GameObjects.Sprite;
  lastTile: Phaser.GameObjects.Sprite;
  isSpawning: boolean = true;
  speed: number = 1000;
  lastMovementTime: number = -1;
  id: number;

  lerp(a: number, b: number, fac: number) {
    return a + (b - a) * fac;
  }

  move(startX, startY, endX, endY, startTime, duration, time) {
    this.sprite.y = this.lerp(startY, endY, (time - startTime) / duration);
    this.sprite.x = this.lerp(startX, endX, (time - startTime) / duration);
  }

  testJump(target: Phaser.GameObjects.Sprite | null) {
    if (target == null) {
      throw new Error("No target found");
    }
    this.sprite.x = target.x;
    this.sprite.y = target.y;
  }

  getBestNeighbour(
    target: Phaser.GameObjects.Sprite
  ): Phaser.GameObjects.Sprite {
    let tempNeighbours = this.director.sceneGrid.getAdjacentGrid(
      this.lastTile.getData("row"),
      this.lastTile.getData("col")
    );
    let neighbourValues: number[] = [
      tempNeighbours.left?.getData("value") ?? 0,
      tempNeighbours.right?.getData("value") ?? 0,
      tempNeighbours.up?.getData("value") ?? 0,
      tempNeighbours.down?.getData("value") ?? 0,
    ];

    let returnList: Phaser.GameObjects.Sprite[] = [];
    let maxVal = Math.max(...neighbourValues);

    if (neighbourValues[0] == maxVal) {
      returnList.push(tempNeighbours.left!);
    }
    if (neighbourValues[1] == maxVal) {
      returnList.push(tempNeighbours.right!);
    }
    if (neighbourValues[2] == maxVal) {
      returnList.push(tempNeighbours.up!);
    }
    if (neighbourValues[3] == maxVal) {
      returnList.push(tempNeighbours.down!);
    }

    if (returnList.length == 0) {
      throw new Error("No neoighbour found: returnList empty");
    }
    if (returnList.length == 1) {
      return returnList[0];
    }
    return returnList[Math.floor(this.sprite.getData("spawnorder") % returnList.length)];
  }

  step(time: number, delta: number) {
    if (this.health > 0) {
      this.move(
        this.lastTile.x,
        this.lastTile.y,
        this.nextTile.x,
        this.nextTile.y,
        this.lastMovementTime,
        this.speed,
        time
      );

      if (time > this.speed + this.lastMovementTime) {
        this.lastTile = this.nextTile;
        this.nextTile = this.getBestNeighbour(this.lastTile);
        this.lastMovementTime = time;
      }

      if (this.lastTile.getData("end")) {
        this.director.losePoints(1);
        this.die();
      }
    } else {
      this.die();
    }
  }

  damage(val: number) {
    this.health -= val;
  }

  die() {
    this.sprite.destroy();
    this.director.destroyEnemy(this);
  }
}
