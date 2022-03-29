const mongoose = require('mongoose')
const validateRequest = require('../utilities/validate/request')

const requestSchema = new mongoose.Schema(
	{
		itemId: { type: String, required: true },
		userId: { type: String, required: true },
		dateRequested: { type: Date, required: true },
		dateReviewed: { type: Date, required: false },
		reviewed: { type: Boolean, required: true },
		approved: { type: Boolean, required: true }
	},
	{
		collection: 'requests' 
	}
)

requestSchema.index({ itemId: 1, userId: 1 }, { unique: true })

requestSchema.pre('save', function(next) {
	validateRequest(this, next, next)
})
requestSchema.pre('findOneAndUpdate', function(next) {
	validateRequest(this._update, next, next)
})

module.exports = mongoose.model('requests', requestSchema)