const mongoose = require('mongoose')
const validateRequest = require('../server/utilities/validate/request')

const requestSchema = new mongoose.Schema(
	{
		itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'item', required: true },
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
		reason: { type: String, required: true },
		dateRequested: { type: Date, required: true, default: Date.now()},
		dateReviewed: { type: Date, required: false },
		reviewed: { type: Boolean, required: true, default: false },
		approved: { type: Boolean, required: true, default: false }
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

module.exports = mongoose.model('request', requestSchema)