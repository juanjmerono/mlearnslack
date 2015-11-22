'use strict';
angular.module('mLearnSlackApp.routes').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})
		
		.when('/badges', {
			templateUrl: 'views/badges.html',
			controller: 'BadgesController'
		});

	$locationProvider.html5Mode(true);

}]);