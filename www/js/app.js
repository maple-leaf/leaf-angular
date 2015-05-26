var ptwx = angular.module('ptwx', ['leaf']);

ptwx.controller('homeCtrl', function($scope, leafActionSheet, leafSlider) {
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
});
