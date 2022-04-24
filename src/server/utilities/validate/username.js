const usernameRegex = /[\d\w\.-]+/

module.exports = function (username, success, error) {
	if (username === undefined) {
		success(username)
		return
	}
	if (username.match(usernameRegex) === null || username.match(usernameRegex)[0] !== username) {
		error(new Error('Username is invalid; use alphanumeric characters, \'_\', \'-\', and \'.\''))
		return
	} else {
		success(username)
		return
	}
}