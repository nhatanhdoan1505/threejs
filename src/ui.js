const keyHtml = {
  37: "<span><i class='fa fa-arrow-left'></i></span>",
  38: "<span><i class='fa fa-arrow-up'></i></span>",
  39: "<span><i class='fa fa-arrow-right'></i></span>",
  40: " <span><i class='fa fa-arrow-down'></i></span>",
};

export class UI {
  div = document.querySelector(".challenge");
  timer = document.querySelector(".timer");
  result = document.querySelector(".result");
  moveBall = document.querySelector("#move");

  playGame() {
    this.timer.classList.add("play");
  }

  showResult(miss, test = true) {
    let html = miss ? "Miss" : "Perfect";
    html = !test ? "Wait" : html;
    // this.result.innerHTML = html;
  }

  showChallenge(challenge) {
    this.div.classList.add("play");
    const html = challenge.map((c) => keyHtml[c]).join("");
    this.div.innerHTML = html;
    this.moveBall.innerHTML = `<i class="fa fa-bullseye movementBall" aria-hidden="true"></i>`;
  }

  showChallengeColor(index, miss) {
    const spanList = this.div.children;
    spanList[index].classList.add(miss ? "miss" : "pass");
    spanList[index].classList.add("vibrate");
  }

  miss(index) {
    const spanList = this.div.children;
    for (let i in spanList) {
      if (+i > index) spanList[i].classList.add("miss");
    }
  }
}
