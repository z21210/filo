module.exports = "<h2>{{user.username}}</h2><br>\n\n<div style=\"float: left;\" ng-init=\"form = ''\">\n\t<button ng-click=\"form = 'password'\">Change password</button><br> \n\t<button ng-click=\"form = 'email'\">Change e-mail address</button><br>\n\t<button ng-click=\"form = 'username'\">Change username</button> \n</div>\n\n<!-- ng-if is used instead of ng-show to prevent the Enter key submitting hidden forms --> \n<div style=\"float: left;\" ng-if=\"form == 'password'\" ng-init=\"$parent.changePasswordMessage = ''\">\n\t<form ng-submit=\"changePassword()\">\n\t\t<label for=\"newPassword\">New password:</label>\n\t\t<input id=\"newPassword\" type=\"password\" ng-model=\"new.password\" ng-init=\"$parent.new.password = ''\">\n\n\t\t<label for=\"confirmNewPassword\">Confirm new password:</label>\n\t\t<input id=\"confirmNewPassword\" type=\"password\" ng-model=\"new.confirmPassword\" ng-init=\"$parent.new.confirmPassword = ''\">\n\n\t\t<button type=\"button\" ng-click=\"$parent.form = ''\">Cancel</button>\n\t\t<button type=\"submit\">Change password</button>\n\t</form>\n\t<span>{{changePasswordMessage}}</span>\n</div>\n\n<div style=\"float: left;\" ng-if=\"form == 'email'\" ng-init=\"$parent.changeEmailMessage = ''\">\n\t<form ng-submit=\"changeEmail()\">\n\t\t<label for=\"newEmail\">New e-mail address:</label>\n\t\t<input id=\"newEmail\" type=\"text\" ng-model=\"new.email\" ng-init=\"$parent.new.email = ''\">\n\n\t\t<label for=\"confirmNewEmail\">Confirm new e-mail address:</label>\n\t\t<input id=\"confirmNewEmail\" type=\"text\" ng-model=\"new.confirmEmail\" ng-init=\"$parent.new.confirmEmail = ''\">\n\n\t\t<button type=\"button\" ng-click=\"$parent.form = ''\">Cancel</button>\n\t\t<button type=\"submit\">Change e-mail address</button>\n\t</form>\n\t<span>{{changeEmailMessage}}</span>\n</div>\n\n<div style=\"float: left;\" ng-if=\"form == 'username'\" ng-init=\"$parent.changeUsernameMessage = ''\">\n\t<form ng-submit=\"changeUsername()\">\n\t\t<label for=\"newUsername\">New username:</label>\n\t\t<input id=\"newUsername\" type=\"text\" ng-model=\"new.username\" ng-init=\"$parent.new.username = ''\">\n\n\t\t<button type=\"button\" ng-click=\"$parent.form = ''\">Cancel</button>\n\t\t<button type=\"submit\">Change username</button>\n\t</form>\n\t<span>{{changeUsernameMessage}}</span>\n</div>"