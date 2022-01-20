import { GameSystem } from "./gameSystem.js";
import * as THREE from "./lib/three.js/build/three.module.js";
import { FBXLoader } from "./lib/three.js/examples/jsm/loaders/FBXLoader.js";
import { Scene } from "./scene.js";
import { Utils } from "./utils.js";

export class GameHandler {
  sceneMgr = new Scene();
  playerList;
  playerIndex = 0;
  stageList = GameSystem.stage;
  stageIndex = 0;

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
    await this.sceneMgr.loadScene();
  }

  haveLoadedScene() {
    if (this.sceneMgr.numberSceneLoaded >= 3) return true;
    else return false;
  }

  async switchScene(index) {
    if (index === 1) {
      !this.playerList && (await this.loadMenuScene());
      console.log("1", this.sceneMgr.menuScene.children);
      const player = this.playerList[this.playerIndex];
      console.log({ player });
      player.scale.setScalar(4);
      this.sceneMgr.menuScene.add(player);
      this.playAnimation(player.name);
      console.log("2", this.sceneMgr.menuScene.children);
    }
    if (index === 2) {
      this.sceneMgr.mainScene.add(this.playerList[this.playerIndex]);
      this.standAnimation(this.playerList[this.playerIndex].name);
      let model = await this.loadStageModel(this.stageList[0].path);
      let stage = model.scene.children[0];
      stage.scale.setScalar(4);
      this.sceneMgr.mainScene.add(stage);
    }
    return this.sceneMgr.switchScene(index);
  }

  prevCharacter() {
    if (this.playerIndex === 0) return;

    const playerName = this.playerList[this.playerIndex].name;
    let player = this.sceneMgr.menuScene.getObjectByName(playerName);
    this.sceneMgr.menuScene.remove(player);

    this.playerIndex -= 1;
    let currentPlayer = this.playerList[this.playerIndex];
    currentPlayer.scale.setScalar(4);
    this.sceneMgr.menuScene.add(currentPlayer);
    this.playDemoAnimation(currentPlayer.name);
  }

  nextCharacter() {
    if (this.playerIndex === this.playerList.length - 1) return;

    const playerName = this.playerList[this.playerIndex].name;
    let player = this.sceneMgr.menuScene.getObjectByName(playerName);
    this.sceneMgr.menuScene.remove(player);

    this.playerIndex += 1;
    let currentPlayer = this.playerList[this.playerIndex];
    currentPlayer.scale.setScalar(4);
    this.sceneMgr.menuScene.add(currentPlayer);
    this.playDemoAnimation(currentPlayer.name);
  }

  async loadMenuScene() {
    const characterList = Object.keys(GameSystem.characters);
    const modelList = await this.loadModel(characterList);

    this.playerList = modelList;

    // const player = this.playerList[this.playerIndex];
    // player.scale.setScalar(4);
    // this.sceneMgr.menuScene.add(player);
    // this.playAnimation(player.name);
    // modelList.map((model, index) => {
    //   model.scale.setScalar(4);
    //   model.position.setX(positions[index]);
    //   console.log("add");
    //   this.sceneMgr.menuScene.add(model);
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
        this.sceneMgr.objects.push({
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
    //   this.sceneMgr.mainScene.add(model);
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
      let index = this.sceneMgr.objects.findIndex((o) => o.name === character);
      this.sceneMgr.objects[index].animations = animationHandler;
      resolve(true);
    });
  }

  playDemoAnimation(character) {
    const index = this.sceneMgr.objects.findIndex((o) => o.name === character);
    return new Promise((resolve, reject) => {
      this.sceneMgr.objects[index].mixer.stopAllAction();
      const { animations } = this.sceneMgr.objects[index];
      console.log(animations);
      this.sceneMgr.objects[index].idle = this.sceneMgr.objects[
        index
      ].mixer.clipAction(
        animations[this.utils.randomNumber(1, animations.length)]
      );
      this.sceneMgr.objects[index].idle.play();
      resolve(true);
    });
  }

  playAnimation(character) {
    const index = this.sceneMgr.objects.findIndex((o) => o.name === character);
    if (!this.sceneMgr.isFirstDance) {
      const step = Date.now() - this.sceneMgr.startAnim;
      if (step < this.sceneMgr.duration) return;
    }

    return new Promise((resolve, reject) => {
      this.sceneMgr.objects[index].mixer.stopAllAction();
      const { animations } = this.sceneMgr.objects[index];
      this.sceneMgr.objects[index].idle = this.sceneMgr.objects[
        index
      ].mixer.clipAction(
        animations[this.utils.randomNumber(1, animations.length)]
      );
      this.sceneMgr.startAnim = Date.now();
      this.sceneMgr.objects[index].idle.play();
      this.sceneMgr.duration =
        +this.sceneMgr.objects[index].idle._clip.duration * 1000;
      this.sceneMgr.isFirstDance = false;
      resolve(true);
    });
  }

  standAnimation(character) {
    return new Promise((resolve, reject) => {
      const index = this.sceneMgr.objects.findIndex(
        (o) => o.name === character
      );
      this.sceneMgr.objects[index].mixer.stopAllAction();
      const { animations } = this.sceneMgr.objects[index];
      this.sceneMgr.objects[index].idle = this.sceneMgr.objects[
        index
      ].mixer.clipAction(animations[0]);
      this.sceneMgr.objects[index].idle.play();
      this.sceneMgr.isFirstDance = true;
      resolve(true);
    });
  }

  moveCamera() {
    let randomDirection = Math.floor(Math.random() * 2);
    this.sceneMgr.moveDirection = randomDirection === 0 ? -1 : 1;
    this.sceneMgr.isMoveCamera = true;
    setTimeout(() => this.stopMoveCamera(), 4000);
  }

  stopMoveCamera() {
    this.sceneMgr.isMoveCamera = false;
    this.sceneMgr.setPositionCamera();
  }

  loadStageModel(path) {
    return new Promise((resolve, reject) => {
      this.utils.load3DModelGLTF(path).then((stage) => {
        resolve(stage);
      });
    });
  }
}
