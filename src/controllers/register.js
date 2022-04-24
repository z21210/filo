module.exports = function($scope, $rootScope, $state, $http) {
	if ($rootScope.getUserPrivilege() >= 1) {
		$state.go('account')
	}
	$scope.user = {
		username:'', 
		email:'', 
		password: '',
		confirmPassword: ''
	}
	$scope.registerError = null
	$scope.register = function () {
		$http({ 
			method: 'PUT',
			url: '/api/register',
			// no authorisation header, as the user has no account yet
			data: $scope.user
		 })
		.then(
			function (res) {
				$scope.registerError = null
				$rootScope.user = { 
					username: $scope.user.username, 
					isAdmin: false, 
					auth: Buffer.from($scope.user.username+':'+$scope.user.password).toString('base64')
				}
				$state.go('account')
			},
			function (err) {
				$scope.registerError = err.data
			}
		)
	}
}