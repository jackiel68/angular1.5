angular.module('dqApp.data')
    .factory('ReferenceDataService', function ($http, ENV, $q, $cookies, $state) {
        var service = {};

        function getDatasetsByPage(page, datasets, cb) {
            var url = ENV.api_url + '/quality/reference?page='+page+'&includes=columns';
            $http.get(url).then(function(response) {
                datasets = _.union(datasets, response.data.data);
                if(page<response.data.meta.pagination.total_pages) {
                    getDatasetsByPage(page+1, datasets, cb);
                } else {
                    cb(datasets, null);
                }
            }, function(error) {
                cb(null, error);
            });
        };

        service.getDatasets = function(){
            var deferred = $q.defer();
            getDatasetsByPage(1, [], function(datasets, error) {
                if(error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(datasets);
                }
            });
            return deferred.promise;
        };

        function getDatasetByPage(page, records, cb) {
            var url = ENV.api_url + '/quality/reference?page='+page+'&includes=columns';
            $http.get(url).then(function(response) {
                records = _.union(records, response.data.data);
                if(page<response.data.meta.pagination.total_pages) {
                    getDatasetByPage(page+1, records, cb);
                } else {
                    cb(records, null);
                }
            }, function(error) {
                cb(null, error);
            });
        };

        service.getDataset = function(slug) {
            var deferred = $q.defer();
            getDatasetByPage(1, [], function(records, error) {
                if(error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(records);
                }
            });
            return deferred.promise;
        };

        service.clearDataset = function(slug) {

        };

        return service;
    });
