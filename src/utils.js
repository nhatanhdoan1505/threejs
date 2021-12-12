import { FBXLoader } from "./lib/three.js/examples/jsm/loaders/FBXLoader.js";

export class Utils {
  async load3DModel(path) {
    return new Promise(function (resolve, reject) {
      const loaders = new FBXLoader();
      loaders.load(
        path,
        (object) => {
          resolve(object);
        },
        (xhr) => {
          console.log(
            "The car model is " + (xhr.loaded / xhr.total) * 100 + "% loaded"
          );
        },
        (err) => {
          console.log("An error happened in loading car model: " + err);
        }
      );
    });
  }

  randomQuatityChallenge(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  randomDirection(keyCode) {
    return keyCode[this.randomQuatityChallenge(0, keyCode.length)];
  }
}
