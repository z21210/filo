const mongoose = require('mongoose')
const validateImages = require('../server/utilities/validate/images')

const itemSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		category: { type: String, required: true },
		dateFound: { type: String, required: true }, // date found is not a date; location found is known to the user, date presented as finder's local timezone
		dateListed: { type: Date, required: true, default: Date.now() },
		locationFound: { type: String, required: true },
		description: { type: String, required: true },
		image: { type: [String], required: true, 
			validate: validateImages
		},
		reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
	},
	{
		collection: 'items' 
	}
)

module.exports = mongoose.model('item', itemSchema)