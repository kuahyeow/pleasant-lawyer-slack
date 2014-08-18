var express = require("express");
var logfmt = require("logfmt");
var app = express();
PleasantLawyer = require('./pleasant-lawyer');
var pleasantLawyer = new PleasantLawyer();

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.all('/pleasant_lawyer', function(req, res) {
  var inputText = req.query.text
  if(!inputText) {
    res.send("text query parameter required")
    return
  }

  var number    = inputText.split(':')[1]
  var text      = ""
  if(number) {
    text = pleasantLawyer.numberToWords(number)
  }

  if(req.accepts('application/json')) {
    res.send({text: text})
  } else {
    res.send(text)
  }
})

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
