import { GameHandler } from "./gameHandler.js";

export class Player {
  name;
  gameHandler;

  constructor(name) {
    this.gameHandler = GameHandler.getInstance();
    this.name = name;
  }

  async loadModel() {
    return await this.gameHandler.loadModel([this.name]);
  }

  async standAnimation() {
    return await this.gameHandler.standAnimation(this.name);
  }

  async playAnimation() {
    return await this.gameHandler.playAnimation(this.name);
  }
}
