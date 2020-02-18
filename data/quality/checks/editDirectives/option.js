angular.module('dqApp.data')
    .directive('validationOption', ['growl', function(growl) {
        return {
            restrict: 'EA',
            scope: {
            	validation: '='
            },
            templateUrl: 'data/quality/checks/editDirectives/option.html',
            link: function($scope, el, attrs) {
                $scope.formats = [
                    { value: 'ni', label: 'National Insurance Number' },
                    { value: 'date', label: 'Date' },
                    { value: 'time', label: 'Time' },
                    { value: 'datetime', label: 'Datetime' }
                ];

                $scope.defaultOption = {
                    number: 0,
                    string: '',
                    format: $scope.formats[0].value
                };

                $scope.newColumn = {
                    column: '',
                    option: $scope.defaultOption[$scope.validation.subtype]
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
                        option: $scope.defaultOption[$scope.validation.subtype]
                    };
                };

                $scope.removeColumn = function(index) {
                    $scope.validation.columns.splice(index, 1);
                };
            }
        };
    }])