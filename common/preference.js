angular.module('dqApp.common')
    .config(configLocalStorage)
    .factory('Preference',Preference);

function configLocalStorage(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('DQC');
}

function Preference(localStorageService) {

    var service = {};

    service.setPreference = setPreference;
    service.getPreference = getPreference;
    service.deletePreference = deletePreference;
    service.resetPreferences = resetPreferences;

    return service;

    function setPreference(key, value) {
        return localStorageService.set(key, value);
    }

    function deletePreference(key) {
        return localStorageService.remove(key);
    }

    function getPreference(key, _default) {
        var value  = localStorageService.get(key);
        return value || _default;
    }

    function resetPreferences() {
        return localStorageService.clearAll();
    }
}