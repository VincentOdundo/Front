const mongoose = require("mongoose");
const News = require("./routes/news");
// Positive test case for creating a news article
test("create a news article", async () => {
  const news = new News({
    title: "Test News",
    link: "https://testnews.com",
    imgUrl: "https://testnews.com/image.jpg",
    pubDate: new Date(),
    publisherLogo: "https://testnews.com/logo.jpg",
    category: ["test"],
  });
  const savedNews = await news.save();
  expect(savedNews._id).toBeDefined();
});
// Negative test case for creating a news article with missing required fields
test("create a news article with missing required fields", async () => {
  const news = new News({
    imgUrl: "https://testnews.com/image.jpg",
    pubDate: new Date(),
    publisherLogo: "https://testnews.com/logo.jpg",
    category: ["test"],
  });
  await expect(news.save()).rejects.toThrow();
});
// Positive test case for finding a news article
test("find a news article", async () => {
  const news = new News({
    title: "Test News",
    link: "https://testnews.com",
    imgUrl: "https://testnews.com/image.jpg",
    pubDate: new Date(),
    publisherLogo: "https://testnews.com/logo.jpg",
    category: ["test"],
  });
  await news.save();
  const foundNews = await News.findOne({ title: "Test News" });
  expect(foundNews).toBeDefined();
});
// Negative test case for finding a non-existent news article
test("find a non-existent news article", async () => {
  const foundNews = await News.findOne({ title: "Non-existent News" });
  expect(foundNews).toBeNull();
});
