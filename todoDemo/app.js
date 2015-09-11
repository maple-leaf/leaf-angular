var todoDemo = angular.module('todoDemo', ['leaf']);

todoDemo.controller('todoCtrl', function($scope, leafScroll) {
	$scope.todos = JSON.parse(localStorage.getItem('todos')) || [];
	$scope.editingTodo = {};

	$scope.saveTodo = function() {
		console.log($scope.editingTodo);
		$scope.todos.push(angular.copy($scope.editingTodo));
		localStorage.setItem('todos', JSON.stringify($scope.todos));
		$scope.editingTodo = {};
	};

	window.ls = leafScroll;
	console.log('controller');
	// leafScroll.get('scrolls0').on('scrollEnd', function() {
	// 	console.log(this);
	// })
});