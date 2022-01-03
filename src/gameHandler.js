import { GameSystem } from "./gameSystem.js";
import * as THREE from "./lib/three.js/build/three.module.js";
import { FBXLoader } from "./lib/three.js/examples/jsm/loaders/FBXLoader.js";
import { Scene } from "./scene.js";
import { Utils } from "./utils.js";

export class GameHandler {
  scene = new Scene();
  playerList;
  playerIndex = 0;
  utils = new Utils();

  static _instance = new GameHandler();

  constructor() {
    GameHandler._instance = this;
    this.startGame();
  }

  static getInstance() {
    return GameHandler._instance;
  }

  async startGame() {
    await this.scene.loadScene();
    await this.loadMenuScene();

    this.scene.switchScene(1);
  }

  prevCharacter() {
    const objectName = this.playerList[this.playerIndex].name;
    console.log(objectName);
    let object = this.scene.scene.getObjectByName(objectName);
    console.log(object);
    this.scene.scene.remove(object);
  }

  async loadMenuScene() {
    const characterList = Object.keys(GameSystem.characters);
    const modelList = await this.loadModel(characterList);

    this.playerList = modelList;

    const player = this.playerList[this.playerIndex];
    player.scale.setScalar(4);
    this.scene.menuScene.add(player);
    // modelList.map((model, index) => {
    //   model.scale.setScalar(4);
    //   model.position.setX(positions[index]);
    //   console.log("add");
    //   this.scene.menuScene.add(model);
    // });
  }

  handlerModel(data) {
    return new Promise((resolve, reject) => {
      this.utils.load3DModel(data.path).then((model) => {
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        model.name = data.name;
        this.scene.objects.push({
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
    // modelHandler.map((model, index) => {
    //   model.position.setX(positions[index]);
    //   this.scene.mainScene.add(model);
    // });
    return modelHandler;
  }

  loadAnimation(character) {
    return new Promise(async (resolve) => {
      const animations = GameSystem.characters[character].animations;
      const animationHandlerPromiseList = animations.map((path) =>
        this.animationHandler(path)
      );
      const animationHandler = await Promise.all(animationHandlerPromiseList);
      let index = this.scene.objects.findIndex((o) => o.name === character);
      this.scene.objects[index].animations = animationHandler;
      resolve(true);
    });
  }

  playAnimation(character) {
    const index = this.scene.objects.findIndex((o) => o.name === character);
    if (!this.scene.isFirstDance) {
      const step = Date.now() - this.scene.startAnim;
      if (step < this.scene.duration) return;
    }

    return new Promise((resolve, reject) => {
      this.scene.objects[index].mixer.stopAllAction();
      const { animations } = this.scene.objects[index];
      this.scene.objects[index].idle = this.scene.objects[
        index
      ].mixer.clipAction(
        animations[this.utils.randomNumber(1, animations.length)]
      );
      this.scene.startAnim = Date.now();
      this.scene.objects[index].idle.play();
      this.scene.duration =
        +this.scene.objects[index].idle._clip.duration * 1000;
      this.scene.isFirstDance = false;
      resolve(true);
    });
  }

  standAnimation(character) {
    return new Promise((resolve, reject) => {
      const index = this.scene.objects.findIndex((o) => o.name === character);
      this.scene.objects[index].mixer.stopAllAction();
      const { animations } = this.scene.objects[index];
      this.scene.objects[index].idle = this.scene.objects[
        index
      ].mixer.clipAction(animations[0]);
      this.scene.objects[index].idle.play();
      this.scene.isFirstDance = true;
      resolve(true);
    });
  }

  moveCamera() {
    let randomDirection = Math.floor(Math.random() * 2);
    this.scene.moveDirection = randomDirection === 0 ? -1 : 1;
    this.scene.isMoveCamera = true;
    setTimeout(() => this.stopMoveCamera(), 4000);
  }

  stopMoveCamera() {
    this.scene.isMoveCamera = false;
    this.scene.setPositionCamera();
  }
}
