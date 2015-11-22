/*'use strict';
angular.module('mLearnSlackApp').factory('MainService', ['$http',function($http) {

	return {
        // call to get all main
        get : function() {
            return $http.get('/api/main');
        },

        // call to POST and create a new main
        create : function(mainData) {
            return $http.post('/api/main', mainData);
        },

        // call to DELETE a main
        delete : function(id) {
            return $http.delete('/api/main/' + id);
        }
    }; 

}]);*/