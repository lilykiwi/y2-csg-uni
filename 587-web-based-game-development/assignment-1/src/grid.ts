import { TurretController } from "./ai/turret";
import { Director } from "./director";
import { SceneData } from "./types/sceneData";
import { GuiController } from "./ui/guiController";

/**
 * Shorthand to add an image with the correct origin and scale.
 * @param scene to add the image to
 * @param x position in PIXELS
 * @param y position in PIXELS
 * @param atlas string
 * @param name string
 * @returns new Phaser.GameObjects.Image
 */
function addImage(
  scene: Phaser.Scene,
  x: number,
  y: number,
  atlas: string,
  name: string
): Phaser.GameObjects.Image {
  return scene.add.image(x, y, atlas, name).setOrigin(0).setScale(2);
}

/**
 * Returns an integer bitmask based on the adjacent spots using an array of tile values to check for
 * @param tileMask a set of tiles that we're checking for in the adjacent spots
 * @param up the value of the tile above
 * @param left the value of the tile to the left
 * @param right the value of the tile to the right
 * @param down the value of the tile below
 * @returns 4 bit integer mask
 */
function bitMask(
  tileMask: integer[],
  up: integer,
  left: integer,
  right: integer,
  down: integer
) {
  let temp: integer = 0;
  if (tileMask.includes(up)) temp += 1;
  if (tileMask.includes(left)) temp += 2;
  if (tileMask.includes(right)) temp += 4;
  if (tileMask.includes(down)) temp += 8;
  return temp;
}

export class GameGrid {
  //todo change these
  sceneData!: SceneData;
  pathList!: Phaser.GameObjects.Group;
  turretList: TurretController[] = [];
  grid: Phaser.GameObjects.Sprite[][] = [];
  director: Director;

  objectList: Phaser.GameObjects.GameObject[] = [];

  /**
   *
   * @param {Phaser.Scene} scene
   * @param {SceneData} scene - tileMap JSON, leave empty and fill with other methods
   */
  constructor(
    //todo change these
    director: Director
  ) {
    //todo change these
    this.director = director;
  }

  /**
   * Gets the value of a cell at position x,y
   * @param {number} x position in the grid
   * @param {number} y position in the grid
   * @returns {number} The value of the position
   */
  get(row: number, col: number): number {
    if (col >= 0 && col < this.sceneData.data.body.length)
      return this.sceneData.data.body[col][row];
    else return -1;
  }

  /**
   * Gets the value of a cell at position x,y
   * @param {number} row in the grid
   * @param {number} column in the grid
   * @returns {{up: number, left: number, down: number, right: number}} The value of the position
   */
  getAdjacent(
    col: number,
    row: number
  ): { up: number; left: number; down: number; right: number } {
    return {
      up: this.get(col, row - 1),
      down: this.get(col, row + 1),
      left: this.get(col - 1, row),
      right: this.get(col + 1, row),
    };
  }

  /**
   * Gets the value of a cell at position x,y
   * @param {number} x position in the grid
   * @param {number} y position in the grid
   * @returns {number} The value of the position
   */
  getGrid(row: number, col: number): Phaser.GameObjects.Sprite | null {
    if (this.grid.hasOwnProperty(col))
      if (this.grid[col].hasOwnProperty(row)) return this.grid[col][row];
      else return null
    else return null
  }

  setGrid(row: number, col: number, obj: Phaser.GameObjects.Sprite) {
    this.grid[col][row] = obj;
  }

  /**
   * Gets the value of a cell at position x,y
   * @param {number} x position in the grid
   * @param {number} y position in the grid
   * @returns {{up: number, left: number, down: number, right: number}} The value of the position
   */
  getAdjacentGrid(
    row: number,
    col: number
  ): {
    up: Phaser.GameObjects.Sprite | null;
    left: Phaser.GameObjects.Sprite | null;
    down: Phaser.GameObjects.Sprite | null;
    right: Phaser.GameObjects.Sprite | null;
  } {
    return {
      up: this.getGrid(col, row - 1),
      down: this.getGrid(col, row + 1),
      left: this.getGrid(col - 1, row),
      right: this.getGrid(col + 1, row),
    };
  }

  /**
   * Gets the width of the header from the scene file (in pixels)
   * @returns {number} width of header (scene overall)
   */
  getHeaderWidth(): number {
    return this.sceneData.meta.headerWidth * this.sceneData.meta.tileSize;
  }

  /**
   * Gets the width of the body from the scene file (in pixels)
   * @returns {number} width of body
   */
  getBodyWidth(): number {
    return this.sceneData.meta.bodyWidth * this.sceneData.meta.tileSize;
  }

  /**
   * Gets the total height of the scene + 256 (for background)
   * @returns {number} height
   */
  getTotalHeight(): number {
    return this.sceneData.data.body.length * 64;
  }

