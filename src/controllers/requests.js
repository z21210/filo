module.exports = function($scope, $rootScope, $state, $http) {
	if ($rootScope.getUserPrivilege() == 0) {
		$state.go('login', {accessing: 'requests'})
	}
	if ($rootScope.getUserPrivilege() == 2) {
		//console.log(`user ${$rootScope.user.username} is an admin, redirecting to reviews`)
		$state.go('review')
	}

	$scope.requests = ''
	$http({
		method: 'GET',
		url: '/api/requests',
		headers: {
			'Authorization': `Basic ${$rootScope.user.auth}`
		}
	})
	.then(
		function (res) {
			res.data.forEach((request, i) => {
				request.dateRequested = request.dateRequested.split('T')[0]
				request.itemId.dateListed = request.itemId.dateListed.split('T')[0]
				let status
				if (request.reviewed) {
					if (request.approved) {
						status = 'request approved'
					} else {
						status = 'request denied'
					}
				} else {
					status = 'awaiting review'
				}
				Object.assign(res.data[i], {status})
			})
			$scope.requests = res.data
			console.log(res.data)
		},
		function (err) {
			console.log(err.data)
		}
	)
}