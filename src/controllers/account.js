module.exports = function($scope, $rootScope, $http, $state) {
	if ($rootScope.getUserPrivilege() == 0) {
		$state.go('login', {accessing: 'account'})
	}
	$scope.user.username = $rootScope.user.username

	$scope.new = {
		username: '', 
		email: '',
		confirmEmail: '',
		password: '',
		confirmPassword: ''
	}
	$scope.changePasswordMessage = ''
	$scope.changeUsernameMessage = ''
	$scope.changePassword = function () {
		if ($scope.new.password !== $scope.new.confirmPassword) {
			$scope.changePasswordMessage = 'Error: password confirmation does not match'
			return
		}

		$http({ 
			method: 'PUT',
			url: '/api/account',
			headers: {
				'Authorization': `Basic ${$rootScope.user.auth}`
			},
			data: `{"password":"${$scope.new.password}"}`
		})
		.then(
			function (res) {
				console.log(`${res.status}: ${res.data}`)
				$rootScope.user.auth = Buffer.from($rootScope.user.username+':'+$scope.new.password).toString('base64')
				$scope.changePasswordMessage = 'Password changed successfuly'
				$scope.new.password = ''
				$scope.new.confirmPassword = ''
			},
			function (err) {
				$scope.changePasswordMessage = err.data
			}
		)
	}
	$scope.changeEmail = function () {
		if ($scope.new.email !== $scope.new.confirmEmail) {
			$scope.changeEmailMessage = 'Error: e-mail address confirmation does not match'
			return
		}

		$http({ 
			method: 'PUT',
			url: '/api/account',
			headers: {
				'Authorization': `Basic ${$rootScope.user.auth}`
			},
			data: `{"email":"${$scope.new.email}"}`
		})
		.then(
			function (res) {
				console.log(`${res.status}: ${res.data}`)
				$scope.changeEmailMessage = 'E-mail address changed successfuly'
				$scope.new.email = ''
				$scope.new.confirmEmail = ''
			},
			function (err) {
				$scope.changeEmailMessage = err.data
			}
		)
	}
	$scope.changeUsername = function () {
		$http({ 
			method: 'PUT',
			url: '/api/account',
			headers: {
				'Authorization': `Basic ${$rootScope.user.auth}`
			},
			data: `{"username":"${$scope.new.username}"}`
		})
		.then(
			function (res) {
				$rootScope.user.username = $scope.new.username
				var auth = $rootScope.user.auth
				auth = Buffer.from(auth, 'base64').toString()
				password = auth.slice(auth.indexOf(':')+1)
				$rootScope.user.auth = Buffer.from($rootScope.user.username+':'+password).toString('base64')
				$scope.changeUsernameMessage = 'Username changed successfuly'
				$scope.new.username = ''
				console.log($rootScope.user.auth)
			},
			function (err) {
				$scope.changeUsernameMessage = err.data
			}
		)
	}
}