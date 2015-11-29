'use strict';
// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var http 		   = require('http');
var server 		   = http.createServer(app);
var logger 		   = require('./log.js').getLog('server');
var MyLearnBot	   = require('./app/slackbot');
var fs 			   = require('fs');

// configuration ===========================================
	
// config files
//var db = require('./config/db');

var port = process.env.OPENSHIFT_NODEJS_PORT ||  process.env.OPENSHIFT_INTERNAL_PORT || 8080; // set our port
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP ||'0.0.0.0'; // set ip addr
// mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// start app ===============================================
//app.listen(port);
server.listen(port, ipaddr);

logger.info('Server listening on port ' + port); 	// shoutout to the user

app.credly = {};

fs.readFile('./.slackapitoken', 'utf8', function (err, data) {
	var slackapitoken = err ? null : data;
	if (process.env.SLACK_API_TOKEN || slackapitoken) {
		app.slack = { api : require('./app/slackapi'),
					  apitoken : process.env.SLACK_API_TOKEN || slackapitoken };
	} else {
		logger.error('SlackApiToken unavailable, please add one to use mLearnSlack');
	}
	fs.readFile('./.slashtokens', 'utf8', function (err, data) {
		var slashtokens = err ? null : data;
		if (process.env.SLASH_TOKENS || slashtokens) {
			app.slack.slashtokens = (process.env.SLASH_TOKENS || slashtokens).split(',');
		} else {
			logger.error('SlashTokens unavailable, please add one to use mLearnSlack Slash Commands');
		}
		fs.readFile('./.slacktoken', 'utf8', function (err, data) {
			var slacktoken = err ? null : data;
			if (process.env.SLACK_TOKEN || slacktoken) {
				var bot = new MyLearnBot(app.slack, app.credly, process.env.SLACK_TOKEN || slacktoken, process.env.SLACK_BOT_NAME || 'emusbot');
				app.bot = bot;
				logger.info('MLearnSlackBot Launched !!');
			} else {
				logger.error('SlackToken unavailable, please add one to use mLearnSlack');
			}
		});
	});
});

fs.readFile('./.credlyapitoken', 'utf8', function (err, data) {
	var credlyapitoken = err ? null : data;
	if (process.env.CREDLY_API_TOKEN || credlyapitoken) {
		app.credly.api = require('./app/credlyapi');
		app.credly.apitoken = process.env.CREDLY_API_TOKEN || credlyapitoken;
	} else {
		logger.error('CredlyApiToken unavailable, please add one to use mLearnSlack');
	}
	fs.readFile('./.credlyapisecret', 'utf8', function (err, data) {
		var credlyapisecret = err ? null : data;
		if (process.env.CREDLY_API_SECRET || credlyapisecret) {
			app.credly.apisecret = (process.env.CREDLY_API_SECRET || credlyapisecret).split(',');
		} else {
			logger.error('CredlyApiSecret unavailable, please add one to use mLearnSlack');
		}
		fs.readFile('./.credlyapiuser', 'utf8', function (err, data) {
			var credlyapiuser = err ? null : data;
			if (process.env.CREDLY_API_USER || credlyapiuser) {
				// Reload badges every hour !!
				app.credly.apiuser = process.env.CREDLY_API_USER || credlyapiuser;
				app.credly.apiyear = process.env.CREDLY_API_YEAR || '2015';
				app.credly.api.badges(app.credly, app.credly.apiuser, app.credly.apiyear);
			} else {
				logger.error('CredlyApiUser unavailable, please add one to use mLearnSlack');
			}
		});
	});
});


exports = module.exports = app; // expose app
