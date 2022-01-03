const express = require("express");
const Browser = require("./Browser");

const app = express();

const browser = new Browser();

// browser.openPage("https://www.youtube5s.com/watch?app=desktop&v=dYIT_jeUBKg");

app.listen(3000, () => console.log("Server start at port 3000"));
