module.exports = "<form ng-submit=\"login()\">\n\t<label for=\"username\">Username:</label>\n\t<input id=\"username\" type=\"text\" ng-model=\"user.username\">\n\n\t<label for=\"password\">Password:</label>\n\t<input id=\"password\" type=\"password\" ng-model=\"user.password\">\n\n\t<label></label>\n\t<button type=\"submit\">Log in</button>\n</form>\n{{loginError}}"