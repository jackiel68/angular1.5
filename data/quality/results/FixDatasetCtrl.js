angular.module('dqApp.data').controller('FixDatasetCtrl', ['$modalInstance', 'DataService', 'QualityService', 'dataset', 'growl', function ($modalInstance, DataService, QualityService, dataset, growl) {
    var modal = this;
    
    modal.init = function() {
        modal.dataset = dataset;
        modal.columns = [];
        modal.rules = ['ltrim', 'rtrim', 'substr', 'lpad', 'rpad', 'replace', 'address'];
        modal.fixes = [];
        DataService.getTableColumns(modal.dataset.slug).then(function(result) {
            modal.columns = result.data.data.columns.data;
        }, function(error) {
            growl.error('Error getting dataset columns')
        });
    };

    modal.init();

    modal.addFix = function() {
        modal.fixes.push({});
    };

    modal.removeFix = function(index) {
        modal.fixes.splice(index, 1);
    };

    modal.fix = function() {
        modal.isFixing = true;
        QualityService.fixDataset(modal.dataset.slug, modal.fixes).then(function(result) {
            growl.success('Fixed Successfully.');
            modal.isFixing = false;
            $modalInstance.close()
        }, function(error) {
            growl.error('Error fixing.');
            modal.isFixing = false;
            $modalInstance.close()
        });
    };

    modal.close = function () {
        $modalInstance.dismiss();
    };
}]);
