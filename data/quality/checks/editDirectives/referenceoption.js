angular.module('dqApp.data')
    .directive('validationReferenceOption', ['growl', function(growl) {
        return {
            restrict: 'EA',
            scope: {
            	validation: '=',
                references: '='
            },
            templateUrl: 'data/quality/checks/editDirectives/referenceoption.html',
            link: function($scope, el, attrs) {
                $scope.newColumn = {
                    column: '',
                    reference_slug: null,
                    reference_column: null
                };

                $scope.addColumn = function() {
                    if($scope.newColumn.column=='') {
                        growl.error('Select column to validate');
                        return;
                    }
                    if(_.find($scope.validation.columns, {column:$scope.newColumn.column})) {
                        growl.error('It was already added');
                        return;
                    }
                    if(!$scope.validation.columns) {
                        $scope.validation.columns = [];
                    }
                    $scope.validation.columns.push($scope.newColumn);
                    $scope.newColumn = {
                        column: '',
                        reference_slug: null,
                        reference_column: null
                    };
                };

                $scope.removeColumn = function(index) {
                    $scope.validation.columns.splice(index, 1);
                };
            }
        };
    }])