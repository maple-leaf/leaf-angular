leafDemo.controller('formCtrl', function($scope) {
  $scope.colors = [
    {
      text: "红/red",
      value: "red"
    },
    {
      text: "蓝/blue",
      value: "blue"
    },
    {
      text: "黄/yellow",
      value: "yellow"
    }
  ];
  $scope.color = ["red"];
  $scope.countries = [
    {
      text: "中国/china",
      value: "china"
    },
    {
      text: "其他/others",
      value: "others"
    }
  ];
  // $scope.country = "china";
  $scope.sexOptions = [
    {
      text: "男/boy",
      value: "boy"
    },
    {
      text: "女/girl",
      value: "girl"
    }
  ];
  $scope.hobbies = [
    {
      text: "篮球/basketball",
      value: "basketball"
    },
    {
      text: "足球/footerball",
      value: "footerball"
    },
    {
      text: "排球/volleyball",
      value: "volleyball"
    }
  ];
});
