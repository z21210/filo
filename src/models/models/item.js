const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		dateFound: { type: Date, required: true },
		locationFound: { type: String, required: true },
		description: { type: String, required: true }
	},
	{
		collection: 'items' 
	}
)

itemSchema.index({ _id: 1 }, { unique: true })

module.exports = mongoose.model('item', itemSchema)