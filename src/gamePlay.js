import { Utils } from "./utils.js";

export class GamePlay {
  gameControlChallenge;
  keyCode = [37, 38, 39, 40];
  utils = new Utils();
  challenge = [];

  ranndomTurnChallenge() {
    let challenge = new Array(this.utils.randomQuatityChallenge(3, 8)).fill(0);
    challenge = challenge.map((c) => this.utils.randomDirection(this.keyCode));

    return challenge;
  }

  gameStart() {
    // this.gameControlChallenge = setInterval(() => {
    //   this.challenge = this.ranndomTurnChallenge();
    // }, 3000);
    this.challenge = this.ranndomTurnChallenge();
    console.log(this.challenge);
    // this.checkMiss();
  }

  checkKeyPress(value) {
    return new Promise((resolve, reject) => {
      let waiter = setInterval(() => {
        let { result, press } = this.utils.checkKeyPress(value);
        if (press) {
          clearInterval(waiter);
          resolve(result);
        }
      }, 300);
    });
  }

  checkMiss() {
    return new Promise((resolve) => {
      let index = 0;
      while (index < this.challenge.length) {
        this.checkKeyPress(this.challenge[index]).then((result) => {
          if (!result) {
            console.log("miss");
            resolve(true);
          }
          if (i === this.challenge.length - 1) {
            console.log("pass");
            resolve(false);
          }
          index += 1;
        });
      }
    });
  }
}
