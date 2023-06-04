const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  imgUrl: String,
  pubDate: {
    type: Date,
    required: true,
  },
  publisherLogo: String,
  category: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("News", NewsSchema);