  /**
   * Gets any spawn points using the header
   * @returns {Phaser.GameObjects.Sprite[]}
   */
  getSpawnPoints(): Phaser.GameObjects.Sprite[] {
    let temp: Phaser.GameObjects.Sprite[] = [];

    // add all elements from 0th row to a list
    this.grid[0].forEach((element) => {
      // if not null, it's a tile we need to check
      if (element != null) temp.push(element);
      element.setData("value", 0);
    });

    return temp;
  }

  getTurretList(): TurretController[] {
    return this.turretList;
  }

  clearScene(): void {
    this.objectList.map((element) => {
      element.destroy();
    });

    this.turretList = []
  }

  /**
   * initialises the grid and calculates the offset for the rest of the grid. Also adds images for grass and header.
   */
  initialiseGrid(atlas: string): void {
    let heightInUnits = this.sceneData.data.body.length;
    let widthInUnits = this.sceneData.data.body[0].length;

    for (let i = 0; i < heightInUnits; i++) {
      this.grid.push([]);
    }

    // add background images
    // - creates a background using grass elements
    //     xxxxxxxxxxx (nothing here)
    //     xxxxxxxxxxx
    //     xxxxxxxxxxx
    //     ggggggggggg (start here)
    //     ...         (n length)
    // this section overlaps with the header as the bottom 64px are transparent.
    for (let col = 0; col < this.sceneData.data.header.length; col += 1) {
      for (let row = 0; row < this.sceneData.data.body.length + 1; row += 1) {
        this.objectList.push(
          addImage(
            this.director.scene,
            col * 64,
            (row + 3) * 64,
            atlas,
            "grass"
          )
        );
      }
    }

    // add header images
    // - adds the header (overlaps 1 element of grass)
    //      hhhhhhhhhhh
    //      hhhhhhhhhhh
    //      hhhhhhhhhhh (no grass here)
    //      hhhhhhhhhhh (grass here)
    for (let col = 0; col < this.sceneData.data.header.length; col++) {
      const element = this.sceneData.data.header[col];
      this.objectList.push(
        addImage(this.director.scene, col * 64, 0, atlas, element)
      );
    }
  }

  resolveTiles(atlas: string, guiController: GuiController): void {
    // what does this section do?
    // - initialises two scene groups
    // - adds sprites for objects based on their value in the grid
    // - bitmasks the paths
    // - bitmasks the emplacements and gives them a turretController each

    let horizOffset = this.getHeaderWidth() / 2 - this.getBodyWidth() / 2;
    let vertOffset = -1;

    const emplacementsToRender = this.director.scene.add.group();
    this.pathList = this.director.scene.add.group();

    for (let row = 0; row < this.sceneData.data.body.length; row++) {
      const rowArray = this.sceneData.data.body[row];
      for (let col = 0; col < rowArray.length; col++) {
        const element = rowArray[col];
        switch (element) {
          case 1:
            //todo append this to a global list
            let tempObj = this.director.scene.add
              .sprite(
                horizOffset + col * 64,
                (vertOffset + row) * 64,
                atlas,
                "path"
              )
              .setOrigin(0)
              .setScale(2)
              .setData("row", row)
              .setData("col", col)
              .setData("value", 999);
            this.pathList.add(tempObj);
            this.setGrid(col, row, tempObj);
            break;
          case 2:
            emplacementsToRender.add(
              this.director.scene.add
                .sprite(
                  horizOffset + col * 64,
                  (vertOffset + row) * 64,
                  atlas,
                  "emplacement_0"
                )
                .setOrigin(0)
                .setScale(2)
                .setData("row", row)
                .setData("col", col)
                .setData("blank", false)
            );
            break;
          case 3:
            // Blank emplacement wall
            emplacementsToRender.add(
              this.director.scene.add
                .sprite(
                  horizOffset + col * 64,
                  (vertOffset + row) * 64,
                  atlas,
                  "barrier_0"
                )
                .setOrigin(0)
                .setScale(2)
                .setData("row", row)
                .setData("col", col)
                .setData("blank", true)
            );
            break;
          case 4:
            // invisible path
            //    -- not sure how this doesn't get a sprite but it does!
            let endOfPathTemp = this.director.scene.add.sprite(
              horizOffset + col * 64,
              (vertOffset + row) * 64,
              atlas,
              "path"
            )
            .setOrigin(0)
            .setScale(2)
            .setData("row", row)
            .setData("col", col)
            .setData("value", 999)
            this.pathList.add(endOfPathTemp);
            this.setGrid(col, row, endOfPathTemp);
            break;
          case 5:
            // player base
            let invisPathTemp = this.director.scene.add
              .sprite(
                horizOffset + col * 64,
                (vertOffset + row) * 64,
                atlas,
                "path_1"
              )
              .setOrigin(0)
              .setScale(2)
              .setData("row", row)
              .setData("col", col)
              .setData("value", 999)
              .setData("end", true);
              this.pathList.add(invisPathTemp);
              this.setGrid(col, row, invisPathTemp);
            break;
          case 0:
            break;
          default:
            throw new Error("Unrecognised value in tilemap");
            break;
        }
      }
    }

    // this is a Phaser.GameObjects.Sprite but you can't easily cast it B)
    this.pathList.getChildren().forEach((element: any) => {
      if (element.getData("end")) {
        this.director.scene.add.sprite(
          element.x - 64, // 1 to left
          element.y,      // and 0 down
          atlas,
          "temp"
        ).setOrigin(0)
        .setScale(2);
      } else {
        const val: any = this.getAdjacent(
          element.getData("col"),
          element.getData("row")
        );
        let spriteValue = bitMask([1], val.up, val.left, val.right, val.down);
        element.setTexture(atlas, `path_${spriteValue}`);
      }
    });

    // this is a Phaser.GameObjects.Sprite but you can't easily cast it B)
    let i = 0;
    emplacementsToRender.getChildren().forEach((element: any) => {
      const val: any = this.getAdjacent(
        element.getData("col"),
        element.getData("row")
      );
      let spriteValue = bitMask([2, 3], val.up, val.left, val.right, val.down);
      if (element.getData("blank"))
        element.setTexture(atlas, `barrier_${spriteValue}`);
      else {
        element.setTexture(atlas, `emplacement_${spriteValue}`);
        let tc = new TurretController(
          this.director,
          0,
          element,
          "",
          this.director.scene,
          atlas,
          guiController,
          i,
          5
        );
        element.data.values.turretController = tc;
        this.turretList.push(tc);
      }
      i++;
    });

    emplacementsToRender.getChildren().map((element) => {
      this.objectList.push(element);
    });
    this.pathList.getChildren().map((element) => {
      this.objectList.push(element);
    });
  }

