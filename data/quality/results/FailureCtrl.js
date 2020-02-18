angular.module('dqApp.data').controller('FailureCtrl', ['$modalInstance', 'DataService', 'result', 'record', 'growl', function ($modalInstance, DataService, result, record, growl) {
    var modal = this;
    
    modal.init = function() {
        modal.result = result;
        modal.record = record;

        modal.columns = {};

        if(modal.result.rule=='duplicate') {
            if(modal.result.columns) {
                _.each(modal.result.columns, function(column) {
                    modal.columns[column] = modal.record[column];
                });
            } else {
                modal.columns = _.clone(modal.record, true);
                delete modal.columns._id;
                delete modal.columns.failure;
            }
        } else {
            _.each(modal.record.failure.failures, function(failures, column) {
                modal.columns[column] = modal.record[column];
            });
        }
    };

    modal.init();

    modal.fix = function() {
        modal.isFixing = true;
        DataService.updateRow(modal.result.datasetSlug, modal.row._id, modal.newrow).then(function(row) {
            growl.success('Fixed Successfully!');
            modal.isFixing = false;
        }, function(error) {
            growl.error('Fix Error');
            modal.isFixing = false;
        });
    };

    modal.close = function () {
        $modalInstance.dismiss();
    }
}]);
