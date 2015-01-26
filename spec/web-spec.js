var request = require("request")
var dotenv = require('dotenv');
dotenv._getKeyAndValueFromLine('spec.env');
dotenv._setEnvs();
console.log(process.env.INBOUND_TOKEN)

// Remmber start a real web server with "node web.js" first

var app = require("../web").app;
var http = require("http");
var server = http.createServer(app).listen(5000);

describe("App", function() {
  describe("get /", function() {
    // TODO use http://blog.drewolson.org/post/14684497867/
    // rather relying on starting real server, which needs to be restarted manually :(((
    it("should respond with hello world", function(done) {
      request("http://localhost:5000/", function(error, response, body){
        expect(response.statusCode).toEqual(200);
        done();
      });
    }, 250);
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

    it("should understand incomplete phrase inputs with 3 chars", function(done) {
      request.post("http://localhost:5000/slack", {form:{text: "tea tri"}}, function(error, response, body) {
        expect(response.body).toMatch(/1234/)
        expect(response.body).toMatch(/tearful trip/)
        done()
      })
    }, 250)

  });

  describe("post /beetil", function(){
    it("should not respond without a token", function(done) {
      request.post("http://localhost:5000/beetil", {form:{text: "1234"}}, function(error, response, body) {
        expect(response.statusCode).toEqual(401)
        done()
      })
    }, 250)

    it("should respond successfully with a text parameter", function(done) {
      request.post("http://localhost:5000/beetil", {form:{text: "1234", token: "abcd"}}, function(error, response, body) {
        expect(response.statusCode).toEqual(200)
        done()
      })
    }, 250)
  })
});


setTimeout(function(){
  server.close()
}, 2000)
