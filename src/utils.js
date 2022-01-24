import { FBXLoader } from "./lib/three.js/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "./lib/three.js/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "./lib/three.js/build/three.module.js";
import { OBJLoader } from "./lib/three.js/examples/jsm/loaders/OBJLoader.js";

export class Utils {
  async load3DModel(path) {
    return new Promise(function (resolve, reject) {
      const loaders = new FBXLoader();
      let file =
        document.location.href === "http://127.0.0.1:5500/index.html"
          ? path
          : `${document.location.href}${path}`;
      loaders.load(
        file,
        (object) => {
          resolve(object);
        },
        (xhr) => {},
        (err) => {
          console.log("An error happened in loading car model: " + err);
        }
      );
    });
  }

  async load3DModelGLTF(path) {
    return new Promise(function (resolve, reject) {
      const loaders = new GLTFLoader();
      let file =
        document.location.href === "http://127.0.0.1:5500/index.html"
          ? path
          : `${document.location.href}${path}`;
      loaders.load(
        file,
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

  combineBuffer(model, bufferName) {
    let count = 0;

    model.traverse(function (child) {
      if (child.isMesh) {
        const buffer = child.geometry.attributes[bufferName];

        count += buffer.array.length;
      }
    });

    const combined = new Float32Array(count);

    let offset = 0;

    model.traverse(function (child) {
      if (child.isMesh) {
        const buffer = child.geometry.attributes[bufferName];

        combined.set(buffer.array, offset);
        offset += buffer.array.length;
      }
    });

    return new THREE.BufferAttribute(combined, 3);
  }

  createMesh(positions, scale, x, y, z, color) {
    let clonemeshes = [];
    let meshes;
    let meshList = [];
    let mesh;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", positions.clone());
    geometry.setAttribute("initialPosition", positions.clone());

    geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);

    const clones = [
      [6000, 0, -4000],
      [5000, 0, 0],
      [1000, 0, 5000],
      [1000, 0, -5000],
      [4000, 0, 2000],
      [-4000, 0, 1000],
      [-5000, 0, -5000],

      [0, 0, 0],
    ];

    for (let i = 0; i < clones.length; i++) {
      const c = i < clones.length - 1 ? 0x252525 : color;

      mesh = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({ size: 30, color: c })
      );
      mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;

      mesh.position.x = x + clones[i][0];
      mesh.position.y = y + clones[i][1];
      mesh.position.z = z + clones[i][2];

      meshList.push(mesh);

      clonemeshes.push({ mesh: mesh, speed: 0.5 + Math.random() });
    }

    meshes = {
      mesh: mesh,
      verticesDown: 0,
      verticesUp: 0,
      direction: 0,
      speed: 15,
      delay: Math.floor(200 + 200 * Math.random()),
      start: Math.floor(100 + 200 * Math.random()),
    };

    return { meshes, clonemeshes, meshList };
  }

  loadObjMale(path) {
    return new Promise((resolve, reject) => {
      const loader = new OBJLoader();
      loader.load(path, (object) => {
        const positions = this.combineBuffer(object, "position");
        let loadMesh = [];
        loadMesh.push(
          this.createMesh(positions, 4.05, -500, -350, 600, 0xff7744)
        );
        loadMesh.push(this.createMesh(positions, 4.05, 500, -350, 0, 0xff5522));
        loadMesh.push(
          this.createMesh(positions, 4.05, -250, -350, 1500, 0xff9922)
        );
        loadMesh.push(
          this.createMesh(positions, 4.05, -250, -350, -1500, 0xff99ff)
        );

        resolve(loadMesh);
      });
    });
  }

  loadObjFeMale(path) {
    return new Promise((resolve, reject) => {
      const loader = new OBJLoader();
      loader.load(path, (object) => {
        const positions = this.combineBuffer(object, "position");
        let loadMesh = [];
        loadMesh.push(
          this.createMesh(positions, 4.05, -1000, -350, 0, 0xffdd44)
        );
        loadMesh.push(this.createMesh(positions, 4.05, 0, -350, 0, 0xffffff));
        loadMesh.push(
          this.createMesh(positions, 4.05, 1000, -350, 400, 0xff4422)
        );
        loadMesh.push(
          this.createMesh(positions, 4.05, 250, -350, 1500, 0xff9955)
        );
        loadMesh.push(
          this.createMesh(positions, 4.05, 250, -350, 2500, 0xff77dd)
        );

        resolve(loadMesh);
      });
    });
  }

  async loadWelcomeScene() {
    let loadMesh = [];
    let objMale = await this.loadObjMale("/src/model/OBJ/Male/male02.obj");
    let objFemale = await this.loadObjFeMale(
      "/src/model/OBJ/Female/female02.obj"
    );
    loadMesh = [...objMale, ...objFemale];

    let meshes = [],
      clonemeshes = [],
      meshList = [];

    loadMesh.map((_) => {
      meshes.push(_.meshes);
      clonemeshes.push(_.clonemeshes);
      meshList.push(_.meshList);
    });

    return { meshes, clonemeshes, meshList };
  }

  loadSound(url, volume = 1) {
    url = url.includes("http")
      ? url
      : document.location.href.includes("http://127.0.0.1:5500/index.html")
      ? url
      : `${document.location.href}${url}`;
    const sound = new Howl({
      src: [url],
      // src: [
      //   "https://redirector.googlevideo.com/videoplayback?expire=1639835560&ei=SJO9YfCtBpua1gKeu5qgDw&ip=207.154.216.138&id=o-AO5H_wbVgDv7mQYDk-Z-PvQMuLQ37C9qNrIPFyuyaisR&itag=22&source=youtube&requiressl=yes&mh=tj&mm=31%2C26&mn=sn-5hnekn7l%2Csn-4g5edn6y&ms=au%2Conr&mv=m&mvi=3&pl=20&initcwndbps=203750&vprv=1&mime=video%2Fmp4&cnr=14&ratebypass=yes&dur=266.402&lmt=1577440663399097&mt=1639813729&fvip=3&fexp=24001373%2C24007246&c=ANDROID&txp=5535432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRAIgZqL78hsaL_wF0XPPtZMt6F_6wKvhweU73_uYqrX2zGICIGm_GvkcWKgY79LW5Qyi68VMucBbjfNJ7Wb6ZpeLJ8U4&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIgVozsAZSRqOPpjmaEuSyKwfhZhQvmmHljp9_Srzmptb8CIQCEu6GtEH2b2h8iYw7td4cTPWScIX27mMgtJKpNifeTsA%3D%3D&host=rr3---sn-5hnekn7l.googlevideo.com&title=yt5s.com-B%C3%80I%20H%C3%81T%20HUY%E1%BB%80N%20THO%E1%BA%A0I%20%7C%20Please%20Tell%20Me%20Why%20-%20B%E1%BA%A3o%20Thy%20X%20V%C6%B0%C6%A1ng%20Khang%20%7C%20LYRIC%20VIDEO",
      // ],
      volume,
      html5: true,
    });
    return sound;
  }
}
