const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const { validationResult } = require('express-validator');

// Register a user based on their role utilize this function in user routes
const RegisterUser = (role) => [
	(req, res, next) => {
		// Check is there any errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},

	// Check if the user already exist
	(req, res, next) => {
		User.findOne({ email: req.body.email })
			.then((user) => {
				if (user) {
					return res
						.status(400)
						.json({ email: 'Account already exists. Please login instead.' });
				}
				next();
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Server error');
			});
	},

	(req, res, next) => {
		const { name, surname, email, password } = req.body;
		// If the user doesn't already exist get their gravatar and store in a variable
		const avatar = gravatar.url(req.body.email, {
			s: '200', //size
			r: 'pg', //rating
			d: 'mm', // default
		});

		// Use the User model to create a new instance of the User
		const newUser = new User({
			role,
			name,
			surname,
			email,
			avatar,
			password,
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
	},
];

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

				const payload = {
					id: user.id,
					email: user.email,
					avatar: user.avatar,
					role: user.role,
				};
				// sign token
				jwt.sign(
					payload,
					process.env.secretOrKey,
					{ expiresIn: '1h' },
					(err, token) => {
						res.json({
							success: true,
							token: 'Bearer ' + token,
						});
					}
				);
			} else {
				return res.status(400).json({ password: 'Invalid Password' });
			}
		});
	});
};

// Logout function
const jwtBlacklist = [];

const logout = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(' ')[1];
	const decoded = jwt.verify(token, process.env.secretOrKey);

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	if (jwtBlacklist.includes(token)) {
		return res.status(401).json({ message: 'Token revoked' });
	}

	jwt.verify(token, process.env.secretOrKey, (err, user) => {
		if (err) {
			return res.status(401).json({ message: 'Invalid token' });
		}

		req.user = user;
		next();
	});

	jwtBlacklist.push(token);

	const payload = {
		id: decoded.id,
		email: decoded.email,
		avatar: decoded.avatar,
		role: decoded.role,
	};

	console.log(payload);

	jwt.sign(
		payload,
		process.env.secretOrKey,
		{ expiresIn: '2s' }, // Set the expiration time to 2 seconds
		(err, token) => {
			return res.json({
				success: true,
				token: 'Bearer ' + token,
			});
		}
	);

	return res
		.status(200)
		.json({ message: 'Logged out successfully', jwtBlacklist });
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

const deleteUser = (req, res) => {
	User.findByIdAndDelete(req.params.id)
		.exec()
		.then((doc) => {
			if (!doc) {
				return res.status(404).json({ message: 'User not found' });
			}
			return res.json({ message: `${doc.name} deleted`, user: doc });
		});
};

const editUser = async (req, res) => {
	try {
		await User.findById(req.params.id).then((user) => {
			if (!user) {
				res.status(404).json({ message: 'User not found' });
			}

			user.name = req.body.name || user.name;
			user.surname = req.body.surname || user.surname;
			user.email = req.body.email || user.email;
			user.role = req.body.role || user.role;

			user.save().then((user) => {
				res.json({ user, message: 'User details updated successfully' });
			});
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	getAllUsers,
	UserLogin,
	RegisterUser,
	getSingleUser,
	deleteUser,
	editUser,
	logout,
};
