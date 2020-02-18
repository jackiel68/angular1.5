angular.module('dqApp', [
    'ui.router',
    'ngCookies',
    'ngSanitize',
    'LocalStorageModule',
    'ui.bootstrap',
    'angularFileUpload',
    'ivh.treeview',
    'ui.grid',
    'ui.grid.exporter',
    'ui.grid.expandable',
    'ui.grid.selection',
    'ui.grid.pinning',
    'ui.grid.edit',
    'ui.grid.resizeColumns',
    'ui.grid.moveColumns',
    'ui.grid.pagination',
    'ui.grid.autoResize',
    'ui.grid.pinning',
    'frapontillo.bootstrap-switch',
    'angular-growl',
    'angular-loading-bar',
    'ui.select',
    'LocalStorageModule',
    'xeditable',
    'pageslide-directive',
    'angular-confirm',
    'highcharts-ng',
    'ngCsv',
    'ngTagsInput',
    'dqApp.common',
    'dqApp.user',
    'dqApp.data',
    'dqApp.reports'
])
    .constant('ENV', {
        name: 'DQC',
        api_url: ''
    })
    .config(['$stateProvider', '$urlRouterProvider', '$sceDelegateProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $sceDelegateProvider, $httpProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self'
        ]);

        $stateProvider.
            state('login', {
                url: '/login',
                templateUrl: 'user/login.html',
                controller: 'userController'
            }).
            state('signup', {
                url: '/signup',
                templateUrl: 'user/signup.html',
                controller: 'userController'
            }).
            state('forgotpass', {
                url: '/forgotpass',
                templateUrl: 'user/forgotpass.html',
                controller: 'userController'
            }).
            state('resetpass', {
                url: '/resetpass/{hash}',
                templateUrl: 'user/resetpass.html',
                controller: 'userController'
            }).
            state('profile', {
                url: '/profile',
                templateUrl: 'user/profile.html',
                controller: 'profileController'
            }).
            state('newuser', {
                url: '/newuser',
                templateUrl: 'user/newuser.html',
                controller: 'newUserController',
                controllerAs: 'vm'
            }).
            state('getinvite', {
                url: '/getinvite/:code',
                templateUrl: 'user/getinvite.html',
                controller: 'getInviteController',
                controllerAs: 'vm'
            }).
            state('data', {
                abstract: true,
                template: '<ui-view/>'
            }).
            state('data.console', {
                url: '/console',
                templateUrl: '/data/console/index.html',
                controller: 'ConsoleCtrl',
                controllerAs: 'console'
            }).
            state('data.import', {
                url: '/import',
                templateUrl: '/data/import/index.html',
                controller: 'ImportCtrl',
                controllerAs: 'import'
            }).
            state('data.records', {
                url: '/data/records',
                templateUrl: '/data/records/index.html',
                controller: 'DataRecordsCtrl',
                controllerAs: 'vm'
            }).
            state('data.references', {
                url: '/data/references',
                templateUrl: '/data/references/index.html',
                controller: 'ReferenceDataCtrl',
                controllerAs: 'vm'
            }).
            state('data.quality', {
                template: '<ui-view/>'
            }).
            state('data.quality.checks', {
                url: '/data/quality/checks',
                templateUrl: '/data/quality/checks/index.html',
                controller: 'QualityChecksCtrl',
                controllerAs: 'quality'
            }).
            state('data.quality.results', {
                url: '/data/quality/results',
                templateUrl: '/data/quality/results/index.html',
                controller: 'QualityResultsCtrl',
                controllerAs: 'quality'
            }).
            state('reports', {
                url: '/reports',
                templateUrl: 'reports/index.html',
                controller: 'reportsController',
                controllerAs: 'reports'
            });

        $urlRouterProvider.otherwise('/login');

        $httpProvider.interceptors.push(function ($cookies, ENV, $injector, $q, growl) {
            return {
                'responseError': function (rejection) {
                    console.log('response error=', rejection);
                    if (rejection.status == 401) {
                        growl.error('Token is expired. You need to log in again.');

                        $state = $injector.get('$state');
                        $cookies.remove('token');
                        $cookies.put('isLoggedIn', false);
                        $cookies.remove('username');
                        $cookies.remove('userid');
                        $cookies.remove('isUserAdmin');
                        $cookies.remove('isDataAdmin');

                        $rootScope = $injector.get('$rootScope');
                        $rootScope.isLoggedIn = false;
                        $rootScope.curuser = {};

                        $state.go('login');
                    }
                    return $q.reject(rejection);
                }
            }
        });
    }])
    .run(['$rootScope', '$location', '$cookies','$http', '$state', function ($rootScope, $location, $cookies, $http, $state) {

        var unauthorizedStates = ['login', 'forgotpass', 'signup', 'resetpass', 'getinvite'];

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            var requireAuthorized = _.find(unauthorizedStates, function(state) {
                return state == toState.name;
            })==undefined;
            
            if (($cookies.get('token') == undefined || $cookies.get('token') == null) && requireAuthorized) {
                $cookies.put('isLoggedIn', false);
                $cookies.remove('username');
                $cookies.remove('userid');
                $cookies.remove('token');
                $cookies.remove('isUserAdmin');
                $cookies.remove('isDataAdmin');

                $rootScope.isLoggedIn = false;
                $rootScope.curuser = {};

                delete $http.defaults.headers.common.Authorization;

                event.preventDefault();
                $state.go('login');
            }

            if(!$rootScope.curuser.isUserAdmin && toState.name=="newuser") {
                event.preventDefault();
                $state.go('data.console');
            }

            $rootScope.showNavbar = requireAuthorized;
        });

        $rootScope.$on('$routeChangeSuccess', function () {
            ga('set', 'page', $location.path());
            ga('send', 'pageview');
        });

        if($cookies.get('token')) {
            $http.defaults.headers.common.Authorization = "Bearer " + $cookies.get('token');
        }

        $.support.cors = true;

        $rootScope.base = '/';
        $rootScope.curdate = new Date();
        $rootScope.isLoggedIn = $cookies.get('isLoggedIn') == 'true';
        $rootScope.curuser = {};
        if($cookies.get('username')) {
            $rootScope.curuser = {
                name: $cookies.get('username'),
                id: $cookies.get('userid'),
                isUserAdmin: $cookies.get('isUserAdmin') == 'true',
                isDataAdmin: $cookies.get('isDataAdmin') == 'true'
            };
        }

        if ($cookies.get('dataPresence') && ($cookies.get('dataPresence') > 0)) {
            $rootScope.dataPresence = true;
        }
    }])
    .controller('AppCtrl', ['$rootScope', function ($rootScope) {
        var ctrl = this;
    }]);