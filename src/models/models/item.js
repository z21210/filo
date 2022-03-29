const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		category: { type: String, required: true },
		dateFound: { type: Date, required: true },
		dateListed: { type: Date, required: true, default: Date.now() },
		locationFound: { type: String, required: true },
		description: { type: String, required: true }
	},
	{
		collection: 'items' 
	}
)

module.exports = mongoose.model('item', itemSchema)