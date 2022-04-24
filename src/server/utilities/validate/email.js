/* 
  Does accept some RFC-5322-non-compliant addresses, I leave that validation to the email hosts.
  Does not validate host names much beyond "alphanumerics dot alphanumerics ..."; I cannot list all current, nor predict future, domain names.
*/
const emailRegex = /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/

module.exports = function (email, success, error) {
	if (email === undefined) {
		success(email)
		return
	}
	if (email.match(emailRegex) === null || email.match(emailRegex)[0] !== email) {
		error(new Error('E-mail address is invalid'))
		return
	} else {
		success(email)
		return
	}
}