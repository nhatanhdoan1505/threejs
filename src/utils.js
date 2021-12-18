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
      src: ["/src/music/start.mp3"],
      // src: [
      //   "https://redirector.googlevideo.com/videoplayback?expire=1639737653&ei=1RS8YYf3OMf9gAeNt7GIBA&ip=207.154.216.138&id=o-ADLxRuFx7sG8GJi69TqmbDeiKfpny2zqdFnRPYkcAuAa&itag=22&source=youtube&requiressl=yes&mh=sj&mm=31%2C29&mn=sn-5hneknee%2Csn-5hne6nsd&ms=au%2Crdu&mv=m&mvi=1&pl=21&initcwndbps=263750&vprv=1&mime=video%2Fmp4&cnr=14&ratebypass=yes&dur=261.061&lmt=1631007751599951&mt=1639715828&fvip=1&fexp=24001373%2C24007246&c=ANDROID&txp=5432434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIhAJiKT7lr7Z396pEHP2W6nn-0Z1VsKu4W7zs-GJZrHNLFAiB5dXyo644gr93UWQT7XLJUVgpxYN1GX9_q7J3jXYkm6g%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhAI9vV-yfiy8S6SovNjN-SY7-iMVYe5UPtcmXMxMKf5ZBAiEAvXQtun4XXd3_nEjmRh3un3oLlx4VbiYP5kpC3vW_Aro%3D&host=rr1---sn-5hneknee.googlevideo.com&title=yt5s.com-%E3%80%90Vietsub%E3%80%91Yoru%20ni%20Kakeru%20(%E5%A4%9C%E3%81%AB%E9%A7%86%E3%81%91%E3%82%8B)%20%7C%20YOASOBI",
      // ],
      html5: true,
    });
    return sound;
  }
}
