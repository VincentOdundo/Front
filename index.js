require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const newsRoutes = require("./routes/news");
const userRoutes = require("./routes/users");
const recommendationRoutes = require("./routes/recommendations");

const nairobellApp = express();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
    process.exit(1);
  });

nairobellApp.use(express.json()); // Handle JSON payloads
nairobellApp.use(express.urlencoded({ extended: false })); // Handle form payloads

nairobellApp.use("/news", newsRoutes);
nairobellApp.use("/users", userRoutes);
nairobellApp.use("/recommendations", recommendationRoutes);

nairobellApp.get("/", (req, res) => {
  res.send("Welcome to NairoBell!");
});

nairobellApp.use((req, res) => {
  // Catch 404 errors
  res.status(404).send("Sorry, we couldn't find that!");
});

const server = nairobellApp.listen(3001, () => {
  console.log("NairoBell server is running on port 3001");
});

module.exports = { server, nairobellApp };
