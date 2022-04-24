app = angular.module('filo', ['ui.router'])

app.controller('rootController', function ($rootScope){
	$rootScope.getUserPrivilege = function () {
		if (!$rootScope.user || !$rootScope.user.username) return 0
		if (!$rootScope.user.isAdmin) return 1
		if ($rootScope.user.isAdmin) return 2
	}
})

app.run(['$rootScope', '$state', 
	function ($rootScope, $state) {
		$rootScope.$state = $state
	}
])

app.config(function ($stateProvider, $urlRouterProvider) {
	// landing page
	$urlRouterProvider.otherwise("/items");
	var header = {
		template: require('../views/bundle/header'),
		controller: require('./header')
	}
	// ui router states
	$stateProvider
		.state('items', {
			url: '/items',
			title: 'Items',
			params: {
				itemId: undefined,
			},
			views: {
				header: header,
				content: {
					template: require('../views/bundle/items'),
					controller: require('./items')
				}
			}
		})
		.state('login', {
			url: '/login?accessing&params',
			title: 'Log in',
			params: {
				accessing: 'items', //default
				params: '{}'
			},
			views: {
				header: header,
				content: {
					template: require('../views/bundle/login'),
					controller: require('./login')
				}
			}
		})
		.state('register', {
			url: '/register',
			title: 'Register account',
			views: {
				header: header,
				content: {
					template: require('../views/bundle/register'),
					controller: require('./register')
				}
			}
		})
		.state('newReport', {
			url: '/newReport',
			title: 'Report lost item',
			views: {
				header: header,
				content: {
					template: require('../views/bundle/newReport'),
					controller: require('./newReport')
				}
			}
		})
		.state('reports', {
			url: '/reports',
			title: 'My reported items',
			views: {
				header: header,
				content: {
					template: require('../views/bundle/reports'),
					controller: require('./reports')
				}
			}
		})
		.state('requests', {
			url: '/requests',
			title: 'My requested items',
			views: {
				header: header,
				content: {
					template: require('../views/bundle/requests'),
					controller: require('./requests')
				}
			}
		})
		.state('review', {
			url: '/review',
			title: 'Review requests',
			views: {
				header: header,
				content: {
					template: require('../views/bundle/review'),
					controller: require('./review')
				}
			}
		})
		.state('account', {
			url: '/account',
			title: 'Account',
			views: {
				header: header,
				content: {
					template: require('../views/bundle/account'),
					controller: require('./account')
				}
			}
		})
		.state('logout', {
			url: '/logout',
			title: 'Log out',
			views: {
				header: header,
				content: {
					template: require('../views/bundle/logout'),
					controller: require('./logout')
				}
			}
		});
})