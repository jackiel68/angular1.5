angular.module('dqApp.data').controller('QualityChecksCtrl', QualityChecksCtrl);

QualityChecksCtrl.$inject = ['_', '$scope', '$state', '$http', 'growl', 'DataService', 'ReferenceDataService', 'QualityService'];

function QualityChecksCtrl(_, $scope, $state, $http, growl, DataService, ReferenceDataService, QualityService) {
    
    var vm = this;

    vm.validationsAll = [];
    vm.datasets = [];
    vm.references = [];
    vm.validations = [];
    vm.qualities = [];
    
    vm.validationGroupSelected = null;
    vm.validationSelected = null;
    vm.datasetSelected = null;

    init();

    function init() {
        getAllValidations();
        getDatasets();
        getReferences();
        getQualities();
    }

    function getAllValidations() {
        vm.validationsAll = QualityService.getAllValidations();
    }

    function getDatasets() {
        DataService.getDatasets().then(function(results) {
            vm.datasets = results;
        }, function(error) {
            growl.error('Error getting datasets');
        });
    };

    function getReferences() {
        ReferenceDataService.getDatasets().then(function(results) {
            vm.references = results;
        }, function(error) {
            growl.error('Error getting datasets');
        });
    };

    function getQualities() {
        QualityService.getQualities().then(function(results) {
            vm.qualities = results;
            _.each(vm.qualities, function(quality) {
                quality.datasetSlug = quality.dataset.data.slug;
                if(quality.rules instanceof Array) {
                    quality.rule = quality.rules[0].rule;
                } else if(quality.rules instanceof Object) {
                    quality.rule = _.keys(quality.rules)[0];
                }
                if(quality.rule=='in' || quality.rule.rule=='nin') {
                    if(quality.rules[0].reference) {
                        quality.validation = QualityService.getValidation(quality.rule, 'reference');
                    } else {
                        quality.validation = QualityService.getValidation(quality.rule, 'value');
                    }
                } else {
                    quality.validation = QualityService.getValidation(quality.rule);
                }
            });
        }, function(error) {
            growl.error('Error getting quality results');
        });
    };

    vm.addValidation = function() {
        var validation = {};

        if(vm.datasetSelected) {
            validation.datasetSlug = vm.datasetSelected.slug;
            validation.dataset = _.clone(vm.datasetSelected, true);
        } else {
            growl.error('Please select dataset');
            return;
        }

        if(vm.validationSelected) {
            validation = _.extend(validation, vm.validationSelected);
        } else {
            if(vm.validationGroupSelected && (!vm.validationGroupSelected.validations || vm.validationGroupSelected.validations.length==0)) {
                validation = _.extend(validation, vm.validationGroupSelected);
            } else {
                growl.error('Please select validation');
                return;
            }
        }

        // if(_.find(vm.qualities, {
        //     rule: validation.rule,
        //     datasetSlug: validation.datasetSlug
        // })) {
        //     growl.error(validation.rule+' validation was already performed on '+validation.datasetSlug);
        //     return;
        // }

        if(_.find(vm.validations, {
            rule: validation.rule,
            datasetSlug: validation.datasetSlug
        })) {
            growl.error('It was already added');
            return;
        }

        vm.validations.unshift(validation);
    };

    vm.removeValidation = function(index) {
        vm.validations.splice(index, 1);
    };
    
    vm.isValidating = false;
    vm.validatedCount = 0;
    vm.runValidations = function() {
        if(vm.validations.length==0) {
            $state.go('data.quality.results');
        }

        _.each(vm.validations, function(validation) {
            validation.request = {
                dataset: validation.datasetSlug    
            };
            if(validation.type=='value') {
                validation.request.checks = _.map(validation.columns, function(column) {
                    return { "column":column, "rule":validation.rule };
                });
            } else if(validation.type=='option') {
                validation.request.checks = _.map(validation.columns, function(column) {
                    return { "column":column.column, "rule":validation.rule, "options":column.option };
                });
            } else if(validation.type=='options') {
                validation.request.checks = _.map(validation.columns, function(column) {
                    return { "column":column.column, "rule":validation.rule, "options":_.pluck(column.options, 'text')};
                });
            } else if(validation.type=='length') {
                validation.request.checks = _.map(validation.columns, function(column) {
                    return { "column":column.column, "rule":validation.rule, "options": [column.option, (column.operator=='lt')]};
                });
            } else if(validation.type=='referenceoption') {
                validation.request.checks = _.map(validation.columns, function(column) {
                    return { "column":column.column, "rule":validation.rule, "reference":{ "name":column.reference_slug.slug, "column":column.reference_column } }
                });
            } else if(validation.type=='address') {
                validation.request.columns = validation.columns;
            } else if(validation.type=='duplicate') {
                if(validation.columns && validation.columns.length>0) {
                    validation.request.columns = validation.columns;
                }
            }

            QualityService.performCheck(validation.api, validation.request).then(function(result) {
                vm.validatedCount ++;
                if(vm.validatedCount == vm.validations.length) {
                    vm.isValidating = false;
                    $state.go('data.quality.results');
                }
            }, function(error) {
                vm.validatedCount ++;
                if(vm.validatedCount == vm.validations.length) {
                    vm.validatedCount = false;
                    $state.go('data.quality.results');
                }
            });
        });
    };

    vm.repeatCheck = function(check) {
        check.isRepeating = true;
        QualityService.repeatCheck(check.id).then(function(result) {
            check.isRepeating = false;
            $state.go('data.quality.results');
        }, function(error) {
            check.isRepeating = false;
            growl.info('Error occurs');
        });
    };
};