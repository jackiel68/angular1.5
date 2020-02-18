angular.module('dqApp.user')
.controller('newUserController', ['$rootScope', '$scope', '$location', '$cookies', '$timeout','ENV', '$http', 'growl', '$state', 'UserService',
    function($rootScope, $scope, $location, $cookies, $timeout, ENV, $http, growl, $state, UserService) {

        var vm = this;
        vm.isLoading = false;
        vm.user = {};
        vm.roles = [];

        vm.init = function() {
            vm.isLoading = true;
            UserService.getRoles().then(function(result) {
                vm.isLoading = false;
                vm.roles = result.data.data;
            }, function(error) {
                vm.isLoading = false;
            });
        };

        vm.createUser = function() {
            UserService.createUser(vm.user).then(function(result) {
                growl.success('Created successfully');
            }, function(error) {
                growl.error('Error creating user');
            });
        };

        vm.init();

    }]);