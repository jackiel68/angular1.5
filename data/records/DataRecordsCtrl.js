angular.module('dqApp.data').controller('DataRecordsCtrl', ['$scope', '$filter', '$modal', '$state', '$timeout', 'growl', 'DataService', 'UiGridService', 'uiGridConstants',
    function ($scope, $filter, $modal, $state, $timeout, growl, DataService, UiGridService, uiGridConstants) {

        var vm = this;

        vm.init = function() {
            vm.tablesSlideOpen = false;
            vm.tables = [];
            vm.tablesSorted = {};
            vm.tableSelected = null;

            vm.tableGrid = {
                api: null,
                options: UiGridService.getDefaultOptions(function(api) {
                    vm.tableGrid.api = api;
                    vm.tableGrid.api.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        fillGrid(vm.tableSelected.slug, newPage, pageSize);
                    });
                })
            };

            vm.getTables();
        };

        vm.getTables = function() {
            vm.loading = true;
            DataService.getDatasets().then(function(results) {
                vm.tables = results;
                vm.loading = false;
                
                if(vm.tables.length > 0){
                    _.each(vm.tables, function(table) {
                        vm.tablesSorted[table.source] = vm.tablesSorted[table.source] || {
                            source: table.source,
                            expanded: true,
                            tables: []
                        };
                        vm.tablesSorted[table.source].tables.push(table);
                    });
                }
            }, function(error) {
                growl.error('Error getting tables list');
            });
        };

        vm.selectTable = function(table) {
            vm.tableSelected = table;
            fillGrid(vm.tableSelected.slug, 1, vm.tableGrid.options.paginationPageSize);
        };

        function fillGrid(slug, pageNumber, pageSize) {
            vm.tableGrid.options.data = [];
            vm.tableGrid.options.columnDefs = [];

            var pageSizeOnServer = 100;
            var pageSizeTimes = pageSizeOnServer/pageSize;
            var pageNumberOnServer = parseInt((pageNumber-1)/pageSizeTimes)+1;

            vm.loading = true;
            DataService.getTable(slug, pageNumberOnServer).then(function(results) {
                vm.tableGrid.options.data = _.map(results.data.data.rows.data.slice((pageNumber-1)%pageSizeTimes*pageSize,(pageNumber-1)%pageSizeTimes*pageSize+pageSize), function(row) {
                    return _.omit(row, '_id');
                });
                vm.tableGrid.options.totalItems = results.data.data.rows.meta.pagination.total;
                vm.loading = false;
                $timeout(function() {
                    _.each(vm.tableGrid.options.columnDefs, function(column) {
                        column.width = 150;
                    });
                    vm.tableGrid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                }, 0);
            }, function(error) {
                growl.error('Error loading table ' + vm.tableSelected.slug);
                vm.loading = false;
                vm.tableGrid.options.columnDefs = [];
                vm.tableGrid.options.data = [];
            });
        }

        vm.openProfileData = function() {
            if(vm.tableSelected==null) {
                growl.error('Table is not selected');
                return;
            }
            var modalInstance = $modal.open({
                templateUrl: 'data/records/profile-modal.html',
                controller: 'ProfileDataCtrl as modal',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    table: function () {
                        return vm.tableSelected;
                    }
                }
            });
        };

        vm.clearData = function() {
            if(vm.tableSelected==null) {
                growl.error('Table is not selected');
                return;
            }
            DataService.clearData(vm.tableSelected.slug).then(function(result) {
                var index = _.findIndex(vm.tablesSorted[vm.tableSelected.source].tables, {slug:vm.tableSelected.slug});
                vm.tablesSorted[vm.tableSelected.source].tables.splice(index,1);

                index = _.findIndex(vm.tables, {slug:vm.tableSelected.slug});
                if(vm.tables.length==1) {
                    vm.tableSelected = null;
                } else if(index==vm.tables.length-1) {
                    vm.selectTable(vm.tables[0]);
                } else {
                    vm.selectTable(vm.tables[index+1]);
                }
                vm.tables.splice(index,1);
            }, function(error) {
                growl.error('Clearing Error');
            });
        };

        vm.changeTableOptions = function() {
            UiGridService.changeOptionsInModal(vm.tableGrid);
        };

        vm.init();

    }]);