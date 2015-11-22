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

logger.info('Server listening on port ' + port); 			// shoutout to the user

fs.readFile('./.slacktoken', 'utf8', function (err, data) {
	var slacktoken = err ? null : data;
	if (process.env.SLACK_TOKEN || slacktoken) {
		var bot = new MyLearnBot(process.env.SLACK_TOKEN || slacktoken);
		logger.info('MLearnSlackBot Launched !!');
	} else {
		logger.error('SlackToken unavailable, please add one to use mLearnSlack');
	}
});

exports = module.exports = app; 						// expose app