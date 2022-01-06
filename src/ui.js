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
  point = document.querySelector("#point");
  musicInput = document.querySelector("#musicInput");
  musicContainer = document.querySelector("#video-container");

  iconContainer;

  equalizer = ` <div class="equalizer">
  <span class="col-1"></span><span class="col-2"></span><span class="col-3"></span><span
      class="col-4"></span><span class="col-5"></span>
</div>`;

  loading = `<div class="loader"></div>`;

  playGame() {
    this.timer.classList.add("play");
    this.target.classList.add("target");
    this.point.classList.add("point");
    this.point.innerHTML = "0";
  }

  showPoint(point) {
    this.point.innerHTML = point;
  }

  showResult(status, combo = 0) {
    let _status =
      status === 0
        ? "miss"
        : status === 1
        ? "perfect"
        : status === 2
        ? "cool"
        : "good";
    this.result.className = "";
    _status = status === 1 && combo > 1 ? `${_status} X${combo}` : _status;
    let _class = _status.split(" ")[0];
    this.result.classList.add("fade-in", "result", _class);
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

  async requestMusic() {
    let keyword = this.musicInput.value;
    if (!keyword) return;
    let res = await fetch("http://localhost:3000/api/keyword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ keyword }),
    });
    let musicListJson = await res.json();
    let musicList = musicListJson.videoList;
    let videoHtml = musicList.map(
      (music) => `<div class="video" onclick="game.onClickMusic('${
        music.id
      }')" >
    <img
        src="${music.thumbnail}" />
    <div class="video-content"  />
        <strong>${
          music.title.length > 50
            ? music.title.slice(0, 50) + "..."
            : music.title
        }</strong>
        <p>${
          music.channel.length > 50
            ? music.channel.slice(0, 50) + "..."
            : music.channel
        }</p>
        <div id="ID${music.id}"></div>
    </div>
</div>`
    );

    this.musicContainer.innerHTML = videoHtml.join("");
  }

  loadingAnimation(id) {
    console.log(id);
    this.iconContainer = document.querySelector(`#ID${id}`);
    this.iconContainer.innerHTML = this.loading;
  }

  equalizerAnimation(id) {
    this.iconContainer = document.querySelector(`#ID${id}`);
    this.iconContainer.innerHTML = this.equalizer;
  }

  removeEqualizerAnimation(id) {
    this.iconContainer = document.querySelector(`#ID${id}`);
    if (this.iconContainer) this.iconContainer.innerHTML = null;
  }
}
