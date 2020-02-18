angular.module('dqApp.data')
    .directive('validationAddress', ['growl', function(growl) {
        return {
            restrict: 'EA',
            scope: {
            	validation: '='
            },
            templateUrl: 'data/quality/checks/editDirectives/address.html',
            link: function($scope, el, attrs) {
                $scope.remove = function(col) {
                    $scope.validation.columns = _.omit($scope.validation.columns, col);
                };
            }
        };
    }])