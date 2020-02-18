'use strict';

angular.module('dqApp.user')
.controller('userController', ['growl', '$rootScope', '$scope', '$state', '$location', '$window', '$cookies', '$modal', '$http', 'Alert', 'ENV',
    function (growl, $rootScope, $scope, $state, $location, $window, $cookies, $modal, $http, Alert, ENV) {

        $scope.login = function() {
            if ($cookies.get('isLoggedIn') == true) {
                $state.go('data.console');
                return;
            }

            $http.post(ENV.api_url + '/auth/login', {
                email: $scope.username,
                password: $scope.password
            }).then(function(result) {
                $cookies.put('token', result.data.data.token, {
                    // expires: moment().add(15, 'minutes').toDate()
                });

                $http.defaults.headers.common.Authorization = "Bearer " + $cookies.get('token');
                $cookies.put('isLoggedIn', true);

                var user = result.data.data.user.data;
                $cookies.put('username', user.name);
                $cookies.put('userid', user.id);
                $cookies.put('isUserAdmin', user.role.data.user_admin == '1');
                $cookies.put('isDataAdmin', user.role.data.data_admin == '1');

                $rootScope.isLoggedIn = true;
                $rootScope.curuser = {
                    name: $cookies.get('username'),
                    id: $cookies.get('userid'),
                    isUserAdmin: $cookies.get('isUserAdmin') == 'true',
                    isDataAdmin: $cookies.get('isDataAdmin') == 'true'
                };

                $state.go('data.console');
            }, function(error) {
                growl.error('Error!');
            });
        };

        $scope.logout = function () {
            $cookies.put('isLoggedIn', false);
            $cookies.remove('username');
            $cookies.remove('userid');
            $cookies.remove('token');
            $cookies.remove('isUserAdmin');
            $cookies.remove('isDataAdmin');

            $rootScope.isLoggedIn = false;
            $rootScope.curuser = {};

            delete $http.defaults.headers.common.Authorization;

            $state.go('login');
        };

        $scope.createAccount = function () {
            if($scope.agree != true) {
                growl.error('You should agree to the terms of services.');
                return;
            }
            
            var url = ENV.api_url + '/user/register';
            $http.post(url, {
                name: $scope.name,
                email: $scope.email,
                password: $scope.password,
                password_confirmation: $scope.passwordConfirm,
                organisation_name: $scope.organization
            }).then(function(result) {
                growl.success('Thank you for registering. We shall be in touch shortly');
                $state.go('login');
            }, function(error) {
                growl.error('Error! '+error.data.message);
            });
        };

        $scope.forgotpasswd = function () {
            var url = ENV.api_url + '/auth/forgot';
            $http.post(url, {
                email: $scope.email
            }).then(function(result) {
                growl.success("Check your Email for your new Password.");
                $state.go('login');
            }, function(response) {
                growl.error("Error occured");
            });
        };

        $scope.resetpasswd = function () {
            var url = ENV.api_url + '/auth/reset';
            $http.post(url, {
                email: $scope.email,
                password: $scope.password,
                password_confirmation: $scope.confirmPassword,
                token: $location.hash()
            }).then(function(result) {
                growl.success('Sign up success. Please wait for your account to be approved.');
                $state.go('login');
            }, function(error) {
                growl.error('Error!');
            });
        };

        $scope.init = function () {

        };

        $scope.init();

    }]);