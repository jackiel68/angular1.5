angular.module('dqApp.data')
    .directive('validationDetailsLength', ['growl', function(growl) {
        return {
            restrict: 'EA',
            scope: {
            	validation: '='
            },
            templateUrl: 'data/quality/checks/detailsDirectives/length.html',
            link: function($scope, el, attrs) {
                
            }
        };
    }])