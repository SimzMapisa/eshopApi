const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserLogin = (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	// find User by email
	User.findOne({ email }).then((user) => {
		if (!user) {
			return res.status(404).json({ email: 'User not found' });
		}
		// check password
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (isMatch) {
				/**
				 * If user credentials match with the ones in the database
				 * then generate jwt token
				 */
				const payload = { id: user.id, email: user.email, avatar: user.avatar };
				// sign token
				jwt.sign(
					payload,
					process.env.secretOrKey,
					{ expiresIn: 43200 },
					(err, token) => {
						res.json({ success: true, token: 'Bearer ' + token });
					}
				);
			} else {
				return res.status(400).json({ password: 'Invalid Password' });
			}
		});
	});
};

const getAllUsers = (req, res) => {
	User.find()
		.then((users) => {
			console.log(typeof users);
			res.json(users);
		})
		.catch((err) => {
			console.log(err);
		});
};

module.exports = {
	getAllUsers,
	UserLogin,
};
