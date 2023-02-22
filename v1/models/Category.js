const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	color: {
		type: String,
	},
	icon: {
		type: String,
	},
	products: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
});

module.exports = Category = mongoose.model('categories', categorySchema);
