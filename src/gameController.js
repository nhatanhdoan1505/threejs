import { Utils } from "./utils.js";
import { GameHandler } from "./gameHandler.js";
import { UI } from "./ui.js";
import { GameSystem } from "./gameSystem.js";
import { Player } from "./Player.js";
export class GameController {
  start = false;
  gameControlChallenge = null;
  keyCode = [37, 38, 39, 40];
  challenge = [];
  playAnswer = [];
  timeUp = true;
  status = 0;
  pressSpace = false;
  combo = 0;
  point = 0;

  gameHandler;
  player;
  utils;
  ui;
  sound;
  music;

  musicList = [];
  currentMusic;

  isClickGetLink = false;

  period = 2000;
  timeOutInput;

  clock;

  waitingFirstScene;

  difficult = 0;
  maxChallenge = 2;

  soundEffect;

  constructor() {
    this.utils = new Utils();
    this.ui = new UI();
    this.gameHandler = GameHandler.getInstance();
    this.firstScene();
  }

  firstScene() {
    this.ui.firstLoadingControl();
    this.sceneMenu();
  }

  sceneWelcome() {
    this.ui.refreshUI();
    this.ui.inputNameControl();
    this.gameHandler.switchScene(0);
  }

  sceneMenu() {
    this.ui.refreshUI();
    this.gameHandler.switchScene(1).then((_) => {
      this.ui.firstLoadingControl(false);
      this.ui.chooseCharacterControl();
      this.ui.musicSideBarControl();
      this.ui.chooseStageControl();
    });
  }

  randomTurnChallenge(min, max) {
    let challenge = new Array(this.utils.randomNumber(min, max)).fill(0);
    challenge = challenge.map((c) => this.utils.randomDirection(this.keyCode));

    return challenge;
  }

  async gameStart() {
    if (this.start) {
      return;
    }
    this.ui.refreshUI();
    this.refreshNewGame();

    if (this.sound) this.sound.stop();
    this.gameHandler.switchScene(2).then((_) => {
      this.start = true;
      let name = this.gameHandler.playerList[this.gameHandler.playerIndex].name;
      this.player = new Player(name);
      setTimeout(() => {
        this.sound = !this.sound
          ? this.utils.loadSound(
              this.music ? this.music : "/src/music/start.mp3"
            )
          : this.sound;
        this.sound.play();
        this.gameHandler.moveCamera();
        this.startGamePlay();
        this.sound.on("end", () => {
          this.stopGame();
        });
      }, 5000);
    });
  }

  refreshNewGame() {
    this.challenge = [];
    this.playAnswer = [];
    this.timeUp = true;
    this.status = 0;
    this.pressSpace = false;
    this.combo = 0;
    this.point = 0;
    this.difficult = 0;
    this.maxChallenge = 2;
  }

  async restartGame() {
    this.player.standAnimation();
    this.refreshNewGame();
    if (this.sound) this.sound.stop();
    this.sound.play();
    this.ui.refreshUI();
    this.ui.gameOverControl(0, true);
    this.startGamePlay();
    this.sound.on("end", () => {
      this.stopGame();
    });
  }

  backToRoom() {
    this.ui.gameOverControl(0, true);
    this.sceneMenu();
  }

  stopGame() {
    this.pressSpace = false;
    this.timeUp = false;
    this.status = 0;
    this.playAnswer = [];
    clearInterval(this.gameControlChallenge);
    this.ui.stopGame();
    setTimeout(() => {
      this.ui.gameOverControl(this.point);
      this.start = false;
    }, 1000);
  }

  startGamePlay() {
    this.ui.playGame();
    setTimeout(() => {
      this.gameControlChallenge = setInterval(() => {
        this.clock = Date.now();
        this.pressSpace = false;
        this.timeUp = false;
        this.status = 0;
        this.difficult += 0.3;
        let max =
          Math.floor(this.difficult) + this.maxChallenge > 10
            ? 10
            : Math.floor(this.difficult) + this.maxChallenge;
        let min = max - 1;
        this.challenge = this.randomTurnChallenge(min, max);
        this.ui.showChallenge(this.challenge);
        this.listenKeyBoard();
        setTimeout(() => {
          this.timeUp = true;
          this.playAnswer = [];
          if (!this.pressSpace) {
            this.combo = 0;
            this.player.standAnimation();
            this.ui.showResult(this.status);
          }
        }, 3000);
      }, 5000);
    }, 5000);
  }

