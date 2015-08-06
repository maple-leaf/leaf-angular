leafDemo.controller('popupCtrl', function($scope, leafPopup) {
  $scope.defaultPopup = function() {
    leafPopup.init({
      title: "!~leaf popup demo~!"
    });
  };
  $scope.customizedPopup = function() {
    leafPopup.init({
      title: "!~leaf popup demo~!",
      className: "demo-popup",
      btns: [
        {
          name: "cancel",
          text: "Cancel",
          onTap: function() {
            alert('You click the cancel button');
            this.close();
          }
        },
        {
          name: "ok",
          text: "Ok",
          onTap: function() {
            alert('You click the ok button');
            this.close();
          }
        }
      ]
    });
  };
});
