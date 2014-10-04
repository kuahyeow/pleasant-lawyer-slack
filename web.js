var express = require("express");
var bodyParser = require('body-parser');
var logfmt = require("logfmt");
var app = express();
exports.app = app

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

app.post('/slack', function(req, res) {
  var inputText = req.param('text')

  if(pleasantLawyer.isBeetilNumber(inputText.trim())) {
    var number = inputText.trim()

    var text   = pleasantLawyer.processTextInput(number)
  } else {
    var text   = inputText.trim()

    var number = pleasantLawyer.processTextInput(text)
    text       = pleasantLawyer.processTextInput(number)
  }

  var result = "\"" + text + "\"" + " https://desk.gotoassist.com/goto?q=" + number
  res.send(result)
})


if (__filename === process.argv[1]) {
  var port = Number(process.env.PORT || 5000);
  app.listen(port, function() {
    console.log("Listening on " + port);
  });
}

