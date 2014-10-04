var Requester, request;

request = require("request");

Requester = (function() {
  function Requester() {}

  Requester.prototype.get = function(path, callback) {
    return request("http://localhost:5001" + path, callback);
  };

  Requester.prototype.post = function(path, body, callback) {
    return request.post({
      url: "http://localhost:5001" + path,
      body: body
    }, callback);
  };

  return Requester;

})();

exports.withServer = function(callback) {
  var app, stopServer;
  asyncSpecWait();
  app = require("../web").app;
  stopServer = function() {
    app.close();
    return asyncSpecDone();
  };
  app.listen(5001, function() {
    console.log("Listening on " + 5001);
  })
  return callback(new Requester, stopServer);
};
