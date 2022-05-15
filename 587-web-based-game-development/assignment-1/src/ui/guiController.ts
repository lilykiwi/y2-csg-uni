import { Director } from "../director";
import { BuildMenu } from "./buildMenu";

// todo
export class GuiController {
  scene: Phaser.Scene;
  atlas: string;
  buildMenu: BuildMenu;
  director: Director;

  constructor(scene: Phaser.Scene, atlas: string, director: Director) {
    this.scene = scene;
    this.director = director;
    this.atlas = atlas;
    this.buildMenu = new BuildMenu(scene, atlas, director);
  }

  overTurret(element: Phaser.GameObjects.Sprite): void {
    this.buildMenu.over(element);
  }

  outTurret(element: Phaser.GameObjects.Sprite): void {
    this.buildMenu.out(element);
  }

  clickTurret(element: Phaser.GameObjects.Sprite): void {
    this.buildMenu.click(element);
  }
}
