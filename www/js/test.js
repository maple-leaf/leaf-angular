leafDemo.controller('homeCtrl', function($scope, demo, model, leafActionSheet) {
    angular.extend($scope, model);
    $scope.radios = [
    	{
    		text: 'option 1',
    		value: 1
    	},
    	{
    		text: 'option 2',
    		value: 2
    	}
    ];
    $scope.radio = 1;
    $scope.checkboxes = [
        {
            text: 'option 1',
            value: 1
        },
        {
            text: 'option 2',
            value: 2
        }
    ];
    $scope.checkbox = ["1"];
});
