leafDemo.controller('tabsCtrl', function($scope) {
  $scope.onTabSwitched = function() {
    $scope.currentTab = $scope.$currentTab;
  };
});