  /**
   * Implements Dijkstra's algorithm to resolve a numeric value for each tile. These tiles are used by enemies to navigate to the exit (counting upwards).
   */
  solvePathfinding(): void {
    let tilesToCheck = Array<Phaser.GameObjects.Sprite>();

    // add all elements from 0th row to a list
    this.grid[0].forEach((element) => {
      // if not null, it's a tile we need to check
      if (element != null) tilesToCheck.push(element);
      element.setData("value", 0);
    });

    // while path still has unsolved elements
    while (tilesToCheck.length >= 1) {
      // loop over every tile
      tilesToCheck.forEach((tile) => {

        let row = tile.getData("row");
        let col = tile.getData("col");

        if (tile.getData("value") != 0) {
          // only do this for tiles with a value not equal to 0

          let tempNeighbours = this.getAdjacentGrid(row, col);

          let highestValue = Math.min(
            tempNeighbours.left?.getData("value") ?? 100,
            tempNeighbours.right?.getData("value") ?? 100,
            tempNeighbours.up?.getData("value") ?? 100,
            tempNeighbours.down?.getData("value") ?? 100
          );

          highestValue++;

          tile.setData("value", highestValue);

          //console.log(tile.getData("value"), "with", highestValue);
          //console.log(tempNeighbours);
        }

        // remove this element from the list
        tilesToCheck.splice(tilesToCheck.indexOf(tile), 1);

        let adjacent = this.getAdjacentGrid(row, col);

        if (adjacent.left != null && adjacent.left.getData("value") > 998)
          tilesToCheck.push(adjacent.left);
        if (adjacent.right != null && adjacent.right.getData("value") > 998)
          tilesToCheck.push(adjacent.right);
        if (adjacent.up != null && adjacent.up.getData("value") > 998)
          tilesToCheck.push(adjacent.up);
        if (adjacent.down != null && adjacent.down.getData("value") > 998)
          tilesToCheck.push(adjacent.down);

        // debug text for path value
        this.director.scene.add.text(tile.x, tile.y, tile.getData("value"));
      });
    }
  }

  /**
   * Renders images to the phaser scene using the tilemap data
   * @param {Phaser.Scene} scene to output images to
   * @param {string} Atlas initialised in
   */
  render(atlas: string, guiController: GuiController): void {
    // Initialise Grid and display images
    console.log("initialising grid")
    this.initialiseGrid(atlas);
    // Resolve Tiles using bit masking technique
    console.log("resolving tiles")
    this.resolveTiles(atlas, guiController);
    // Solve Pathfinding using Dijkstra's algorithm
    console.log("solving pathfinding")
    this.solvePathfinding();
  }
}
