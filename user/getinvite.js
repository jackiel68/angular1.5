angular.module('dqApp.user')
.controller('getInviteController', ['$rootScope', '$scope', '$state', '$stateParams', '$location', '$cookies', '$timeout','ENV', '$http', 'growl', '$state', 'UserService',
    function($rootScope, $scope, $state, $stateParams, $location, $cookies, $timeout, ENV, $http, growl, $state, UserService) {

        var vm = this;
        vm.user = {};

        vm.init = function() {
            vm.code = $stateParams.code;
            vm.codeChecking = true;
            UserService.checkInviteCode(vm.code).then(function(result) {
                vm.codeValid = true;
                vm.codeChecking = false;
            }, function(error) {
                vm.codeValid = false;
                vm.codeChecking = false;
            });
        };

        vm.getInvite = function() {
            if(!vm.agree) {
                growl.error('You should agree terms of agreements');
                return;
            }
            UserService.acceptInvite(vm.code, vm.user).then(function(result) {
                growl.error('Registered Successfully');
                $state.go('login');
            }, function(error) {
                growl.error('Error regstering');
            });
        };

        vm.init();

    }]);