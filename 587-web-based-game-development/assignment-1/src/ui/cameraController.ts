import { GameGrid } from "../grid";

export class CameraController {
  camera: Phaser.Cameras.Scene2D.Camera;
  scene: Phaser.Scene;
  sceneGrid: GameGrid;

  calcBounds(): void {
    let viewWidth = this.sceneGrid.getHeaderWidth();
    let viewHeight = this.sceneGrid.getTotalHeight();

    let boundX = Math.min(
      0,
      (1 / 2) * this.sceneGrid.getHeaderWidth() - (1 / 2) * viewWidth
    );
    let boundWidth = Math.max(viewWidth, this.sceneGrid.getHeaderWidth());
    let boundHeight = Math.min(viewHeight, this.sceneGrid.getTotalHeight());
    this.camera.setBounds(boundX, 0, boundWidth, boundHeight);
  }

  init(scene: Phaser.Scene): void {
    // Set the camera bounds to be the size of the image
    this.calcBounds();
    // Center the image using these new bounds
    this.camera.centerOn(this.sceneGrid.getHeaderWidth() / 2, 0);

    // placeholder movement script
    const mouse = scene.input.mouse;
    mouse.disableContextMenu();

    scene.input.on("pointermove", (pointer) => {
      let deltaX = pointer.position.x - pointer.prevPosition.x;
      let deltaY = pointer.position.y - pointer.prevPosition.y;
      if (pointer.isDown) {
        this.camera.scrollX = this.camera.clampX(this.camera.scrollX - deltaX);
        this.camera.scrollY = this.camera.clampY(this.camera.scrollY - deltaY);
      }
    });
  }

  resize(): void {
    this.calcBounds();
    this.camera.scrollX = this.camera.clampX(this.camera.scrollX);
    this.camera.scrollY = this.camera.clampY(this.camera.scrollY);
  }

  constructor(scene: Phaser.Scene, sceneGrid: GameGrid) {
    this.camera = scene.cameras.main;
    this.scene = scene;
    this.sceneGrid = sceneGrid;
  }
}
