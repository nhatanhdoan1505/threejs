import { Utils } from "./utils.js";

export class Controller {
  service = new Utils();

  createObject(geometry, material) {
    let cube = new THREE.Mesh(geometry, material);
    cube.position.x = -1;
    return cube;
  }

  turnOnLight() {
    const light = new THREE.AmbientLight(0x404040);
    return light;
  }

  async loadModel(path) {
    try {
      return await this.service.load3DModel(path);
    } catch (error) {
      console.error(error);
    }
  }
}
