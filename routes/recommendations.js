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
    // Check if the model has been loaded
    if (!model) {
      return res
        .status(503)
        .send(
          "The recommendation engine is not ready yet. Please try again later."
        );
    }

    // Get the username from the request parameters
    const username = req.params.username;

    // Find the user in the database
    const user = await User.findOne({ username });

    // Check if the user exists
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Get the user's browsing history
    const browsingHistory = user.browsingHistory;

    // Convert the browsing history to embeddings
    const browsingHistoryEmbedding = await model.embed(browsingHistory);

    // Get all the news articles
    const newsArticles = await News.find({});

    // Convert the news article texts to embeddings
    const newsEmbeddings = await model.embed(
      newsArticles.map((news) => news.text)
    );

    // Compute the similarity between the browsing history embedding and each news article embedding
    const similarities = tf.metrics.cosineProximity(
      browsingHistoryEmbedding,
      newsEmbeddings
    );

    // Sort the news articles by similarity
    const sortedNewsArticles = newsArticles.sort(
      (a, b) =>
        similarities[newsArticles.indexOf(b)] -
        similarities[newsArticles.indexOf(a)]
    );

    // Send the most similar news articles back in the response
    res.json(sortedNewsArticles.slice(0, 10)); // Top 10 recommended articles
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while getting recommendations");
  }
});

module.exports = router;
