angular.module('dqApp.data').controller('ImportCtrl', ImportCtrl);

ImportCtrl.$inject = ['Importer', '$state', 'growl', 'ENV'];

function ImportCtrl(Importer, $state, growl, ENV) {

    var vm = this;

    vm.init = function() {
        vm.isProcessing = false;

        vm.step = 1;
        vm.uploader = Importer.getUploader(vm.goToStep2AfterUpload);
        vm.database = {
            type: 'mysql',
            credentials: {
            }
        };

        vm.uploadTarget = '';

        vm.tables = [];
    };


    vm.uploadFiles = function() {
        if(vm.uploader.queue.length==0) {
            growl.error('You didn\'t select any file');
            return;
        }
        vm.isProcessing = true;

        _.each(vm.uploader.queue, function(item) {
            item.url = ENV.api_url + '/import/upload';
            item.alias = 'file';
            if(item.csvParams) {
                if(item.csvParams.enclosure) {
                    item.formData.push({'enclosure':item.csvParams.enclosure});
                }
                if(item.csvParams.delimiter) {
                    item.formData.push({'delimiter':item.csvParams.delimiter});
                }
                if(item.csvParams.escape) {
                    item.formData.push({'escape':item.csvParams.escape});
                }
            }
        });
        vm.uploadTarget = 'general';
        vm.uploader.uploadAll();
    };

    vm.importReferenceData = function() {
        if(vm.uploader.queue.length==0) {
            growl.error('You didn\'t select any file');
            return;
        }
        vm.isProcessing = true;

        _.each(vm.uploader.queue, function(item) {
            item.url = ENV.api_url + '/quality/reference/create';
            item.alias = 'reference';
            if(item.csvParams) {
                if(item.csvParams.enclosure) {
                    item.formData.push({'enclosure':item.csvParams.enclosure});
                }
                if(item.csvParams.delimiter) {
                    item.formData.push({'delimiter':item.csvParams.delimiter});
                }
                if(item.csvParams.escape) {
                    item.formData.push({'escape':item.csvParams.escape});
                }
            }
            item.formData.push({'name':item.file.name.split('.')[0]});
        });
        vm.uploadTarget = 'reference';
        vm.uploader.uploadAll();
    };

    vm.goToStep2AfterUpload = function(tables) {
        vm.isProcessing = false;
        vm.tables = tables;
        if(vm.uploadTarget=='general') {
            vm.step = 2;    
        } else if(vm.uploadTarget=='reference') {
            $state.go('data.console');
        }
    };


    vm.connectDB = function() {
        vm.isProcessing = true;
        Importer.connectDB(vm.database).then(function(result) {
            vm.isProcessing = false;
            vm.tables = result.data.data;
            vm.step = 2;
        }, function(error) {
            vm.isProcessing = false;
            growl.error('Error connecting');
        });
    };



    vm.importByQuery = function() {
        growl.error('Not Yet Implemented');
    };


    vm.importTables = function() {
        vm.isProcessing = true;
        Importer.importTables(vm.tables).then(function () {
            vm.isProcessing = false;
            $state.go('data.records');
        }, function(error) {
            vm.isProcessing = false;
            growl.error('Error occurs while importing tables');
        });
    };

    vm.init();

    vm.isCsv = function(type) {
        return vm.uploader.types.csv.indexOf(type) > -1;
    };
}