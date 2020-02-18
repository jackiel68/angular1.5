angular.module('dqApp.data')
    .directive('validationDuplicate', ['growl', function(growl) {
        return {
            restrict: 'EA',
            scope: {
            	validation: '='
            },
            templateUrl: 'data/quality/checks/editDirectives/duplicate.html',
            link: function($scope, el, attrs) {
                
            }
        };
    }])