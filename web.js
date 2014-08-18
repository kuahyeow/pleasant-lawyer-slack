var express = require("express");
var bodyParser = require('body-parser');
var logfmt = require("logfmt");
var app = express();
PleasantLawyer = require('./pleasant-lawyer');
var pleasantLawyer = new PleasantLawyer();

app.use(logfmt.requestLogger());
// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/', function(req, res) {
  res.send('Hello World!');
});


var inputTextToPL = function(inputText) {
  if(!inputText) {
    return
  }

  var number    = inputText.split(':')[1]
  var text      = ""
  if(number) {
    text = pleasantLawyer.numberToWords(number)
  }
  return text
}

var sendToSlack = function(message, req, res) {
  if(req.accepts('application/json')) {
    res.send({text: message})
  } else {
    res.send(text)
  }
}

app.get('/pleasant_lawyer', function(req, res) {
  var inputText = req.query.text
  var text = inputTextToPL(inputText)
  sendToSlack(text, req, res)
})

app.post('/pleasant_lawyer', function(req, res) {
  var inputText = req.param('text')
  var text = inputTextToPL(inputText)
  sendToSlack(text, req, res)
})


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
