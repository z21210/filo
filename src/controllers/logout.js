module.exports = function($scope, $rootScope, $window, $state) {
	if (!$rootScope.user) {
		$state.go('login')
	}
	$scope.no = function () {
		$window.history.back()
	}
	$scope.yes = function () {
		$rootScope.user = {}
		$state.go('login')
	}
}