  // async loadGameHandler() {
  //   this.gameHandler.initScene();
  //   await this.player.loadModel();
  // }

  checkMiss() {
    if (this.playAnswer.length > this.challenge.length) {
      this.playAnswer = this.playAnswer.slice(0, this.playAnswer.length - 1);
      return;
    }
    if (
      this.challenge[this.playAnswer.length - 1] !==
      this.playAnswer[this.playAnswer.length - 1]
    ) {
      this.status = 0;
      this.timeUp = true;

      this.ui.showChallengeColor(this.playAnswer.length - 1, 0);
      this.playAnswer = [];
      this.ui.showResult(this.status);
      this.combo = 0;
      this.playSoundEffect(true);
      return this.player.standAnimation();
    }

    return this.ui.showChallengeColor(this.playAnswer.length - 1, 1);
  }

  checkPerfect() {
    this.pressSpace = true;
    if (this.playAnswer.length !== this.challenge.length) {
      this.status = 0;
      this.ui.miss(this.playAnswer.length - 1);
      this.playAnswer = [];
      this.ui.showResult(this.status);
      this.combo = 0;
      this.playSoundEffect(true);
      return this.player.standAnimation();
    }
    this.status = false;
    this.timeUp = true;

    const target = Math.abs(Date.now() - this.clock - GameSystem.target.point);
    if (target <= GameSystem.target.cool) {
      if (target <= GameSystem.target.perfect) {
        this.status = 1;
        this.combo += 1;
      } else {
        this.status = 2;
        this.combo = 0;
      }
    } else {
      this.status = 3;
      this.combo = 0;
    }

    let point =
      target === 0
        ? GameSystem.point / 10
        : Math.floor(GameSystem.point / target);
    point = point > GameSystem.point ? GameSystem.point : point;

    this.increasePoint(this.point, this.point + point);
    this.point += point;

    this.ui.showResult(this.status, this.combo);
    // this.combo > 2 && this.gameHandler.moveCamera();
    this.playSoundEffect();
    return this.player.playAnimation();
  }

  listenKeyBoard() {
    const self = this;
    document.onkeydown = (e) => {
      if (!this.timeUp) {
        if (e.keyCode === 32) {
          self.checkPerfect();
        } else {
          self.playAnswer.push(e.keyCode);
          self.checkMiss();
        }
      }
    };
  }

  increasePoint(min, max) {
    let increase = setInterval(() => {
      if (min > max) clearInterval(increase);
      min += 1;
      this.ui.showPoint(min);
    }, 10);
  }

  preStage() {
    return this.gameHandler.preStage();
  }

  nextStage() {
    return this.gameHandler.nextStage();
  }

  prevCharacter() {
    return this.gameHandler.prevCharacter();
  }

  nextCharacter() {
    return this.gameHandler.nextCharacter();
  }

  onChangeMusicSideBar() {
    clearTimeout(this.timeOutInput);
    this.timeOutInput = setTimeout(() => {
      this.ui.requestMusic();
    }, this.period);
  }

  async onClickMusic(id) {
    if (this.isClickGetLink) return;
    if (this.currentMusic === id) return;
    if (this.currentMusic) this.ui.removeEqualizerAnimation(this.currentMusic);
    if (this.musicList.some((m) => m.id === id)) {
      if (this.sound) this.sound.stop();
      let link = this.musicList.find((m) => m.id === id).link;
      this.sound = this.utils.loadSound(link);
      this.sound.play();
      this.ui.equalizerAnimation(id);
      return;
    }
    this.isClickGetLink = true;
    this.ui.loadingAnimation(id);
    let res = await fetch("http://207.148.78.192:3000/api/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ id }),
    });

    let linkJson = await res.json();
    let link = linkJson.data.link;
    this.music = link;
    if (this.sound) this.sound.stop();
    this.sound = this.utils.loadSound(this.music);
    this.sound.play();
    this.ui.equalizerAnimation(id);
    this.musicList.push({ id, link });
    this.currentMusic = id;
    this.isClickGetLink = false;
  }

  playSoundEffect(miss = false) {
    let url = !miss
      ? GameSystem.sound.effect.space
      : GameSystem.sound.effect.miss;
    this.soundEffect = this.utils.loadSound(url, 0.7);
    this.soundEffect.play();
  }
}

const game = new GameController();
window.game = game;
