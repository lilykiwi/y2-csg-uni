import { Director } from "../director";
import { BuildButton } from "./buildButton";

export class BuildMenu {
  scene: Phaser.Scene;
  atlas: string;
  target: Phaser.GameObjects.Sprite | undefined;
  object: Phaser.GameObjects.Sprite | undefined;
  children: BuildButton[] = [];
  clicked: boolean;
  director: Director;

  childOffset = [64, 32];
  gridSize = 64;

  turretTypes = [
    {
      name: "turret",
      animated: true,
      rateOfFire: 5,
      damage: 5,
      sprite: "roundTurret",
    },
    {
      name: "upgrade",
      sprite: "upgrade",
    },
    {
      name: "destroy",
      sprite: "destroy",
    },
  ];

  constructor(scene: Phaser.Scene, atlas: string, director: Director) {
    this.scene = scene;
    this.atlas = atlas;
    this.clicked = false;
    this.director = director;
  }

  /**
   *
   * @param {Phaser.GameObjects.Sprite} child
   * @returns {void} void
   */
  addButtons(): void {
    for (let i = 0; i < this.turretTypes.length; i++) {
      const element = this.turretTypes[i];

      if (this.target == undefined)
        throw new Error("tried to add a menu child without a target!");
      let childSprite = this.scene.add
        .sprite(
          this.target.x + this.childOffset[0] + i * this.gridSize,
          this.target.y + this.childOffset[1],
          this.atlas,
          "buildMenu_hover"
        )
        .setOrigin(0)
        .setScale(2);
      let childHandle;
      if (i == this.turretTypes.length - 1) {
        childHandle = this.scene.add
          .sprite(
            this.target.x + this.childOffset[0] + i * this.gridSize,
            this.target.y,
            this.atlas,
            "buildMenu_handle"
          )
          .setOrigin(0)
          .setScale(2);
      } else {
        childHandle = this.scene.add
          .sprite(
            this.target.x + this.childOffset[0] + i * this.gridSize,
            this.target.y,
            this.atlas,
            "buildMenu_handle_mid"
          )
          .setOrigin(0)
          .setScale(2);
      }

      let child = new BuildButton(
        this,
        childSprite,
        childHandle,
        element.name,
        this.target.data.values.turretController
      );

      child.init();
      this.children.push(child);
    }
  }

  /**
   * Sets the sprite of the build menu object
   * @param {string} texture to use
   */
  setSprite(texture: string): void {
    this.object?.setTexture(this.atlas, texture);
  }

  /**
   * Function that sets the current target. Note that there is no checking for whether this is legal, always destroy() your other target before calling this!
   * @param {target} The sprite GameObject to check
   */
  setTarget(target: Phaser.GameObjects.Sprite): void {
    this.target = target;
    this.object = this.scene.add
      .sprite(target.x, target.y, this.atlas, "buildMenu_hover")
      .setOrigin(0)
      .setScale(2);
  }

  /**
   * Handler for the buildButton class when clicked, updates the turretController with a sprite and AI type.
   * @param turretType
   */
  clickButton(turretType: string): void {
    switch (turretType) {
      case "turret":
        this.target?.data.values.turretController.setSprite(turretType);
        this.destroy();
        break;
      case "upgrade":
        this.target?.data.values.turretController.setSprite(turretType);
        this.destroy();
        break;
      case "destroy":
        this.target?.data.values.turretController.setSprite(turretType);
        this.destroy();
        break;
      default:
        break;
    }

  }

  /**
   * Handler for the overTurret() function in guiController
   * @param {target} The sprite GameObject to check against
   */
  over(target: Phaser.GameObjects.Sprite): void {
    if (this.target == undefined) {
      this.setTarget(target);
    }
  }

  /**
   * Handler for the outTurret() function in guiController
   * @param {target} The sprite GameObject to check against
   */
  out(target: Phaser.GameObjects.Sprite): void {
    if (this.target == target && this.clicked == false) {
      this.destroy();
    }
  }

  // todo: deselect if clicked outside of target or button
  /**
   * Handler for the clickTurret() function in guiController
   * @param {target} The sprite GameObject to check against
   */
  click(target: Phaser.GameObjects.GameObject): void {
    if (this.clicked == false && this.target != undefined) {
      this.clicked = true;
      this.setSprite("buildMenu_clicked");
      this.addButtons();
    } else if (this.clicked == true && this.target == target) {
      this.clicked = false;
      this.setSprite("buildMenu_hover");
      this.destroyChildren();
    }
  }

  /**
   * Un-sets the target, destroys all of the children (buttons) and objects. This should be called to set this.target to undefined (removing the UI element)
   */
  destroy(): void {
    this.object?.destroy();
    this.children.forEach((element) => {
      element.destroy();
    });
    this.target = undefined;
    this.clicked = false;
  }

  /**
   * Removes click menu, destroys children
   */
  destroyChildren(): void {
    this.children.forEach((element) => {
      element.destroy();
    });
    this.clicked = false;
  }
}
