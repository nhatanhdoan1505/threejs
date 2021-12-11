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

  async loadModel() {
    try {
      return await this.service.load3DModel();
    } catch (error) {
      console.error(error);
    }
  }
}
