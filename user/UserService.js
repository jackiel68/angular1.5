angular.module('dqApp.user')
    .factory('UserService', function ($http, ENV, $q, $cookies, $state) {
        var service = {};

        service.getRoles = function() {
            var url = ENV.api_url + '/user/roles';
            return $http.get(url);
        };

        service.createUser = function(user) {
            var url = ENV.api_url + '/user/create';
            return $http.post(url, user);
        };

        service.checkInviteCode = function(code) {
            var url = ENV.api_url + '/user/check/' + code;
            return $http.post(url);
        };

        service.acceptInvite = function(code, user) {
            var url = ENV.api_url + '/user/accept/' + code;
            return $http.post(url, user);
        };

        return service;
    });
