var express = require("express");
var bodyParser = require('body-parser');
var logfmt = require("logfmt");
var app = express();
PleasantLawyer = require('./pleasant-lawyer');
var pleasantLawyer = new PleasantLawyer();
var slacker = require('./slack');

app.use(logfmt.requestLogger());
// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/', function(req, res) {
  res.send('Hello World!');
});


var slackTextToPL = function(inputText, req, res) {
  var number  = slacker.splitSlackTextInput(inputText.trim())
  var text    = ""
  if(number)
    text = pleasantLawyer.numberToWords(number)
  if(text != "")
    text = text + " " + "https://desk.gotoassist.com/goto?q=" + number
  slacker.sendToSlack(text, req, res)
}

app.get('/slack_lawyer', function(req, res) {
  var inputText = req.query.text
  slackTextToPL(inputText, req, res)
})

app.post('/slack_lawyer', function(req, res) {
  var inputText = req.param('text')
  slackTextToPL(inputText, req, res)
})

var slackTextToBeetil = function(inputText, req, res) {
  var plPhrase  = slacker.splitSlackTextInput(inputText)
  var number    = null
  var text      = ""
  if(plPhrase)
    number = pleasantLawyer.stringToNumber(plPhrase.trim())
  if(number)
    text = number + " " + "https://desk.gotoassist.com/goto?q=" + number
  slacker.sendToSlack(text, req, res)
}

app.get('/slack_beetil', function(req, res) {
  var inputText = req.query.text
  slackTextToBeetil(inputText, req, res)
})

app.post('/slack_beetil', function(req, res) {
  var inputText = req.param('text')
  slackTextToBeetil(inputText, req, res)
})


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
