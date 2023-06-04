const express = require("express");
const tf = require("@tensorflow/tfjs");
const User = require("../models/user");
const News = require("../models/news");
const use = require("@tensorflow-models/universal-sentence-encoder");

const router = express.Router();

// Load the pre-trained model
let model;
use.load().then((loadedModel) => {
  model = loadedModel;
});

// Endpoint for getting recommendations for a user
router.get("/:username", async (req, res) => {
  try {
    if (!model) {
      return res
        .status(503)
        .send(
          "The recommendation engine is not ready yet. Please try again later."
        );
    }

    const username = req.params.username;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const browsingHistory = user.browsingHistory;

    const browsingHistoryEmbedding = await model.embed(browsingHistory);

    const newsArticles = await News.find({});

    if (!newsArticles || newsArticles.length === 0) {
      return res.status(404).send("No news articles found");
    }

    const newsEmbeddings = await model.embed(
      newsArticles.map((news) => news.text)
    );

    const similarities = tf.metrics.cosineProximity(
      browsingHistoryEmbedding,
      newsEmbeddings
    );

    const sortedNewsArticles = newsArticles.sort(
      (a, b) =>
        similarities[newsArticles.indexOf(b)] -
        similarities[newsArticles.indexOf(a)]
    );

    res.json(sortedNewsArticles.slice(0, 10));
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while getting recommendations");
  }
});

module.exports = router;
