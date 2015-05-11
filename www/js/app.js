var ptwx = angular.module('ptwx', ['leaf', 'ngRoute']);

ptwx.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/form', {
        templateUrl: 'form-demo.html',
        controller: 'formDemoCtrl',
    })
    .when('/', {
        templateUrl: 'home.html',
        controller: 'homeCtrl'
    });
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('!');
});

ptwx.controller('homeCtrl', function($scope) {
});

ptwx.controller('formDemoCtrl', function($scope) {
    $scope.sampleOptions = [
        {
            text: "option A",
            value: 1
        },
        {
            text: "option B",
            value: 2
        }
    ];
    $scope.cities = [
        {
            text: "厦门",
            value: "xm"
        },
        {
            text: "杭州",
            value: "hz"
        }
    ];
    $scope.langs = [
        {
            text: "汉语",
            value: "zh"
        },
        {
            text: "英语",
            value: "en"
        },
        {
            text: "法语",
            value: "fr"
        }
    ];
});
ptwx.controller('homeCtrl', function($scope) {
});
