angular.module('dqApp.data')
    .directive('validationDetailsReferenceoption', ['growl', function(growl) {
        return {
            restrict: 'EA',
            scope: {
            	validation: '='
            },
            templateUrl: 'data/quality/checks/detailsDirectives/referenceoption.html',
            link: function($scope, el, attrs) {
                
            }
        };
    }])