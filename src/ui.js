const keyHtml = {
  37: "<span><i class='fa fa-arrow-left'></i></span>",
  38: "<span><i class='fa fa-arrow-up'></i></span>",
  39: "<span><i class='fa fa-arrow-right'></i></span>",
  40: " <span><i class='fa fa-arrow-down'></i></span>",
};

export class UI {
  div = document.querySelector(".challenge");
  timer = document.querySelector(".timer");
  result = document.querySelector("#result");
  moveBall = document.querySelector("#move");
  target = document.querySelector("#target");

  playGame() {
    this.timer.classList.add("play");
    this.target.classList.add("target");
  }

  showResult(status) {
    let _status =
      status === 0
        ? "miss"
        : status === 1
        ? "perfect"
        : status === 2
        ? "cool"
        : "good";
    this.result.className = "";
    this.result.classList.add("fade-in", "result", _status);
    this.result.innerHTML = _status;
  }

  showChallenge(challenge) {
    this.div.classList.add("play");
    const html = challenge.map((c) => keyHtml[c]).join("");
    this.div.innerHTML = html;
    this.moveBall.innerHTML = `<i class="fa fa-bullseye movementBall" aria-hidden="true"></i>`;
  }

  showChallengeColor(index, miss) {
    const spanList = this.div.children;
    spanList[index].classList.add(miss === 0 ? "miss" : "pass");
    spanList[index].classList.add("vibrate");
  }

  miss(index) {
    const spanList = this.div.children;
    for (let i in spanList) {
      if (+i > index) spanList[i].classList.add("miss");
    }
  }
}