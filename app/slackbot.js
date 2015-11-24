var SlackBot = require('slackbots');
var logger = require('../log.js').getLog('slackbot');
var fs = require('fs');
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
    	var channel = self.getChannel(data.channel);
	    if (data.type === 'message' && data.text === 'Hola' && channel.name === 'general') {
	    	var user = self.getUser(data.user);
	    	if (!user.is_bot) {
	    		self.bot.postMessageToChannel(channel.name, 'Bienvenido @'+user.name+'!', self.params);
	    	}
	    }
	});
	this.getChannel = function(channelId) {
		var chs = self.bot.getChannels()._value.channels;
		for (var k=0; k<chs.length; k+=1) {
			if (chs[k].id === channelId) { return chs[k]; }
		}
		return null;
	};
	this.getUser = function(userId) {
		var usrs = self.bot.getUsers()._value.members;
		for (var k=0; k<usrs.length; k+=1) {
			if (usrs[k].id === userId) { return usrs[k]; }
		}
		return null;
	};
	
	this.isValidToken = function(tk) {
		for (var k=0; k<self.bot.slashtokens.length; k+=1) {
			if (self.bot.slashtokens[k] === tk) { return true; }
		}
		return false;
	};
	
	fs.readFile('./.slashtokens', 'utf8', function (err, data) {
		var slashtokens = err ? null : data;
		if (process.env.SLASH_TOKENS || slashtokens) {
			self.bot.slashtokens = (process.env.SLASH_TOKENS || slashtokens).split(',');
		} else {
			logger.error('SlashTokens unavailable, please add one to use mLearnSlack Slash Commands');
		}
	});
	
}

MyLearnBot.prototype.send = function send(msg) {
	this.bot.postMessageToChannel('general', 'I\'m mLearnBot!', this.params);
};

MyLearnBot.prototype.ask = function ask(req) {
	var self = this;
	if (this.isValidToken(req.body.token)) {
		var text = /([0-9]+) (.*)/g.exec(req.body.text);
		if (text) {
			var channelName = req.body.channel_name;
			setTimeout(function() {
				self.bot.postMessageToChannel(channelName, text[2], self.params);
			}, parseInt(text[1])*1000);
			return 'Asking in '+channelName+' channel "'+text[2]+'" in '+text[1]+' second(s) !';
		} else {
			return 'Sintax error.';
		}
	} else {
		return 'Invalid token.';
	}
};

module.exports = MyLearnBot;
