angular.module('dqApp.data').controller('UiGridOptionsCtrl', ['$modalInstance', 'columns', function ($modalInstance, columns) {
    var ctrl = this;

    ctrl.init = function() {
    	ctrl.columns = columns;
    	_.each(ctrl.columns, function(column) {
    		if(column.visible == undefined) {
    			column.visible = true;
    		}
    	})
    };

    ctrl.close = function () {
        $modalInstance.dismiss();
    };

    ctrl.save = function () {
        $modalInstance.close({
        	columns: ctrl.columns
        });
    };

    ctrl.init();
}]);
