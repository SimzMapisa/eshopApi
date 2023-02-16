const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		surname: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},

		password: {
			type: String,
			required: true,
		},

		avatar: {
			type: String,
		},

		date: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				delete ret.password;
			},
		},
	}
);

let User;

module.exports = User = mongoose.model('users', UserSchema);
