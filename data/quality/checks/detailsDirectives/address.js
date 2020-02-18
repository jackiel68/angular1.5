angular.module('dqApp.data')
    .directive('validationDetailsAddress', ['growl', function(growl) {
        return {
            restrict: 'EA',
            scope: {
            	validation: '='
            },
            templateUrl: 'data/quality/checks/detailsDirectives/address.html',
            link: function($scope, el, attrs) {
                
            }
        };
    }])