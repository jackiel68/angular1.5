angular.module('dqApp.common')
    .config(['growlProvider', function(growlProvider) {
        growlProvider.globalTimeToLive(5000);
        growlProvider.globalDisableCountDown(true);
    }])
    .factory('Alert', ['growl', function (growl) {
        var service = {
            SUCCESS: 'success',
            INFO: 'info',
            WARNING: 'warning',
            DANGER: 'error',
            ERROR: 'error',
        };
        var alerts = [];

        service.add = function (type, msg) {
            switch (type){
                case 'success':
                    growl.success(msg);
                    break;
                case 'info':
                    growl.info(msg);
                    break;
                case 'warning':
                    growl.warning(msg);
                    break;
                case 'error':
                    growl.error(msg);
                    break;
            }
        }

        service.closeAlert = function (index) {
        }

        service.clear = function () {
            alerts = [];
        }

        service.get = function () {
            return alerts;
        }

        return service;
    }]);