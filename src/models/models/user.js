const mongoose = require('mongoose')
const crypto = require('crypto')
const validatePassword = require('../utilities/validate/password')

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		password: { type: String, required: true },
		passwordSalt: {type: String, required: false },
		email: { type: String, required: true },
		admin: { type: Boolean, required: true }
	},
	{
		collection: 'users' 
	}
)

userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ username: 1 }, { unique: true })

const encryptPassword = function(user, next) {
	const salt = crypto.randomBytes(16)
	user.passwordSalt = Buffer.from(salt, 'binary').toString('hex')
	user.password = crypto.createHmac('SHA256', salt).update(user.password).digest('hex')
	next()
}

userSchema.pre('save', function(next) {
	validatePassword(this.password, () => {encryptPassword(this, next)}, next)
})
userSchema.pre('findOneAndUpdate', function(next) {
	validatePassword(this._update.password, () => {encryptPassword(this._update, next)}, next)
})

module.exports = mongoose.model('user', userSchema)