const { body } = require('express-validator');

exports.validateUserCreation = [
	body('email').isEmail().normalizeEmail(),
	body('name').isLength({ min: 2 }),
	body('surname').isLength({ min: 2 }),
	body('password')
		.isLength({ min: 5 })
		.isLength({ min: 5 })
		.withMessage('password must be at least 5 characters')
		.matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$')
		.withMessage(
			'Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character'
		),
	body('confirmPassword').custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error('Password confirmation does not match password');
		}
		// Indicates the success of this synchronous custom validator
		return true;
	}),
];
