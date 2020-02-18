angular.module('dqApp.data').factory('Importer', Importer);

Importer.$inject = ['_', '$cookies', 'ENV', 'FileUploader', 'growl', '$http', '$q'];

function Importer(_, $cookies, ENV, FileUploader, growl, $http, $q) {
    var service = {};

    service.getUploader = function(cbAfterUpload) {
        var uploader = new FileUploader({
            headers: {
                'Authorization': 'Bearer ' + $cookies.get('token')
            }
        });

        var types = {
            csv: ['text/csv', 'application/csv', 'text/x-csv', 'application/x-csv', 'text/x-comma-separated-values', 'text/comma-separated-values'],
            excel: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
        };
        uploader.types = types;

        uploader.tables = [];
        uploader.cbAfterUpload = cbAfterUpload;

        uploader.filters.push({
            name: 'dataFilter',
            fn: function (item, options) {
                return types.csv.indexOf(item.type) > -1 || types.excel.indexOf(item.type) > -1;
            }
        });

        uploader.onWhenAddingFileFailed = function (item, filter, options) {
            growl.error('You are trying to upload files of not supported mime type.');
        };

        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            this.tables.push(response.data[0]);
        };

        uploader.onErrorItem = function(fileItem, response, status, headers) {
            growl.error(fileItem.file.name + ' uploading error: ' + response.error);
        };

        uploader.onCompleteAll = function() {
            this.cbAfterUpload(this.tables);
        };

        return uploader;
    };

    service.connectDB = function(details) {
        return $http.post(ENV.api_url + '/import/connect', details)
    };


    service.importTables = function(tables) {
        var mappings = getTableMappings(tables);
        return $http.post(ENV.api_url + '/import/create', {
            mappings: mappings
        });
    };

    service.importTablesIntoReference = function(tables) {
        var mappings = getTableMappings(tables);
        return $http.post(ENV.api_url + '/quality/reference/create', {
            mappings: mappings
        });
    };
    

    return service;


    function getTableMappings(tables) {
        var mapped = [];
        for (index in tables) {
            var table = {};
            if (tables[index].import || tables[index].partial) {
                table.table = tables[index].name;
                table.columns = []
                for (col in tables[index].columns) {
                    if (tables[index].columns[col].import) {
                        table.columns.push(tables[index].columns[col].name);
                    }
                }
                mapped.push(table);
            }
        }
        return mapped;
    }
}