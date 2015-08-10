leafDemo.controller('actionSheetCtrl', function($scope, leafActionSheet) {
  $scope.defaultActionSheet = function() {
    leafActionSheet.init();
  };
  $scope.customizedActionSheet = function() {
    leafActionSheet.init({
      className: "leaf-action-sheet demo-action-sheet",
      btns: [
        {
          name: "ok",
          text: "Ok",
          className: "leaf-btn btn-success",
          onTap: function() {
            alert('Yeah~~~!!!');
            this.close();
          }
        },
        {
          name: "remove",
          text: "Remove",
          className: "leaf-btn btn-danger",
          onTap: function() {
            alert('Wow~~~!!!');
            this.close();
          }
        },
        {
          name: "nothing",
          className: "leaf-btn",
          text: "nothing happen",
        }
      ]
    });
  };
});
