angular.module('dqApp.data')
    .directive('validationDetailsOptions', ['growl', function(growl) {
        return {
            restrict: 'EA',
            scope: {
            	validation: '='
            },
            templateUrl: 'data/quality/checks/detailsDirectives/options.html',
            link: function($scope, el, attrs) {
                
            }
        };
    }])