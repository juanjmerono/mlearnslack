'use strict';
var request = require('request');
var logger = require('../log.js').getLog('credly');
var api = {
	
		badges : function(credly,fromId,year,cb) {
			request({
			    headers: {
			      'X-Api-Key': credly.apitoken,
			      'X-Api-Secret': credly.apisecret
			    },
			    uri: 'https://api.credly.com/v1.1/badges?member_id='+fromId+'&query='+year,
			    method: 'GET'
			  }, function (err, res, body) {
				  if (!err) { credly.badges = JSON.parse(body).data; }
				  if (cb) { cb(); }
			  });
		},
		giveBadges : function(credly,id,postData) {
			request({
			    headers: {
			      'X-Api-Key': credly.apitoken,
			      'X-Api-Secret': credly.apisecret
			    },
			    uri: 'https://api.credly.com/v1.1/member_badges',
			    method: 'POST'
			  }, function (err, res, body) {
			    logger.info(body);
			  });
		}
		
};

module.exports = api;