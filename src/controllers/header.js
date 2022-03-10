app.controller("HeaderController", function($scope, $http) {
	$scope.registerUser = function () {
		console.log(`registering:\nusername: ${$scope.register.username}, password: ${$scope.register.password}`)
		if ($scope.register.password != $scope.register.confirmPassword) {
			$scope.showConfirmPasswordWarning = true
			return
		}
		$http.put('https://127.0.0.1/register', JSON.stringify({username:$scope.username,password:$scope.password}))
		.then(
			function (res) {
				console.log('response')
				console.log(res)
			},
			function (err) {
				console.log(err)
			})
	}
	$scope.loginUser = function () {
		console.log(`logging in:\nusername: ${$scope.login.username}, password: ${$scope.login.password}`)
		
	}
});