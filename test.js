const assert = require("assert");
const request = require("supertest");
const { nairobellApp } = require("../Front/index");
describe("News Route", () => {
  it("should return all news articles", (done) => {
    request(nairobellApp)
      .get("/news")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.length, 10);
        done();
      });
  });
  it("should return a single news article", (done) => {
    request(nairobellApp)
      .get("/news/1")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.title, "Breaking News");
        done();
      });
  });
  it("should return 404 error for invalid news ID", (done) => {
    request(nairobellApp)
      .get("/news/100")
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.message, "News article not found");
        done();
      });
  });
});
