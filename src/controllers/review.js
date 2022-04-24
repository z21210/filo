module.exports = function($scope, $rootScope, $state, $http) {
	if ($rootScope.getUserPrivilege() == 0) {
		$state.go('login', {accessing: 'review'})
	}
	if ($rootScope.getUserPrivilege() == 1) {
		$state.go('requests')
	}

	$scope.reports = ''
	$http({
		method: 'GET',
		url: '/api/review',
		headers: {
			'Authorization': `Basic ${$rootScope.user.auth}`
		}
	})
	.then(
		function (res) {
			res.data.forEach((request, i) => { // format dates
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
		},
		function (err) {
			console.log(err)
		}
	)

	// sorting and default
	$scope.sort = {
		by: 'itemId.dateRequested',
		descending: true
	}
	$scope.sortBy = function(by) {
		if ($scope.sort.by == by) {
			$scope.sort.descending = !$scope.sort.descending;
		} else {
			$scope.sort.by = by;
			$scope.sort.descending = false;
		}
	}

	$scope.selectedRequestId = null
	$scope.reviewedMessage = ''
	$scope.selectRequest = function (requestId) {
		$scope.selectedRequest = $scope.requests.find(request => request._id == requestId)
		$scope.selectedRequestId = requestId
		$scope.reviewedMessage = ''
	}

	$scope.goToItem = function () {
		$state.go('items', {itemId: $scope.selectedRequest.itemId._id})
	}

	$scope.approve = function () {
		$http({
			method: 'PUT',
			url: `/api/review/${$scope.selectedRequestId}`,
			headers: {
				'Authorization': `Basic ${$rootScope.user.auth}`
			},
			data: '{"approved":true}'
		})
		.then(
			function (res) {
				$scope.reviewedMessage = 'Request approved'
				$scope.requests.find(request => request._id == $scope.selectedRequestId).status = 'request approved'
			},
			function (err) {
				$scope.reviewedMessage = err.data
			}
		)
	}
	$scope.deny = function () {
		$http({
			method: 'PUT',
			url: `/api/review/${$scope.selectedRequestId}`,
			headers: {
				'Authorization': `Basic ${$rootScope.user.auth}`
			},
			data: '{"approved":false}'
		})
		.then(
			function (res) {
				$scope.reviewedMessage = 'Request denied'
				$scope.requests.find(request => request._id == $scope.selectedRequestId).status = 'request denied'
			},
			function (err) {
				$scope.reviewedMessage = err.data
			}
		)
	}
}