module.exports = function (app) {
	//create/modify an account
	app.put('/account', function (req, res) {
		console.log(req)
		var buffer = ''
		req.on('data', (data) => buffer = buffer + data)
		req.on('end', () => {
			console.log(JSON.parse(buffer))
			res.writeHead(204)
			res.end()
		})
	})
}