angular.module('dqApp.data')
    .directive('validationValue', ['growl', function(growl) {
        return {
            restrict: 'EA',
            scope: {
            	validation: '='
            },
            templateUrl: 'data/quality/checks/editDirectives/value.html',
            link: function($scope, el, attrs) {
                
            }
        };
    }])