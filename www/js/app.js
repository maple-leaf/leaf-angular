var ptwx = angular.module('ptwx', ['leaf']);

ptwx.controller('homeCtrl', function($scope, leafActionSheet, leafSlider, leafScroll, leafPageload, $http) {
    leafPageload.start();
    leafPageload.done();
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
    $scope.showActions = function() {
        leafActionSheet.init();
    };

    leafSlider.getSliders().then(function(slider) {
        $scope.slider = slider;
    });

    $scope.testChange = function(o, n) {
        console.log(o);
        console.log(n);
    };

    $http.get('http://localhost:7878/test').success(function(data) {
        $scope.test = data;
        $scope.$refresh();
    })
    .error(function(data) {
        console.error(data);
    });
    $scope.load = function(cb) {
        $http.get('http://localhost:7878/test').success(function(data) {
            $scope.test = $scope.test.concat(data);
            cb();
        })
        .error(function(data) {
            console.error(data);
        });
    };
    $scope.$onLeafTabSwitched = function() {
        console.log($scope.$currentTab);
        if ($scope.$currentTab === "#infiniteTab") {
            $scope.$leafContent.pullLoad.enable();
        } else {
            $scope.$leafContent.pullLoad.disable();
        }
    };
});
