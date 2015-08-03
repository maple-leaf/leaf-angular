ptwx.controller('categoryCtrl', function($scope, pt, model) {
    $scope.categories = model.categories;
    $scope.showCate = function(index) {
        $scope.currentCate = $scope.categories[index];
        $scope.currentSub = $scope.currentCate.sub[0].sub;
        $scope.currentSubId = $scope.currentCate.sub[0].id;
    };
    $scope.changeSub = function(cate) {
        $scope.currentSub = cate.sub;
        $scope.currentSubId = cate.id;
    };
});
