import { Utils } from "./utils.js";
import { GameHandler } from "./gameHandler.js";
import { UI } from "./ui.js";
import { GameSystem } from "./gameSystem.js";
export class GameController {
  start = false;
  gameControlChallenge = null;
  keyCode = [37, 38, 39, 40];
  challenge = [];
  playAnwser = [];
  timeUp = true;
  status = 0;
  pressSpace = false;

  gameHandler;
  utils;
  ui;
  sound;

  clock;

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
    this.pressSpace = false;
    this.timeUp = false;
    this.status = 0;
    this.playAnwser = [];
    clearInterval(this.gameControlChallenge);
    
  }

  startGamePlay() {
    this.ui.playGame();
    this.gameControlChallenge = setInterval(() => {
      this.clock = Date.now();
      this.pressSpace = false;
      this.timeUp = false;
      this.status = 0;
      this.challenge = this.ranndomTurnChallenge();
      this.ui.showChallenge(this.challenge);
      this.listenKeyBoard();
      setTimeout(() => {
        this.timeUp = true;
        this.playAnwser = [];
        if (!this.pressSpace) {
          this.gameHandler.standAnimation("girl");
          this.ui.showResult(this.status);
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
    if (this.playAnwser.length > this.challenge.length && !this.timeUp) {
      this.status = 0;
      this.timeUp = true;
      this.status = 0;
      this.playAnwser = [];
      this.ui.showResult(this.status);
      this.ui.miss(this.playAnwser.length - 1);
      return this.gameHandler.standAnimation("girl");
    }

    if (
      this.challenge[this.playAnwser.length - 1] !==
      this.playAnwser[this.playAnwser.length - 1]
    ) {
      this.status = 0;
      this.timeUp = true;

      this.ui.showChallengeColor(this.playAnwser.length - 1, 0);
      this.playAnwser = [];
      this.ui.showResult(this.status);
      return this.gameHandler.standAnimation("girl");
    }

    return this.ui.showChallengeColor(this.playAnwser.length - 1, 1);
  }

  checkPerfect() {
    this.pressSpace = true;
    if (this.playAnwser.length !== this.challenge.length) {
      this.status = 0;
      this.ui.miss(this.playAnwser.length - 1);
      this.playAnwser = [];
      this.ui.showResult(this.status);
      return this.gameHandler.standAnimation("girl");
    }
    this.status = false;
    this.timeUp = true;

    const target = Math.abs(Date.now() - this.clock - GameSystem.target.point);
    if (target <= GameSystem.target.cool) {
      if (target <= GameSystem.target.perfect) {
        this.status = 1;
      } else {
        this.status = 2;
      }
    } else {
      this.status = 3;
    }
    console.log("", target);

    this.ui.showResult(this.status);
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
