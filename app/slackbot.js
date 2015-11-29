var SlackBot = require('slackbots');
var logger = require('../log.js').getLog('slackbot');
var fs = require('fs');
var extend = require('extend');
// My module
function MyLearnBot(slack,credly,bot_token,botname) {
	// create a bot 
	var self = this;
	this.params = { icon_emoji: ':classical_building:' };
	this.credlyapi = credly;
	this.slackapi = slack.api;
	this.slackapi_token = slack.apitoken;
	this.slackslashtokens = slack.slashtokens;
	this.bot = new SlackBot({
	    token: bot_token, // Add a bot  
	    name: botname
	});
	this.bot.on('start', function() {
	    // more information about additional params 
		// https://api.slack.com/methods/chat.postMessage 
	    //self.bot.postMessageToChannel('general', 'I\'m mLearnBot!', self.params);
		/*self.slackapi.channel.list({token:self.slackapi_token},function(err,data){
			logger.info(data);
		});
		self.bot._api('groups.list').then(
				function(data){
					logger.info(data);
				},
				function(data){
					logger.info(data);
				},
				function(){
					logger.info('Notify!!');
				});*/
	});
	/**
	 * @param {object} data
	 */
	this.bot.on('message', function(data) {
	    // all ingoing events https://api.slack.com/rtm
		//logger.info(data);
		if (data.type === 'message') {
			var obj = null;
	    	var channelType = data.channel.slice(0, 1);
	    	var functionType = '';
	    	switch (channelType) {
	    		case 'C': 
	    				obj = self.getChannel(data.channel);
	    				functionType = 'channel';
	    				break;
	    		case 'G': 
	    				obj = self.getGroup(data.channel);
	    				functionType = 'group';
	    				break;
	    		case 'D': 
	    				obj = self.getDM(data.channel);
	    				functionType = 'user';
	    				break;
	    	}
		    if (data.text === 'Hola') {
		    	var user = self.getUser(data.user);
		    	if (!user.is_bot) {
		    		var params = extend({ 
		    			'attachments': JSON.stringify([ {
    						'color': '#36a64f',
    			            'text': 'Utiliza esta guía para aprender a usar Slack !!',
    			            'fields': [ {
    			            	'title': 'Guía del buen uso del canal eMus',
    			                'value': 'http://www.um.es/',
    			                'short': false
    			             }]
    			        } ])
    				}, self.params);
		    		self.bot._post(functionType, obj.name || user.name,'Bienvenido <@'+data.user+'>',params);
		    	}
		    }
		    if (data.text === 'show badges' && functionType === 'user') {
		    	var user = self.getUser(data.user);
		    	if (!user.is_bot) {
		    		self.credlyapi.api.badges(self.credlyapi, self.credlyapi.apiuser, self.credlyapi.apiyear,function(){
			    		var badgeList = [];
			    		for (var k=0; k<self.credlyapi.badges.length; k+=1) {
			    			badgeList.push({
			    				'title': ':' + self.credlyapi.badges[k].id + ': ' + self.credlyapi.badges[k].title,
			    				'value': self.credlyapi.badges[k].short_description,
			    				'short': true
			    			});
			    		}
			    		var msg = [{ 'color' : '#36a64f', 'fields' : badgeList }];
			    		var params = extend({ 'attachments': JSON.stringify(msg) }, self.params);
			    		self.bot._post(functionType, obj.name || user.name,'Listado de medallas disponibles.',params);
		    		});
		    	}
		    }
		}
	});
	this.getDM = function(dmId) {
		return this.getObjectFromList(dmId,self.bot.ims);
	};
	this.getGroup = function(groupId) {
		return this.getObjectFromList(groupId,self.bot.groups);
	};
	this.getChannel = function(channelId) {
		return this.getObjectFromList(channelId,self.bot.channels);
	};
	this.getUser = function(userId) {
		return this.getObjectFromList(userId,self.bot.users);
	};
	this.getObjectFromList = function(objId,list) {
		for (var k=0; k<list.length; k+=1) {
			if (list[k].id === objId) { return list[k]; }
		}
		return null;
	};
	this.isValidToken = function(tk) {
		for (var k=0; k<self.slackslashtokens.length; k+=1) {
			if (self.slackslashtokens[k] === tk) { return true; }
		}
		return false;
	};
	
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
