const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const News = require("../models/news");

const router = express.Router();

router.get("/fetch", async (req, res) => {
  try {
    const rssFeeds = [
      "https://rss.punchng.com/v1/category/latest_news",
      "https://www.standardmedia.co.ke/rss/headlines.php",
    ];

    const promises = [];

    for (const feed of rssFeeds) {
      const response = await axios.get(feed);
      const $ = cheerio.load(response.data, {
        xmlMode: true,
      });

      $("item").each((index, element) => {
        const imgUrl = $(element).find("imgUrl").text();
        const pubDate = $(element).find("pubDate").text();
        const link = $(element).find("link").text();
        const title = $(element).find("title").text();
        const publisherLogo = $(element).find("publisherLogo").text();
        const category = $(element).find("category").text();

        const newsItem = {
          imgUrl,
          pubDate,
          link,
          title,
          publisherLogo,
          category,
        };

        promises.push(News.create(newsItem));
      });
    }

    await Promise.all(promises);

    res.send("News fetched successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching news");
  }
});

router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const newsItems = await News.find({ category: category });
    res.json(newsItems);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching news");
  }
});

module.exports = router;
