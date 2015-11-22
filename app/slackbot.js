var SlackBot = require('slackbots');
var logger = require('../log.js').getLog('slackbot');
// My module
function MyLearnBot(mtoken) {
	// create a bot 
	var self = this;
	this.params = { icon_emoji: ':classical_building:' };
	this.bot = new SlackBot({
	    token: mtoken, // Add a bot  
	    name: 'MLearnBot'
	});
	this.bot.on('start', function() {
	    // more information about additional params 
		// https://api.slack.com/methods/chat.postMessage 
	    //self.bot.postMessageToChannel('general', 'I\'m mLearnBot!', self.params);
	});
	/**
	 * @param {object} data
	 */
	this.bot.on('message', function(data) {
	    // all ingoing events https://api.slack.com/rtm
		//logger.info(data);
	    if (data.type === 'message') {
	    	if (data.text === 'Hola') {
	    		self.bot.postMessageToChannel('general', 'Bienvenido!', self.params);
	    	}
	    }
	});
}

MyLearnBot.prototype.send = function send(msg) {
  this.bot.postMessageToChannel('general', 'I\'m mLearnBot!', this.params);
};

module.exports = MyLearnBot;
