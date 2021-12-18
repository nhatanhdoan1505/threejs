import { GameSystem } from "./gameSystem.js";
import * as THREE from "./lib/three.js/build/three.module.js";
import { FBXLoader } from "./lib/three.js/examples/jsm/loaders/FBXLoader.js";
import { Scene } from "./scene.js";
import { Utils } from "./utils.js";

export class GameHandler {
  mainScene = new Scene();
  gamePlay;
  utils = new Utils();

  initScene() {
    this.mainScene.render();
  }

  handlerModel(data) {
    return new Promise((resolve, reject) => {
      this.utils.load3DModel(data.path).then((model) => {
        model.scale.setScalar(1);
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        model.name = data.name;
        this.mainScene.objects.push({
          model,
          mixer: new THREE.AnimationMixer(model),
          name: data.name,
          animations: [],
          stand: null,
          idle: null,
        });
        this.loadAnimation(data.name).then((_) => resolve(model));
      });
    });
  }

  animationHandler(path) {
    return new Promise((resolve, reject) => {
      let anim = new FBXLoader();
      anim.load(path, (a) => {
        resolve(a.animations[0]);
      });
    });
  }

  async loadModel(characters) {
    let numberCharacters = characters.length;
    const positions = GameSystem.position[numberCharacters];

    const modelHandlerPromiseList = characters.map((ch) => {
      const data = GameSystem.characters[ch];
      return this.handlerModel(data);
    });

    const modelHandler = await Promise.all(modelHandlerPromiseList);
    modelHandler.map((model, index) => {
      model.position.setX(positions[index]);
      this.mainScene.scene.add(model);
    });
  }

  loadAnimation(character) {
    return new Promise(async (resolve) => {
      let anim = new FBXLoader();
      const animations = GameSystem.characters[character].animations;
      const animationHandlerPromiseList = animations.map((path) =>
        this.animationHandler(path)
      );
      const animationHandler = await Promise.all(animationHandlerPromiseList);
      let index = this.mainScene.objects.findIndex((o) => o.name === character);
      this.mainScene.objects[index].animations = animationHandler;
      resolve(true);
    });
  }

  playAnimation(character) {
    const index = this.mainScene.objects.findIndex((o) => o.name === character);
    if (!this.mainScene.isFirstDance) {
      const step = Date.now() - this.mainScene.startAnim;
      if (step < this.mainScene.duration) return;
    }

    return new Promise((resolve, reject) => {
      this.mainScene.objects[index].mixer.stopAllAction();
      const { animations } = this.mainScene.objects[index];
      this.mainScene.objects[index].idle = this.mainScene.objects[
        index
      ].mixer.clipAction(
        animations[this.utils.randomNumber(1, animations.length)]
      );
      this.mainScene.startAnim = Date.now();
      this.mainScene.objects[index].idle.play();
      this.mainScene.duration =
        +this.mainScene.objects[index].idle._clip.duration * 1000;
      this.mainScene.isFirstDance = false;
      resolve(true);
    });
  }

  standAnimation(character) {
    return new Promise((resolve, reject) => {
      const index = this.mainScene.objects.findIndex(
        (o) => o.name === character
      );
      this.mainScene.objects[index].mixer.stopAllAction();
      const { animations } = this.mainScene.objects[index];
      this.mainScene.objects[index].idle = this.mainScene.objects[
        index
      ].mixer.clipAction(animations[0]);
      this.mainScene.objects[index].idle.play();
      this.mainScene.isFirstDance = true;
      resolve(true);
    });
  }

  moveCamera() {
    let randomDirection = Math.floor(Math.random() * 2);
    this.mainScene.moveDirection = randomDirection === 0 ? -1 : 1;
    this.mainScene.isMoveCamera = true;
    setTimeout(() => this.stopMoveCamera(), 4000);
  }

  stopMoveCamera() {
    this.mainScene.isMoveCamera = false;
    this.mainScene.setPositionCamera();
  }
}
