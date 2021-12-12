import { FBXLoader } from "./lib/three.js/examples/jsm/loaders/FBXLoader.js";

export class Utils {
  async load3DModel() {
    return new Promise(function (resolve, reject) {
      const loaders = new FBXLoader();
      loaders.load(
        "src/model/dance/zombie.fbx",
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

  checkKeyPress(value) {
    document.onkeydown = function (e) {
      return { result: e.keyCode === value, press: true };
    };

    return { result: null, press: false };
  }
}
