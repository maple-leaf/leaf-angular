ptwx.controller("registerCtrl", function($scope, $timeout, $interval, pt, model) {
    angular.extend($scope, model);
    $scope.step2_1Visible = true;
    $scope.relativeCities = [];
    $scope.getConfirmCodeText = "发送验证码";
    $scope.getConfirmCodeDisabled = false;

    $scope.showStep = function(step) {
        if (step === "2") {
            if ($scope.personalVisible || $scope.corporationVisible) {
                $scope.step2Visible = true;
            }
        } else if (step === "2_2") {
            $scope.step2_1Visible = false;
            $scope.step2_2Visible = true;
        } else {
            $scope.step2_2Visible = false;
            $scope.step2_3Visible = true;
        }
        $scope.$refresh();
    };

    $scope.getConfirmCode = function() {
        if ($scope.getConfirmCodeDisabled) return;
        var sec = 60, promise;
        $scope.showGetCode = true;
        $scope.getConfirmCodeDisabled = true;
        $scope.getConfirmCodeText = sec + '秒后重发';
        promise = $interval(function() {
            sec--;
            $scope.getConfirmCodeText = sec + '秒后重发';
        }, 1000);
        $timeout(function() {
            $interval.cancel(promise);
            $scope.getConfirmCodeText = "发送验证码";
            $scope.getConfirmCodeDisabled = false;
        }, 61000);
    };

    $scope.provinceChanged = function(newValue) {
        $scope.relativeCities = model.cities[newValue];
    };
});
