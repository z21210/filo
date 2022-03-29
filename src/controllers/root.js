app = angular.module('filo', ['ui.router'])

app.controller('rootController', function ($scope) {})

app.config(function ($stateProvider, $urlRouterProvider) {
	// landing page
	$urlRouterProvider.otherwise("/items");
	var header = {
		template: require('../views/bundle/header.bundle'),
		controller: require('./header')
	}
	var footer = {
		template: '',
		controller: function($scope) {}
	}
	// ui router states
	$stateProvider
		.state('items', {
			url: '/items',
			views: {
				header: header,
				content: {
					template: require('../views/bundle/items.bundle'),
					controller: require('./items')
				},
				footer: footer
			}
		})
		.state('login', {
			url: '/login',
			views: {
				header: header,
				content: {
					template: require('../views/bundle/login.bundle'),
					controller: require('./login')
				},
				footer: footer
			}
		})
		.state('register', {
			url: '/register',
			views: {
				header: header,
				content: {
					template: require('../views/bundle/register.bundle'),
					controller: require('./register')
				},
				footer: footer
			}
		})
		.state('newReport', {
			url: '/newReport',
			views: {
				header: header,
				content: {
					template: require('../views/bundle/newReport.bundle'),
					controller: require('./newReport')
				},
				footer: footer
			}
		})
		.state('reports', {
			url: '/reports',
			views: {
				header: header,
				content: {
					template: require('../views/bundle/reports.bundle'),
					controller: require('./reports')
				},
				footer: footer
			}
		})
		.state('requests', {
			url: '/requests',
			views: {
				header: header,
				content: {
					template: require('../views/bundle/requests.bundle'),
					controller: require('./requests')
				},
				footer: footer
			}
		})
		.state('review', {
			url: '/review',
			views: {
				header: header,
				content: {
					template: require('../views/bundle/review.bundle'),
					controller: require('./review')
				},
				footer: footer
			}
		})
		.state('account', {
			url: '/account',
			views: {
				header: header,
				content: {
					template: require('../views/bundle/account.bundle'),
					controller: require('./account')
				},
				footer: footer
			}
		})
		.state('logout', {
			url: '/logout',
			views: {
				header: header,
				content: {
					template: require('../views/bundle/logout.bundle'),
					controller: require('./logout')
				},
				footer: footer
			}
		});
})