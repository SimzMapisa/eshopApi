const express = require('express');
const router = express.Router();
const validator = require('../validation/validators');
const {
	getAllUsers,
	UserLogin,
	RegisterUser,
	getSingleUser,
	deleteUser,
	editUser,
	logout,
} = require('../controllers/users.controller');
const { userAuth } = require('../middleware/auth');

// @route   POST /register
// @desc    Create user accounts for Users
// @access  Public
router.post('/register', validator.validateUserCreation, RegisterUser('USER'));

// @route   POST /register
// @desc    Create Admin accounts
// @access  Private
router.post(
	'/register/admin',
	userAuth(['SUPER_ADMIN']),
	validator.validateUserCreation,
	RegisterUser('ADMIN')
);

// @route   POST /register
// @desc    Create Super Admin accounts
// @access  Private
router.post(
	'/register/super-admin',
	validator.validateUserCreation,
	RegisterUser('SUPER_ADMIN')
);

// @route   POST /users/login
// @desc    Login User / Return JWT Token
// @access  Public
router.post('/login', UserLogin);

// @route   GET /api/v1/users
// @desc    Returns  all users
// @access  Private
router.get('/', userAuth(['SUPER_ADMIN', 'ADMIN']), getAllUsers);

// @route   GET /api/v1/users/:id
// @desc    Returns  the current user
// @access  Private
router.get('/:id', userAuth(['SUPER_ADMIN', 'ADMIN']), getSingleUser);

// @route  DELETE /api/v1/users/:id
// @desc    Returns  the current user
// @access  Private
router.delete('/:id', userAuth(['SUPER_ADMIN']), deleteUser);

// @route  Patch /api/v1/users/:id
// @desc    Returns returns current user with the new data
// @access  Private
router.patch('/:id', userAuth(['SUPER_ADMIN']), editUser);

router.post('/logout', logout);

module.exports = router;
