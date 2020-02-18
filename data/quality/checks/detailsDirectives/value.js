angular.module('dqApp.data')
    .directive('validationDetailsValue', ['growl', function(growl) {
        return {
            restrict: 'EA',
            scope: {
            	validation: '='
            },
            templateUrl: 'data/quality/checks/detailsDirectives/value.html',
            link: function($scope, el, attrs) {
                
            }
        };
    }])