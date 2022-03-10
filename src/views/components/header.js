document.write('\
	<div ng-controller="HeaderController">\
		<header>\
			<nav>\
				<a href="/browse">Browse lost items</a>\
				<a href="/report">Report a lost item</a>\
				<a href="/reports">Your Reports</a>\
				<a href="/requests">Your Requests</a>\
				<a href="/reviews">Review Requests</a>\
				<input type="button" value="Login" ng-click="showLoginModal=true; showRegisterModal=false">\
				<input type="button" value="Register" ng-click="showRegisterModal=true; showLoginModal=false">\
				<a href="/account">Account</a>\
			</nav>\
		</header>\
		<div ng-cloak ng-show="showRegisterModal" ng-init="showRegisterModal=false">\
			<form>\
				<label id="usernameLabel" for="usernameInput">\
					Username: \
				</label>\
				<input id="usernameInput" ng-model="register.username" name="username" type="text" placeholder="Username"><br>\
				<label id="passwordLabel" for="passwordInput">\
					Password: \
				</label>\
				<input id="passwordInput" ng-model="register.password" name="password" type="password" placeholder="Password"><br>\
				<label id="passwordConfirmLabel" for="passwordConfirmInput">\
					Confirm password: \
				</label>\
				<input id="passwordConfirmInput" ng-model="register.confirmPassword" name="password" type="password" placeholder="Password"><br>\
				<input type="button" ng-click="registerUser()" value="Create Account">\
				<input type="button" ng-click="showRegisterModal=false" value="Cancel">\
			</form>\
		</div>\
		<div ng-cloak ng-show="showLoginModal" ng-init="showLoginModal=false">\
			<form>\
				<label id="usernameLabel" for="usernameInput">\
					Username: \
				</label>\
				<input id="usernameInput" ng-model="login.username" name="username" type="text" placeholder="Username"><br>\
				<label id="passwordLabel" for="passwordInput">\
					Password: \
				</label>\
				<input id="passwordInput" ng-model="login.password" name="password" type="password" placeholder="Password"><br>\
				<input type="button" ng-click="loginUser()" value="Login">\
				<input type="button" ng-click="showLoginModal=false" value="Cancel">\
			</form>\
		</div>\
	</div>\
	<script type="text/javascript" src="header.js"></script>\
');