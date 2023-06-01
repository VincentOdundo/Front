const express = require("express");
const mongoose = require("mongoose");
const newsRoutes = require("./routes/news");
const userRoutes = require("./routes/users");
const recommendationRoutes = require("./routes/recommendations");

const nairobellApp = express();

mongoose
  .connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

nairobellApp.use("/news", newsRoutes);
nairobellApp.use("/users", userRoutes);
nairobellApp.use("/recommendations", recommendationRoutes);

nairobellApp.get("/", (req, res) => {
  res.send("Welcome to NairoBell!");
});

nairobellApp.listen(3000, () => {
  console.log("NairoBell server is running on port 3000");
});

module.exports = nairobellApp;
