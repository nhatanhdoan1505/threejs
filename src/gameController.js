import { Utils } from "./utils.js";
import { GameHandler } from "./gameHandler.js";
import { UI } from "./ui.js";

export class GameController {
  start = false;
  gameControlChallenge = null;
  keyCode = [37, 38, 39, 40];
  challenge = [];
  playAnwser = [];
  timeUp = true;
  miss = true;
  pressSpace = false;

  gameHandler;
  utils;
  ui;
  sound;

  constructor() {
    this.utils = new Utils();
    this.ui = new UI();
  }

  ranndomTurnChallenge() {
    let challenge = new Array(this.utils.randomNumber(3, 8)).fill(0);
    challenge = challenge.map((c) => this.utils.randomDirection(this.keyCode));

    return challenge;
  }

  async gameStart() {
    if (this.start) {
      return;
    }
    this.start = true;
    await this.loadgameHandler();
    await this.gameHandler.standAnimation("girl");
    this.sound = this.utils.loadSound();
    this.sound.play();
    this.startGamePlay();
    this.sound.on("end", () => {
      this.stopGame();
    });
  }

  stopGame() {
    clearInterval(this.gameControlChallenge);
  }

  startGamePlay() {
    this.ui.playGame();
    this.gameControlChallenge = setInterval(() => {
      this.pressSpace = false;
      this.timeUp = false;
      this.miss = true;
      this.challenge = this.ranndomTurnChallenge();
      this.ui.showChallenge(this.challenge);
      this.listenKeyBoard();
      setTimeout(() => {
        this.timeUp = true;
        this.playAnwser = [];
        if (!this.pressSpace) {
          this.gameHandler.standAnimation("girl");
          this.ui.showResult(this.miss);
        }
      }, 3000);
    }, 5000);
  }

  async loadgameHandler() {
    this.gameHandler = new GameHandler();
    this.gameHandler.initScene();
    await this.gameHandler.loadModel(["girl"]);
  }

  checkMiss() {
    if (this.playAnwser.length < this.challenge.length && this.timeUp) {
      this.miss = true;
      this.timeUp = true;

      this.ui.showChallengeColor(this.playAnwser.length - 1, true);
      this.playAnwser = [];
      return this.gameHandler.standAnimation("girl");
    }

    if (
      this.challenge[this.playAnwser.length - 1] !==
      this.playAnwser[this.playAnwser.length - 1]
    ) {
      this.miss = true;
      this.timeUp = true;

      this.ui.showChallengeColor(this.playAnwser.length - 1, true);
      this.playAnwser = [];
      return this.gameHandler.standAnimation("girl");
    }

    return this.ui.showChallengeColor(this.playAnwser.length - 1, false);
  }

  checkPerfect() {
    this.pressSpace = true;
    if (this.playAnwser.length !== this.challenge.length) {
      this.miss = true;
      this.ui.miss(this.playAnwser.length - 1);
      this.playAnwser = [];
      return this.gameHandler.standAnimation("girl");
    } else {
      this.miss = false;
      this.gameHandler.playAnimation("girl");
    }
    this.timeUp = true;
    this.ui.showResult(this.miss);
    return this.gameHandler.playAnimation("girl");
  }

  listenKeyBoard() {
    const self = this;
    document.onkeydown = (e) => {
      if (!this.timeUp) {
        if (e.keyCode === 32) {
          self.checkPerfect();
        } else {
          self.playAnwser.push(e.keyCode);
          self.checkMiss();
        }
      }
    };
  }
}

const game = new GameController();
window.game = game;
