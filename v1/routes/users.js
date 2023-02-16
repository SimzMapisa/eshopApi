const express = require('express');
const router = express.Router();
const validator = require('../../validators');
const UserController = require('../controllers/users');

// @route   POST /register
// @desc    Create user accounts for Users
// @access  Public
router.post(
	'/register',
	validator.validateUserCreation,
	UserController.RegisterUser
);

// @route   GET /users/login
// @desc    Login User / Return JWT Token
// @access  Public
router.post('/login', UserController.UserLogin);

// @route   GET /api/v1/users
// @desc    Returns  all users
// @access  Private
router.get('/', UserController.getAllUsers);

// @route   GET /api/v1/users/:id
// @desc    Returns  the current user
// @access  Private
router.get('/:id', UserController.getSingleUser);

module.exports = router;
