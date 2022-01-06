const request = require("request");
const urlencode = require("encodeurl");
const fs = require("fs");
class YoutubeService {
  getVideoByKeyword(keyword) {
    return new Promise((resolve, reject) => {
      let endpoint = `https://www.youtube.com/results?search_query=${urlencode(
        keyword
      )}`;

      request(endpoint, (err, res, html) => {
        if (err) {
          console.log(err);
        }
        let start = "var ytInitialData = ";
        let end = "</script>";
        let body = html.slice(html.indexOf(start));
        let result = body.slice(
          body.indexOf(start) + start.length,
          body.indexOf(end) - 1
        );

        let ob = JSON.parse(result);

        let video_contents =
          ob.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents.filter(
            (c) => c.videoRenderer
          );

        video_contents = video_contents.map((video) => {
          return {
            id: video.videoRenderer.videoId,
            title: video.videoRenderer.title.runs[0].text,
            channel: video.videoRenderer.longBylineText.runs[0].text,
            // thumbnail: video.videoRenderer.thumbnail.thumbnails[1]
            //   ? video.videoRenderer.thumbnail.thumbnails[1].url
            //   : video.videoRenderer.thumbnail.thumbnails[0].url,
            thumbnail: video.videoRenderer.thumbnail.thumbnails[0].url,
          };
        });
        resolve(video_contents);
      });
    });
  }
}

module.exports = YoutubeService;
