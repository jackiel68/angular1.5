angular.module('dqApp.user')
    .controller('profileController', ['$rootScope', '$scope', '$location', '$cookies', '$timeout','ENV', '$http', 'growl', '$state', function($rootScope, $scope, $location, $cookies, $timeout, ENV, $http, growl, $state) {

        $scope.profile = {};

        $scope.init = function() {
            var url = ENV.api_url + '/user';

            $http.get(url).then(function(result) {
                $scope.profile.email = result.data.data.email;
                $scope.profile.name = result.data.data.name;
            }, function(error) {
                growl.error('Error loading profile information');
            });
        };

        $scope.init();

        $scope.updateProfile = function() {
            var url = ENV.api_url + '/user/update';

            $http.post(url, {
                email: $scope.profile.email,
                name: $scope.profile.name,
                password: $scope.password,
                password_confirmation: $scope.confirmPassword
            }).then(function(result) {
                growl.success('Successfully updated profile.');
                $state.go('data.console');
            }, function(error) {
                growl.error('Error!');
            });
        };
    }]);