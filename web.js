var tokens = require('./env_vars')
var express = require("express");
var bodyParser = require('body-parser');
var logfmt = require("logfmt");
var slacker = require('./slack');
PleasantLawyer = require('./pleasant-lawyer');
var pleasantLawyer = new PleasantLawyer();

var app = express();
exports.app = app


app.use(logfmt.requestLogger());
// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/', function(req, res) {
  res.send('Hello World!');
});

var constructResultFromQuery = function(inputText){
  if(pleasantLawyer.isBeetilNumber(inputText.trim())) {
    var number = inputText.trim()

    var text   = pleasantLawyer.processTextInput(number)
  } else {
    var text   = inputText.trim()

    var number = pleasantLawyer.processTextInput(text)
    text       = pleasantLawyer.processTextInput(number)
  }

  var result = "\"" + text + "\"" + " https://desk.gotoassist.com/goto?q=" + number
  return result
}

app.get('/beetil', function(req, res) {
  var channelName = req.param('channel_name')
  var inputText = req.param('text')
  var result = constructResultFromQuery(inputText)
  slacker.sendToSlack(channelName, result)
  res.status(200).end()  // nothing to show to Slack
})

// Token has to be the same as provided by Slack
// otherwise we open up the world to spam our channels!
app.post('/beetil', function(req, res) {
  var token = req.param('token')
  if (!tokens.inboundToken){
    res.status(500).send("token not found!")
  }
  if (token != tokens.inboundToken){
    res.status(401).send("Invalid request")
  }

  var channelName = req.param('channel_name')
  var inputText = req.param('text')
  var result = constructResultFromQuery(inputText)
  slacker.sendToSlack(channelName, result)
  res.status(200).end()  // nothing to show to Slack
})

app.post('/slack', function(req, res) {
  var inputText = req.param('text')

  res.send(constructResultFromQuery(inputText))
})


if (__filename === process.argv[1]) {
  var port = Number(process.env.PORT || 5000);
  app.listen(port, function() {
    console.log("Listening on " + port);
  });
}

