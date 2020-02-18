angular.module('dqApp.data')
    .directive('validationLength', ['growl', function(growl) {
        return {
            restrict: 'EA',
            scope: {
            	validation: '='
            },
            templateUrl: 'data/quality/checks/editDirectives/length.html',
            link: function($scope, el, attrs) {
                $scope.newColumn = {
                    column: '',
                    operator: 'lt',
                    option: 0
                };

                $scope.operators = [
                    { value: 'lt', label: 'Less than' },
                    { value: 'gt', label: 'Greater than' },
                ];

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
                        operator: 'lt',
                        option: 0
                    };
                };

                $scope.removeColumn = function(index) {
                    $scope.validation.columns.splice(index, 1);
                };
            }
        };
    }])