const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const { validationResult } = require('express-validator');

const RegisterUser = (req, res) => {
	// Check is there any errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// Check if the user already exist
	User.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			return res
				.status(400)
				.json({ email: 'account already exist please login instead!' });
		} else {
			// If the user doesnt already exist get their gravatar and store in a variable
			const avatar = gravatar.url(req.body.email, {
				s: '200', //size
				r: 'pg', //raitng
				d: 'mm', // default
			});

			// Use the User model to create a new instance of the User
			const newUser = new User({
				name: req.body.name,
				surname: req.body.surname,
				email: req.body.email,
				avatar,
				password: req.body.password,
			});

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser
						.save()
						.then((user) => res.json(user))
						.catch((error) => console.log(error));
				});
			});
		}
	});
};

// Login into an existing account

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

// Get a list of all the available users
const getAllUsers = (req, res) => {
	User.find()
		.then((users) => {
			res.json(users);
		})
		.catch((err) => {
			console.log(err);
		});
};

const getSingleUser = (req, res) => {
	User.findById(req.params.id).then((user) => {
		console.log(user);
		res.json(user);
	});
};

module.exports = {
	getAllUsers,
	UserLogin,
	RegisterUser,
	getSingleUser,
};
