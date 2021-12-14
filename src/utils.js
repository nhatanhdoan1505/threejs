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

  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  randomDirection(keyCode) {
    return keyCode[this.randomNumber(0, keyCode.length)];
  }

  compareTwoArray(a, b) {
    for (let i in a) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  loadSound() {
    const sound = new Howl({
      // src: ["/src/music/start.mp3"],
      src: ["/src/music/start.mp3"],
      html5: true,
    });
    return sound;
  }
}
