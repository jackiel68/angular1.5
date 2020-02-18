angular.module('dqApp.data')
    .directive('validationDetailsDuplicate', ['growl', function(growl) {
        return {
            restrict: 'EA',
            scope: {
            	validation: '='
            },
            templateUrl: 'data/quality/checks/detailsDirectives/duplicate.html',
            link: function($scope, el, attrs) {
                
            }
        };
    }])