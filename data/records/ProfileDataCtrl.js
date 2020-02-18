angular.module('dqApp.data').controller('ProfileDataCtrl', ['$modalInstance', 'DataService', 'table', 'growl', function ($modalInstance, DataService, table, growl) {
    var modal = this;
    modal.table = table;

    modal.isLoading = false;
    modal.isError = false;

    modal.init = function() {
        modal.isLoading = true;
        DataService.getTableProfile(modal.table.slug).then(function(results) {
            var columns = results.data.data.columns.data;
            var series = [
                { name: 'Max', data: [] },
                { name: 'Min', data: [] },
                { name: 'NotNull', data: [] },
                { name: 'Null', data: [] }
            ];
            var columnNames = _.map(columns, function(column) {
                return column.name;
            });

            _.each(columns, function(column) {
                series[0].data.push(column.profile.data.max);
                series[1].data.push(column.profile.data.min);
                series[2].data.push(column.profile.data.notnull);
                series[3].data.push(column.profile.data.null);
            });

            modal.columns = columns;

            modal.chartConfig = {
                options: {
                    chart: {
                        type: 'bar'
                    }
                },
                title: {
                    text: ''
                },
                series: series,
                xAxis: {
                    categories: columnNames
                },
                yAxis: {
                    title: {
                        enabled: false
                    }
                },
                size: {
                    height: 30*columns.length
                },
            };

            modal.csvHeader = ['table_slug', 'table_status', 'name', 'type', 'default', 'autoincrement', 'nullable', 'primary', 'profile_max', 'profile_min', 'profile_notnull', 'profile_null'];
            modal.csv = [];
            _.each(columns, function(column) {
                modal.csv.push({
                    'table_slug': results.data.data.slug,
                    'table_status': results.data.data.status,
                    'name': column.name,
                    'type': column.type,
                    'default': column.default,
                    'autoincrement': column.autoincrement,
                    'nullable': column.nullable,
                    'primary': column.primary,
                    'profile_max': column.profile.data.max,
                    'profile_min': column.profile.data.min,
                    'profile_notnull': column.profile.data.notnull,
                    'profile_null': column.profile.data.null,
                });
            });

            modal.isLoading = false;
            modal.isError = false;
        }, function(error) {
            modal.isLoading = true;
            modal.isError = true;
            growl.error('Error loading profile data of table '+modal.table.slug);
        });
    };

    modal.init();

    modal.close = function () {
        $modalInstance.dismiss();
    }
}]);
