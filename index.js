const express = require("express");
const mongoose = require("mongoose");
const newsRoutes = require("./routes/news");
const userRoutes = require("./routes/users");
const recommendationRoutes = require("./routes/recommendations");

const nairobellApp = express();

mongoose
  .connect(
    "mongodb+srv://odundo:mawembe2030@nairobell.ds6lvl5.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

nairobellApp.use("/news", newsRoutes);
nairobellApp.use("/users", userRoutes);
nairobellApp.use("/recommendations", recommendationRoutes);

nairobellApp.get("/", (req, res) => {
  res.send("Welcome to NairoBell!");
});

const server = nairobellApp.listen(3001, () => {
  console.log("NairoBell server is running on port 3001");
});

module.exports = { server, nairobellApp };
