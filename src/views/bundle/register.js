module.exports = "<form ng-submit=\"register()\">\n\t<label for=\"username\">Username:</label>\n\t<input id=\"username\" type=\"text\" ng-model=\"user.username\">\n\n\t<label for=\"email\">E-mail address:</label>\n\t<input id=\"email\" type=\"email\" ng-model=\"user.email\">\n\n\t<label for=\"password\">Password:</label>\n\t<input id=\"password\" type=\"password\" ng-model=\"user.password\">\n\n\t<label for=\"confirmPassword\">Confirm password:</label>\n\t<input id=\"confirmPassword\" type=\"password\" ng-model=\"user.confirmPassword\">\n\n\t<label></label>\n\t<button type=\"submit\">Register</button>\n</form>\n<span>{{registerError}}</span>"