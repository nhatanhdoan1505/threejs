import { Scene } from "./scene.js";
import { Controller } from "./controller.js";
import { GamePlay } from "./gamePlay.js";
import * as THREE from "./lib/three.js/build/three.module.js";
import { FBXLoader } from "./lib/three.js/examples/jsm/loaders/FBXLoader.js";

class Game {
  mainScene = new Scene();
  controller = new Controller();
  gamePlay;

  initScene() {
    this.mainScene.render();
  }

  loadModel() {
    this.controller.loadModel().then((danceModel) => {
      danceModel.scale.setScalar(1);
      danceModel.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      const anim = new FBXLoader();
      anim.load("./src/model/dance/package-lock.fbx", (a) => {
        console.log(a);
        this.mainScene.mixer = new THREE.AnimationMixer(danceModel);
        console.log(this.mainScene.mixer);
        const idle = this.mainScene.mixer.clipAction(a.animations[0]);
        console.log(idle);
        idle.play();
      });
      this.mainScene.scene.add(danceModel);
    });
  }

  turnOnLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.mainScene.addObject(directionalLight);
  }

  addObject(model) {
    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    // const cube = this.controller.createObject(geometry, material);
    this.mainScene.addObject(model);
  }

  gameStart() {
    this.gamePlay = new GamePlay();
    this.gamePlay.gameStart();
  }
}

const game = new Game();
// game.gameStart();
window.game = game;
