module.exports = function($scope, $rootScope, $state, $http) {
	if ($rootScope.getUserPrivilege() == 0) {
		$state.go('login', {accessing: 'reports'})
	}
	if ($rootScope.getUserPrivilege() == 2) {
		$state.go('review')
	}

	$scope.reports = ''
	$http({
		method: 'GET',
		url: '/api/reports',
		headers: {
			'Authorization': `Basic ${$rootScope.user.auth}`
		}
	})
	.then(
		function (res) {
			res.data.forEach((report, i) => {
				report.dateListed = report.dateListed.split('T')[0]
			})
			$scope.reports = res.data
		},
		function (err) {}
	)
}