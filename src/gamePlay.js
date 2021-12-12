import { Utils } from "./utils.js";
const keyHtml = {
  37: "<span><i class='fa fa-arrow-left'></i></span>",
  38: "<span><i class='fa fa-arrow-up'></i></span>",
  39: "<span><i class='fa fa-arrow-right'></i></span>",
  40: " <span><i class='fa fa-arrow-down'></i></span>",
};
export class GamePlay {
  gameControlChallenge;
  keyCode = [37, 38, 39, 40];
  utils = new Utils();
  challenge = [];
  playAnwser = [];
  timeUp = true;
  miss = true;

  ranndomTurnChallenge() {
    let challenge = new Array(this.utils.randomQuatityChallenge(3, 8)).fill(0);
    challenge = challenge.map((c) => this.utils.randomDirection(this.keyCode));

    return challenge;
  }

  gameStart() {
    this.gameControlChallenge = setInterval(() => {
      this.timeUp = false;
      this.challenge = this.ranndomTurnChallenge();
      this.showChallenge();
      this.listenKeyBoard();
      setTimeout(() => {
        this.timeUp = true;
        this.playAnwser = [];
      }, 3000);
    }, 3000);
  }

  checkMiss() {
    if (this.playAnwser.length < this.challenge.length && this.timeUp) {
      this.miss = true;
      this.timeUp = true;
    }

    if (
      this.challenge[this.playAnwser.length - 1] !==
      this.playAnwser[this.playAnwser.length - 1]
    ) {
      this.miss = true;
      this.timeUp = true;
    }

    if (this.playAnwser.length === this.challenge.length) this.miss = false;
  }

  listenKeyBoard() {
    const self = this;
    if (!this.timeUp) {
      document.onkeydown = function (e) {
        console.log(e.keyCode);
        self.playAnwser.push(e.keyCode);
        self.checkMiss();
      };
    }
  }

  showChallenge() {
    const html = this.challenge.map((c) => keyHtml[c]).join("");
    const challenge = document.querySelector(".challenge");
    challenge.innerHTML = html;
  }
}
