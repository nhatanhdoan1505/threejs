import { Scene } from "./scene.js";
import { Controller } from "./controller.js";
import { GamePlay } from "./gamePlay.js";
import * as THREE from "./lib/three.js/build/three.module.js";
import { FBXLoader } from "./lib/three.js/examples/jsm/loaders/FBXLoader.js";
import { GameSystem } from "./gameSystem.js";

class Game {
  mainScene = new Scene();
  controller = new Controller();
  gamePlay;

  initScene() {
    this.mainScene.render();
  }

  handlerModel(data) {
    return new Promise((resolve, reject) => {
      this.controller.loadModel(data.path).then((model) => {
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
        });
        this.loadAnimation(data.name);
        resolve(model);
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
    const anim = new FBXLoader();
    const animations = GameSystem.characters[character].animations;
    for (let path of animations) {
      anim.load(path, (a) => {
        let index = this.mainScene.objects.findIndex(
          (o) => o.name === character
        );
        this.mainScene.objects[index].animations.push(a.animations[0]);
      });
    }
  }

  playAnimation(character) {
    console.log(this.mainScene.camera.position);
    const index = this.mainScene.objects.findIndex((o) => o.name === character);
    const { animations } = this.mainScene.objects[index];
    const idle = this.mainScene.objects[index].mixer.clipAction(animations[0]);
    idle.play();
  }

  gameStart() {
    this.gamePlay = new GamePlay();
    this.gamePlay.gameStart();
  }
}

const game = new Game();
// game.gameStart();
window.game = game;
