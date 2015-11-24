var logger = require('../log.js').getLog('routes');
var request = require('request');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	// frontend routes =========================================================

	// Just listen Outgoing WebHook (Helps to keep openshift active)
	app.get('/slack', function(req, res) {
		res.send('{}');
	});

	// Slash command /ask
	app.post('/ask', function(req, res) {
		if (app.bot) {
			res.send(app.bot.ask(req));
		} else {
			res.send('Cannot ask, bot missing.');
		}
	});

	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};