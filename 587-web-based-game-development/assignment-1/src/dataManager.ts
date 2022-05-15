export class DataManager {
  scene: Phaser.Scene;

  constructor(scene) {
    this.scene = scene;
  }

  loadAtlasToCache() {
    this.scene.load.atlas({
      key: "atlas",
      textureURL: "atlas/atlas.png",
      atlasURL: "atlas/atlas.json",
    });
  }

  loadJsonToCache(key: string, path: string) {
    this.scene.load.json({
      key: key,
      url: path,
    });
  }

  getCache(key: string) {
    return this.scene.cache.json.get(key);
  }

  clearCache(key: string) {
    this.scene.cache.json.remove(key);
  }
}
