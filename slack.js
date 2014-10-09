var tokens = require('./env_vars')

var webhookUrl = "https://powershop.slack.com/services/hooks/incoming-webhook?token=" + tokens.outboundToken
var slack = require('slack-notify')(webhookUrl);

var Slacker = function() {
  var beetilBot = slack.extend({
    username: 'BeetilBot',
    icon_emoji: ':beetle:'
  })

  this.sendToSlack = function(channelName, text) {
    if(tokens.outboundToken) {  // do nothing if no token configured
      beetilBot({
        channel: channelName,
        text: text
      });
    }
  }
}


module.exports = new Slacker()
