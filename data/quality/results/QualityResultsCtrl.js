angular.module('dqApp.data').controller('QualityResultsCtrl', QualityResultsCtrl)

QualityResultsCtrl.$inject = ['$scope', '$modal', '$http', '$q', '$sce', '$timeout', '_', 'growl', 'DataService', 'QualityService', 'UiGridService', 'uiGridConstants'];

function QualityResultsCtrl($scope, $modal, $http, $q, $sce, $timeout, _, growl, DataService, QualityService, UiGridService, uiGridConstants) {
    var vm = this;

    vm.results = [];
    vm.currentResult = null;
    vm.resultsSlideOpen = false;
    vm.grid = null;

    function init() {
        vm.getResults();

        vm.grid = {
            api: null,
            options: UiGridService.getDefaultOptions(function(api) {
                vm.grid.api = api;
            })
        };
        vm.grid.options.rowHeight = 40;
        vm.grid.options.useExternalPagination = false;
    }

    vm.getResults = function() {
        QualityService.getQualities().then(function(results) {
            vm.results = results;
            _.each(vm.results, function(result) {
                result.datasetSlug = result.dataset.data.slug;
                result.title = result.datasetSlug + '_Validation_';
                if(result.rules instanceof Array) {
                    result.rule = result.rules[0].rule;
                    result.columns = _.pluck(result.rules, 'column');
                    _.each(result.rules, function(rule) {
                        result.title += rule.column + '_';
                    });
                } else if(result.rules instanceof Object) {
                    result.rule = _.keys(result.rules)[0];
                    if(result.rule=='duplicate') {
                        result.columns = result.rules.duplicate;
                        _.each(result.rules.duplicate, function(column) {
                            result.title += column + '_';
                        });
                    }
                }
                result.validation = QualityService.getValidation(result.rule);
                result.title += result.validation.label;

                result.detailsLoaded = false;
                result.status = result.activity.data.status;
                if(result.status == 'error') {
                    result.error = result.activity.data.details;
                }
            });
        }, function(error) {
            growl.error('Error getting quality results.');
        });
    };

    vm.selectResult = function(index) {
        vm.currentResult = vm.results[index];
        if(vm.currentResult.status == 'complete') {
            if(vm.currentResult.detailsLoaded) {
                vm.setGrid();
            } else {
                vm.getResultDetails(index, vm.setGrid);
            }    
        }
    };

    vm.getResultDetails = function(index, cb) {
        vm.results[index].results = vm.results[index].results | [];
        QualityService.getQualityResults(vm.results[index].id).then(function(results) {
            vm.results[index].results = results;
            vm.results[index].detailsLoaded = true;
            vm.setResultPdf(index);
            vm.setResultCsv(index);
            if(cb) cb();
        }, function(error) {
            growl.error('Error getting quality result.');
            vm.results[index].status = 'error';
            vm.results[index].error = error.data.message;
        });
    };

    vm.setResultPdf = function(index) {
        var result = vm.results[index];
        
        result.pdf = {};

        var tbody;
        if(!result.results || result.results.length==0) {
            tbody = [];
            tbody.push(['No Validation Exceptions']);
        } else {
            var thead = _.map(result.results[0].row, function(value, column) {
                return column;
            });
            if(result.rule=='duplicate') {

            } else if(result.rule=='address') {

            } else {
                thead.unshift('Failures');    
            }
            tbody = _.map(result.results, function(record) {
                var row = _.values(record.row);

                _.each(row, function(value, field) {
                    if(value==null){
                        row[field] = '';
                    }
                });

                if(result.rule=='duplicate') {

                } else if(result.rule=='address') {

                } else {
                    var failures = '';
                    _.each(record.failures, function(fieldFailures, field) {
                        failures = failures + field + ' ';
                    });
                    row.unshift(failures);    
                }

                return row;
            });
            tbody.unshift(thead);
        }
        result.pdf = {
            pageSize: 'A1',
            pageOrientation: 'landscape',
            pageMargins: [ 40, 100, 40, 60 ],
            info: {
                title: result.title,
                author: 'DQC'
            },
            header: {
                text: result.title,
                alignment: 'center',
                margin: [ 0, 10, 0, 0 ],
                style: {
                    fontSize: 40,
                    bold: true
                }
            },
            content: [{
                table: {
                    headerRows: 1,
                    body: tbody
                }
            }]
        };
    };

    vm.exportPdf = function() {
        pdfMake.createPdf(vm.currentResult.pdf).download(vm.currentResult.title + '.pdf');
    };

    vm.setResultCsv = function(index) {
        var result = vm.results[index];

        if(!result.results || result.results.length==0) {
            result.csv = {
                header: [],
                content: []
            };
        } else {
            result.csv = {};
            result.csv.header = _.map(result.results[0].row, function(value, column) {
                return column;
            });
            if(result.rule=='duplicate') {

            } else if(result.rule=='address') {

            } else{
                result.csv.header.push('failures');    
            }

            result.csv.content = _.map(result.results, function(record) {
                var row = _.clone(record.row, true);

                if(result.rule=='duplicate') {

                } else if(result.rule=='address') {

                } else {
                    row.failures = '';
                    _.each(record.failures, function(fieldFailures, field) {
                        row.failures = row.failures + field + ' ';
                    });    
                }
                
                return row;
            });
        }
    };

    vm.setGrid = function() {
        if(!vm.currentResult.results || vm.currentResult.results.length==0) {
            vm.grid.options.columnDefs = [];
            vm.grid.options.data = [];
            return;
        }
        
        vm.grid.options.columnDefs = _.map(_.omit(_.clone(vm.currentResult.results[0].row, true), '_id'), function(value, column) {
            return {
                field: column,
                width: 150
            };
        });
        vm.grid.options.columnDefs.push({
            field: 'failure',
            width: 300,
            pinnedRight: true,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<span ng-repeat="failure in row.entity[col.field].failuresInCell track by $index" class="failure-incell">{{ failure }}</span>' +
                '<button type="button" class="btn btn-danger btn-xs" ng-click="row.entity[col.field].openFailureModal();">...</button>' +
                '</div>'
        });
        vm.grid.options.data = _.map(vm.currentResult.results, function(record) {
            var row = _.clone(record.row, true);
            row.failure = { 
                failures: record.failures,
                failuresInCell: [],
                openFailureModal: function() {
                    vm.openFailureModal(row, vm.currentResult);
                }
            };
            
            if(vm.currentResult.rule=='duplicate') {

            } else if(vm.currentResult.rule=='address') {

            } else {
                var failuresInCellCount = 2;
                var count = 0;
                _.each(record.failures, function(fieldFailures, field) {
                    if(count>=failuresInCellCount) {
                        return false;
                    }
                    row.failure.failuresInCell.push(field);
                    count++;
                });
            }
            return row;
        });
    };

    vm.openFailureModal = function(record, result) {
        var modalInstance = $modal.open({
            templateUrl: 'data/quality/results/failure-modal.html',
            controller: 'FailureCtrl as modal',
            backdrop: 'static',
            size: 'lg',
            resolve: {
                record: function () {
                    return record;
                },
                result: function() {
                    return result;
                }
            }
        });
    };

    vm.changeGridOptions = function() {
        UiGridService.changeOptionsInModal(vm.grid);
    };

    vm.fix = function() {
        var modalInstance = $modal.open({
            templateUrl: 'data/quality/results/fixdataset-modal.html',
            controller: 'FixDatasetCtrl as modal',
            backdrop: 'static',
            size: 'lg',
            resolve: {
                dataset: function() {
                    return vm.currentResult.dataset.data;
                }
            }
        });
    };

    init();
};