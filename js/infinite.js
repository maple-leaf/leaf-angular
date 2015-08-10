leafDemo.controller('infiniteCtrl', function($scope, $http) {
	$scope. datas = ["data","data","data","data","data","data","data","data","data","data","data","data","data","data","data","data","data","data","data","data"];
	$scope.loadMore = function(cb) {
		$http.get('data.json').success(function(data) {
			$scope.datas = $scope.datas.concat(data);
			cb(); // This must be called after everything done
		});
	};
});
