const mongoose = require('mongoose')
const crypto = require('crypto')
const validatePassword = require('../server/utilities/validate/password')
const validateUsername = require('../server/utilities/validate/username')
const validateEmail = require('../server/utilities/validate/email')

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
	if (user.password === undefined) {
		next()
		return
	}
	const salt = crypto.randomBytes(16)
	user.passwordSalt = Buffer.from(salt, 'binary').toString('hex')
	user.password = crypto.createHmac('SHA256', salt).update(user.password).digest('hex')
	next()
}

userSchema.pre('save', function(next) {
	//first, ensure that properties are defined, give specific error if undefined
	if (this.username === undefined) {
		next(new Error('Username is missing'))
		return
	}
	if (this.email === undefined) {
		next(new Error('E-mail address is missing'))
		return
	}
	if (this.password === undefined) {
		next(new Error('Passphrase is missing'))
		return
	}

	validateUsername(this.username, () => {
		validateEmail(this.email, () => {
			validatePassword(this.password, () => {
				encryptPassword(this, 
					next)
				}, 
				next)
			}, 
			next)
		},
		next)
})
userSchema.pre('findOneAndUpdate', function(next) {
	validateUsername(this._update.username, () => {
		validateEmail(this._update.email, () => {
			validatePassword(this._update.password, () => {
				encryptPassword(this._update, 
					next)
				}, 
				next)
			}, 
			next)
		},
		next)
})

module.exports = mongoose.model('user', userSchema)