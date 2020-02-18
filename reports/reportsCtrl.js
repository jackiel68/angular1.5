'use strict';

angular.module('dqApp.reports')
.controller('reportsController', ['$rootScope','$scope', '$location', '$cookies', '$modal', '$http', '$timeout', 'growl', 'QualityService', 'UiGridService', 
function($rootScope, $scope, $location, $cookies, $modal, $http, $timeout, growl, QualityService, UiGridService) {

	var vm = this;

	vm.init = function() {
		vm.qualities = [];
		vm.failuresTotal = 0;
		vm.failuresGraph = {
			options: {
                chart: {
                    type: 'column',
		            options3d: {
		                enabled: true,
		                alpha: 10,
		                beta: 25,
		                depth: 70
		            },
		            spacing: [10, 0, 30, 0]
                },
                plotOptions: {
		            series: {
		                pointWidth: 10,
		                point: {
		                	events: {
		                		click: function() {
		                			vm.selectQuality(this.index);
		                		}
		                	}
		                }
		            }
		        },
		        legend: {
		        	enabled: false
		        }
            },
           	title: {
           		text: null
	        },
	        xAxis: {
	            categories: []
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                enabled: false
	            }
	        },
	        series: [{
				name: 'failures',
				data: []
	        }]
		};

		vm.qualitySelected = null;
		vm.failuresGrid = {
            api: null,
            options: UiGridService.getDefaultOptions(function(api) {
                vm.failuresGrid.api = api;
            })
        };
        vm.failuresGrid.options.useExternalPagination = false;

		vm.getQualities();
	};

	vm.getQualities = function() {
        QualityService.getQualities().then(function(qualities) {
        	vm.qualities = _.filter(qualities, function(quality) {
        		return quality.activity.data.status == 'complete';
        	});

        	_.each(vm.qualities, function(quality) {
        		quality.datasetSlug = quality.dataset.data.slug;
                if(quality.rules instanceof Array) {
                    quality.rule = quality.rules[0].rule;
                    quality.columns = _.pluck(quality.rules, 'column');
                } else if(quality.rules instanceof Object) {
                    quality.rule = _.keys(quality.rules)[0];
                    if(quality.rule=='duplicate') {
                    	quality.columns = quality.rules.duplicate;
                    }
                }
                quality.validation = QualityService.getValidation(quality.rule);
                quality.title = quality.datasetSlug + '_Validation_' + quality.validation.label;

                if(parseInt(quality.failures)==0) {
                	quality.results = [];
                }

                vm.failuresTotal += parseInt(quality.failures);

                vm.failuresGraph.xAxis.categories.push(quality.title);
				vm.failuresGraph.series[0].data.push(parseInt(quality.failures));
        	});
        }, function(error) {
            growl.error('Error getting quality results');
        });
	};



	vm.selectQuality = function(index) {
		vm.qualitySelected = vm.qualities[index];

		vm.failuresGrid.options.columnDefs = [];
		vm.failuresGrid.options.data = [];
	
		if(vm.qualitySelected.results) {
			vm.setFailuresGrid(vm.qualitySelected);
		} else {
			vm.getQualityResults(vm.qualitySelected, function() {
				vm.setFailuresGrid(vm.qualitySelected);
			});
		}
	};

	vm.getQualityResults = function(quality, cb) {
		QualityService.getQualityResults(quality.id).then(function(results) {
			quality.results = results;
			if(cb) cb();
        }, function(error) {
            growl.error('Error getting quality results');
        });
	};

	vm.setFailuresGrid = function(quality) {
		var results = quality.results || [];
		if(results.length>0) {
			vm.failuresGrid.options.columnDefs = _.map(results[0].row, function(value, column) {
	            return {
	                field: column,
	                width: 150
	            };
	        });
	        vm.failuresGrid.options.data = _.map(results, function(result) {
	        	return result.row;
	        });
		} else {
			vm.failuresGrid.options.columnDefs = [];
			vm.failuresGrid.options.data = [];
		}

		$timeout(function() {
			$scope.$apply();
		});
	};

	vm.init();
}]);