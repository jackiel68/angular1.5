angular.module('dqApp.data')
    .factory('QualityService', QualityService);
QualityService.$inject = ['$cookies', 'ENV', '$http', '$modal', '$q', '$interval', 'Preference'];

function QualityService($cookies, ENV, $http, $modal, $q, $interval, Preference) {

    var validationsAll = [
        {
            label: 'Value', description: 'Value Validation',
            validations: [
                { rule:'alpha', api:'', type:'value', label:'Alpha', description:'Alpha' },
                { rule:'numeric', api:'', type:'value', label:'Numeric', description:'Numeric' },
                { rule:'null', api:'', type:'value', label:'Null', description:'Null' },
                { rule:'space', api:'', type:'value', label:'Space', description:'Space' },
                { rule:'special', api:'', type:'value', label:'Special Character', description:'Special Character' },
                { rule:'email', api:'', type:'value', label:'Email', description:'Email' },
                { rule:'lt', api:'', type:'option', subtype:'number', label:'Less Than', description:'Less Than' },
                { rule:'gt', api:'', type:'option', subtype:'number', label:'Greater Than', description:'Greater Than' },
                { rule:'eq', api:'', type:'option', subtype:'string', label:'Equal', description:'Equal' },
                { rule:'neq', api:'', type:'option', subtype:'string', label:'Not Equal', description:'Not Equal' },
                { rule:'length', api:'', type:'length', label:'Length', description:'Length' },
                { rule:'format', api:'', type:'option', subtype:'format', label:'Format', description:'Format' },
                { rule:'in', api:'', type:'options', othertype:'value', label:'In', description:'In' },
                { rule:'nin', api:'', type:'options', othertype:'value', label:'Not In', description:'Not In' }
            ]
        },
        {
            label: 'Reference', description: 'Reference Validation',
            validations: [
                { rule:'in', api:'', type:'referenceoption', othertype:'reference', label:'In', description:'In' },
                { rule:'nin', api:'', type:'referenceoption', othertype:'reference', label:'Not In', description:'Not In' }
            ]
        },
        { rule:'address', api:'/address', type:'address', label:'Address', description:'Address Validation' },
        { rule:'duplicate', api:'/duplicate', type:'duplicate', label:'Duplicate', description:'Duplicate Validation' },
    ];

    var service = {};

    service.getAllValidations = function() {
        return validationsAll;
    };

    service.getValidation = function(rule, othertype) {
        validation = _.find(validationsAll, { rule:rule });
        if(validation) {
            return validation;
        }
        if(othertype) {
            return _.find(_.flatten(_.pluck(validationsAll, 'validations')), { rule:rule, othertype: othertype });    
        } else {
            return _.find(_.flatten(_.pluck(validationsAll, 'validations')), { rule:rule });
        }
    };

    service.performCheck = function(api, request) {
        var url = ENV.api_url + '/quality/create';
        return $http.post(
            url + api,
            request
        );
    };

    service.repeatCheck = function(id) {
        var url = ENV.api_url + '/quality/' + id + '/repeat';
        return $http.post(url);
    };

    function getQualitiesByPage(page, qualities, cb) {
        var url = ENV.api_url + '/quality?includes=dataset' + '&page=' + page;
        $http.get(url).then(function(response) {
            qualities = _.union(qualities, response.data.data);
            if(page<response.data.meta.pagination.total_pages) {
                getQualitiesByPage(page+1, qualities, cb);
            } else {
                cb(qualities, null);
            }
        }, function(error) {
            cb(null, error);
        });
    };

    service.getQualities = function() {
        var deferred = $q.defer();
        getQualitiesByPage(1, [], function(qualities, error) {
            if(error) {
                deferred.reject(error);
            } else {
                deferred.resolve(qualities);
            }
        });
        return deferred.promise;
    };

    function getQualityResultsByPage(id, page, results, cb) {
        var url = ENV.api_url + '/quality/' + id + '/results' + '?page=' + page;
        $http.get(url).then(function(response) {
            results = _.union(results, response.data.data);
            if(page<response.data.meta.pagination.total_pages) {
                getQualityResultsByPage(id, page+1, results, cb);
            } else {
                cb(results, null);
            }
        }, function(error) {
            cb(null, error);
        });
    };

    service.getQualityResults = function(id) {
        var deferred = $q.defer();
        getQualityResultsByPage(id, 1, [], function(results, error) {
            if(error) {
                deferred.reject(error);
            } else {
                deferred.resolve(results);
            }
        });
        return deferred.promise;
    };

    service.fixDataset = function(dataset, fixes) {
        var url = ENV.api_url + '/fix/create';
        return $http.post(url, {
            dataset: dataset,
            fixes: fixes
        });
    };

    return service;
}