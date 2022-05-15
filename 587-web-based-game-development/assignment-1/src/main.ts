import { GameGrid } from "./grid";
import { CameraController } from "./ui/cameraController";
import { TurretController } from "./ai/turret";
import { EnemyController } from "./ai/enemy";
import { GuiController } from "./ui/guiController";
import { Director } from "./director";

// Game configuration
let config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  pixelArt: true,
  disableContextMenu: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.Center.CENTER_BOTH,
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);
var director: Director;

function preload(this: Phaser.Scene): void {
  director = new Director(this);
}

function create(this: Phaser.Scene): void {
  director.create();
  director.setScene(0);
}

function update(time: number, delta: number): void {
  director.step(time, delta);
}
