module.exports = function($scope, $rootScope, $http, $state, $stateParams) {
	if ($rootScope.getUserPrivilege() >= 1) {
		$state.go('logout')
	}
	$scope.user = {
		username:'', 
		password: ''
	}
	$scope.loginError = null
	$scope.login = function () {
		const auth = Buffer.from($scope.user.username+':'+$scope.user.password).toString('base64')
		$http({ 
			method: 'PUT',
			url: '/api/login',
			headers: {
				'Authorization': `Basic ${auth}`
			},
			data: $scope.user.username
		 })
		.then(
			function (res) {
				if (res.status == 200) {
					$scope.loginError = null
					$rootScope.user = { 
						username: $scope.user.username, 
						isAdmin: res.data, 
						auth: Buffer.from($scope.user.username+':'+$scope.user.password).toString('base64')
					}
					$state.go($stateParams.accessing, JSON.parse($stateParams.params))
				} else {
					$scope.loginError = res.data
				}
			},
			function (err) {
				$scope.loginError = err.data
			}
		)
	}
}