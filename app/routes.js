var logger = require('../log.js').getLog('proxy');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	// frontend routes =========================================================

	// Just listen Outgoing WebHook (Helps to keep openshift active)
	app.get('/slack', function(req, res) {
		res.send('{}');
	});

	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};