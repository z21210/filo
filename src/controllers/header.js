module.exports = function($scope, $rootScope, $http) {
	$scope.login = {username: '', password: ''}
	$scope.register = {username: '', email: '', password: ''}
	$scope.registerUser = function () {
		console.log(`registering:\nusername: ${$scope.register.username}, email: ${$scope.register.email}, password: ${$scope.register.password}`)
		if ($scope.register.password != $scope.register.confirmPassword) {
			$scope.showConfirmPasswordWarning = true
			return
		}
		$http.put('https://127.0.0.1/register', JSON.stringify({username:$scope.register.username, email:$scope.register.email, password:$scope.register.password}))
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
		//$http.get('https://127.0.0.1/login', JSON.stringify({username:$scope.login.username, password:$scope.login.password}))
		$rootScope.auth = Buffer.from($scope.login.username+':'+$scope.login.password).toString('base64')
		$http({ 
			method: 'GET',
			url: '/test/auth',
			headers: {
				'Authorization': `Basic ${$rootScope.auth}`
			}
		 })
		.then(
			function (res) {
				console.log('response')
				console.log(res)
			},
			function (err) {
				console.log(err)
			})
	}
	$scope.logoutUser = function () {
		console.log(`logging out`)
		$http({ 
			method: 'GET',
			url: '/test/auth',
			headers: {
				'Authorization': 'Basic bG9nb3V0Og=='
			}
		 })
		.then(
			function (res) {
				console.log('response')
				console.log(res)
			},
			function (err) {
				console.log(err)
			})
	}
}