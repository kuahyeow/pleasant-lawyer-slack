var request = require("request")

describe("App", function() {
  describe("get /", function() {
    // TODO use http://blog.drewolson.org/post/14684497867/
    // rather relying on starting real server, which needs to be restarted manually :(((
    it("should respond with hello world", function(done) {
      request("http://localhost:5000/", function(error, response, body){
        expect(response.statusCode).toEqual(200);
        done();
      });
    }, 250); // timeout after 250 ms
  });

  describe("post /slack", function() {
    it("should respond successfully with a text parameter", function(done) {
      request.post("http://localhost:5000/slack", {form:{text: "1234"}}, function(error, response, body) {
        expect(response.statusCode).toEqual(200)
        done()
      })
    }, 250)

    it("should understand numeric inputs", function(done) {
      request.post("http://localhost:5000/slack", {form:{text: "1234"}}, function(error, response, body) {
        expect(response.body).toMatch(/1234/)
        expect(response.body).toMatch(/tearful trip/)
        done()
      })
    }, 250)

    it("should understand phrase inputs", function(done) {
      request.post("http://localhost:5000/slack", {form:{text: "tearful trip"}}, function(error, response, body) {
        expect(response.body).toMatch(/1234/)
        expect(response.body).toMatch(/tearful trip/)
        done()
      })
    }, 250)

  })
});
