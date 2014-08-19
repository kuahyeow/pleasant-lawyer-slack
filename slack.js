var Slacker = function() {
  this.splitSlackTextInput = function(inputText) {
    if(!inputText) {
      return
    }

    return inputText.split(':')[1]
  }


  this.sendToSlack = function(message, req, res) {
    if(req.accepts('application/json')) {
      res.send({text: message})
    } else {
      res.send(text)
    }
  }
}


module.exports = new Slacker()
