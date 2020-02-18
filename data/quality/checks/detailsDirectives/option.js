angular.module('dqApp.data')
    .directive('validationDetailsOption', ['growl', function(growl) {
        return {
            restrict: 'EA',
            scope: {
            	validation: '='
            },
            templateUrl: 'data/quality/checks/detailsDirectives/option.html',
            link: function($scope, el, attrs) {
                
            }
        };
    }])