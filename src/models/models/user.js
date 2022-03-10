const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		passwordSHA256: { type: String, required: true },
		email: { type: String, required: false }
	},
	{
		collection: 'users' 
	}
)

userSchema.index({ _id: 1 }, { unique: true })

module.exports = mongoose.model('user', userSchema)