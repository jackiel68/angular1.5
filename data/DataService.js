angular.module('dqApp.data')
    .factory('DataService', function ($http, ENV, $q, $cookies, $state) {
        var service = {};

        service.records = [];

        function getDatasetsByPage(page, datasets, cb) {
            var url = ENV.api_url + '/dataset?page='+page+'&includes=columns';
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
        }

        service.getTable = function(slug, page){
            var url = ENV.api_url + '/dataset/'+slug+'?includes=rows,columns&page='+page;
            return $http.get(url);
        }

        service.getTableColumns = function(slug, page) {
            var url = ENV.api_url + '/dataset/'+slug+'?includes=columns' + (page ? '&page='+page : '');
            return $http.get(url);
        }

        service.getTableProfile = function(slug) {
            var url = ENV.api_url + '/dataset/'+slug+'?includes=columns.profile';
            return $http.get(url);
        }

        service.clearData = function(slug) {
            var url = ENV.api_url + '/dataset/' + slug;
            return $http.delete(url);
        }

        service.updateRow = function(slug, rowId, row) {
            var url = ENV.api_url + '/dataset/' + slug + '/' + rowId;
            return $http.post(url, { "update": row });
        };

        return service;
    });
