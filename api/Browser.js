const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

class Browser {
  browser;

  async startBrowser() {
    try {
      this.browser = await puppeteer.launch({
        headless: false,
        args: ["--disable-setuid-sandbox"],
        ignoreHTTPSErrors: true,
      });
    } catch (err) {
      console.log("Could not create a browser instance => : ", err);
    }
  }

  openPage(url) {
    return new Promise(async (resolve, reject) => {
      await this.startBrowser();
      if (!this.browser) return;
      const page = await this.browser.newPage();
      await page.goto(url);
      setTimeout(async () => {
        await page.click("button#btn-action");
        setTimeout(async () => {
          const html = await page.content();
          const $ = cheerio.load(html);
          let link = $("#asuccess");
          console.log($(link).attr("href"));
          resolve($(link).attr("href"));
        }, 2000);
      }, 3000);
    });
  }
}

module.exports = Browser;
