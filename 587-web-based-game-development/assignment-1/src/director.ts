import { GameGrid } from "./grid";
import { CameraController } from "./ui/cameraController";
import { TurretController } from "./ai/turret";
import { EnemyController } from "./ai/enemy";
import { GuiController } from "./ui/guiController";
import { DataManager } from "./dataManager";
import { SceneData } from "./types/sceneData";
import { Time } from "phaser";

export class Director {
  turnVal: number;
  sceneVal: number;
  points: number = 20;

  scene: Phaser.Scene;

  sceneData!: SceneData;
  sceneGrid!: GameGrid;
  cameraController!: CameraController;
  guiController!: GuiController;
  dataManager: DataManager;

  turretControllers: TurretController[] = [];
  enemyControllers: EnemyController[] = [];

  turretDamageTable = {
    0: 1,
    1: 2,
    2: 4,
    3: 8,
    4: 16
  }

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.turnVal = -1;
    this.sceneVal = -1;
    this.dataManager = new DataManager(this.scene);

    this.dataManager.loadJsonToCache("scene0", "scenes/scene0.json");
    this.dataManager.loadJsonToCache("scene1", "scenes/scene1.json");
    this.dataManager.loadJsonToCache("scene2", "scenes/scene2.json");
    this.dataManager.loadJsonToCache("scene3", "scenes/scene3.json");
    this.dataManager.loadJsonToCache("scene4", "scenes/scene4.json");
    this.dataManager.loadAtlasToCache();
  }

  resize(): void {
    this.cameraController.resize();
  }

  // initialization block ------------------------------------------------------

  create() {
    this.guiController = new GuiController(this.scene, "atlas", this);
    this.sceneGrid = new GameGrid(this);
    this.cameraController = new CameraController(this.scene, this.sceneGrid);
    this.scene.scale.on("resize", this.resize, this);
  }

  addTurret() {}

  addEnemy() {}

  // execution block -----------------------------------------------------------

  lastSpawn: number = 0;
  spawnDelay: number = 500; // in ms
  lastSpawned: number = 0;
  spawnPoints: Array<Phaser.GameObjects.Sprite> = [];
  val = 0;

  step(time: number, delta: number) {
    if (this.lastSpawn + this.spawnDelay < time) {

      for (let i = 0; i < this.spawnPoints.length; i++) {
        const spawnPoint = this.spawnPoints[i];
        let enemySprite = this.scene.add
          .sprite(spawnPoint.x, 32, "atlas", "enemy_0")
          .setOrigin(0)
          .setScale(2);
        let enemyController = new EnemyController(
          this, // parent (this)
          5, // health
          2, // tiles per second
          enemySprite, // sprite
          spawnPoint, // spawnpoint
          this.val
        );
        enemyController.sprite.setData("spawnorder", this.val);
        enemyController.lastTile = spawnPoint;
        enemyController.init();

        this.val++;
        this.enemyControllers.push(enemyController);
      }
      this.lastSpawn = time;
    }

    this.turretControllers.forEach((element) => {
      element.step(time, delta);
    });

    this.enemyControllers.forEach((element) => {
      element.step(time, delta);
    });

    // TODO: resources

    // TODO: game state

    //turnData

    // FIXME: placeholder val
    // add a turn count to each stage in the scene json
    if (this.turnVal > 10) {
      this.winStage();
    }
  }

  // methods -------------------------------------------------------------------

  setScene(val: number) {
    console.log(`setting scene ${val}`);
    // get new json cache
    this.turnVal = 1;
    this.sceneVal = val;

    // remove old scene and reset values
    this.sceneGrid.clearScene();

    // update scene data
    this.sceneGrid.sceneData = this.dataManager.getCache(
      "scene" + this.sceneVal
    );

    // render the new data
    this.sceneGrid.render("atlas", this.guiController);

    this.turretControllers = this.sceneGrid.getTurretList();
    this.spawnPoints = this.sceneGrid.getSpawnPoints();

    this.turretControllers.forEach((element) => {
      element.init();
    });

    this.cameraController.init(this.scene);

    console.log("scene done!");
  }

  /**
   * updates an existing turret object with a new sprite and type.
   */
  buildTurret() {}

  destroyTurret(object: TurretController) {
    delete this.turretControllers[
      this.turretControllers.indexOf(object)
    ];
  }

  destroyEnemy(object: EnemyController) {
    delete this.enemyControllers[
      this.enemyControllers.indexOf(object)
    ];
  }

  /**
   * called when the stage is complete, advances the stage to the next scene.
   */
  winStage() {
    this.turretControllers = [];
    this.enemyControllers = [];
    this.setScene(this.sceneVal + 1);
  }

  losePoints(val: number) {
    this.points -= val;
    if (this.points <= 0) {
      this.loseStage();
    }
  }

  /**
   * called when the stage is failed, resets the stage.
   */
  loseStage() {
    this.turretControllers = [];
    this.enemyControllers = [];
    this.setScene(this.sceneVal);
    this.guiController.buildMenu.destroy();
  }
}
