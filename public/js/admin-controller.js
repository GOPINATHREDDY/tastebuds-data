var dashboard = angular.module('dashboard', []);

dashboard.controller('AppController', ['$scope', '$http', function ($scope, $http) {
	console.log('controller placed in position');
	
	$scope.orders = [];
	$scope.food = {};
	
	var updateOrders = function () {
		$http.get('/orders').then(function (response) {
			$scope.orders = response.data;
		}, function (data) {
			console.log(data);
		});
		console.log('orders updated');
	}

	var fetchMenu = function () {
		$http.get('/foods').then(function (response) {
			$scope.menu = response.data;
			console.log(response.data);
		}, function (data) {
			console.log(data);
		});
	}

	$scope.createFood = function () {
		console.log($scope.food)
		$http.post('/foods', $scope.food).then(function (response) {
			console.log(response);
			fetchMenu();
			this.food = {};
		}, function (error) {
			console.log(error);
		});
	}

	$scope.toggleAvail = function (id) {
		$http.get('/foods/' + id).then(function (response) {
			let food = response.data;
			food.availability = !(food.availability);
			console.log(food);
			$http.put('/foods/' + id, food).then(function (response) {
				fetchMenu();
			});
		});
	}

	$scope.deleteFood = function (id) {
		$http.delete('/foods/' + id).then(function (response) {
			console.log(response);
			fetchMenu();
		}, function (error) {
			console.log(error);
		});
	}

	$scope.toggleStatus = function (id) {
		$http.get('/order/' + id).then(function (response) {
			let order = response.data[0];
			if (order.order_status === "pending") {
				order.order_status = "completed";
			} else {
				order.order_status = "pending";
			}
			$http.put('/order/' + id, order).then(function (response) {
				updateOrders();
			});
		}, function (reject) {
			console.log(reject);
		});
	}

	// update orders every 60 seconds
	updateOrders();
	fetchMenu();
	setInterval(updateOrders, 60 * 1000);
}]);