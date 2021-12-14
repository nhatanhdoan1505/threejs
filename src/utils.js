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
      src: [
        "https://redirector.googlevideo.com/videoplayback?expire=1639522802&ei=kc24Ya6fO6mJ6dsPkKWA8Ak&ip=94.130.69.32&id=o-AHQ5OQNi5JEAAmAMW9YsX3VSZJjbvuxCaMNPRNYx2xzX&itag=22&source=youtube&requiressl=yes&mh=Rd&mm=31%2C26&mn=sn-4g5edn6y%2Csn-f5f7lne6&ms=au%2Conr&mv=m&mvi=3&pl=22&initcwndbps=516250&vprv=1&mime=video%2Fmp4&cnr=14&ratebypass=yes&dur=235.961&lmt=1630179846941539&mt=1639500793&fvip=3&fexp=24001373%2C24007246&c=ANDROID&txp=5532434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIhAPmt3ZKDfRPWlP_ZHZnnYhfk9T0urHDBqhe3dphRvxW6AiB0gZsiaR7jSeHFv6ulMS1mCwCH_O1DOPrWEMHbtgwpHw%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAPH6Sdfl5A-izBXbzxQaY7LIyJZJ0F_fpK7GtZqn4TyLAiBjubyi03YOP9hDvXsBMFzEQyeCGfwMO14bH7cAEv8yAg%3D%3D&host=rr3---sn-4g5edn6y.googlevideo.com&title=yt5s.com-RED%20VELVET%20-%20'FUTURE'%20(%EB%AF%B8%EB%9E%98)%20[Start-Up%20OST%20Part.1]%20Lyrics%20[Color%20Coded_Han_Rom_Eng]",
      ],
      html5: true,
    });
    return sound;
  }
}
