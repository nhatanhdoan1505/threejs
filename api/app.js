const express = require("express");
const Browser = require("./Browser");
const YoutubeService = require("./YoutubeService");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();

app.use(cors("*"));
app.use(bodyParser.json());

const browser = new Browser();
const youtubeService = new YoutubeService();

// https://www.youtube.com/watch?v=InjHU5OzFkk

app.post("/api/keyword", (req, res) => {
  youtubeService
    .getVideoByKeyword(req.body.keyword)
    .then((videoList) =>
      res.status(200).json({ status: "Success", videoList })
    );
});

app.post("/api/links", (req, res) => {
  if (!req.body.id)
    return res
      .status(400)
      .json({ status: "Fail", msg: "Insufficient parameters" });

  let url = `https://www.youtube5s.com/watch?v=${req.body.id}`;

  browser
    .getLink(url)
    .then((link) =>
      res.status(200).json({ status: "Success", data: { link } })
    );
});

app.listen(3000, () => console.log("Server start at port 3000"));
