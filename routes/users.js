const express = require('express')
const router = express.Router();
const User = require('../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { body, validationResult } = require('express-validator');


// @route   POST /register
// @desc    Create user accounts for Users
// @access  Public
router.post('/register',
    body('email').isEmail().normalizeEmail(),
    body('name').isLength({ min: 2 }),
    body('surname').isLength({ min: 2 }),
    body('password').isLength({ min: 5 })
        .isLength({ min: 5 })
        .withMessage('password must be at least 5 characters')
        .matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$')
        .withMessage('Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        // Indicates the success of this synchronous custom validator
        return true;
    }),

    (req, res) => {

        // Check is there any errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if the user already exist
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (user) {
                    return res.status(400).json({ email: "account already exist please login instead!" })
                } else {

                    // If the user doesnt already exist get their gravatar and store in a variable
                    const avatar = gravatar.url(req.body.email, {
                        s: '200', //size
                        r: 'pg',  //raitng
                        d: 'mm'   // default
                    })

                    // Use the User model to create a new instance of the User
                    const newUser = new User({
                        name: req.body.name,
                        surname: req.body.surname,
                        email: req.body.email,
                        avatar,
                        password: req.body.password
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => res.json(user))
                                .catch(error => console.log(error))
                        })
                    })
                }
            })
    })


// @route   GET /users/login
// @desc    Login User / Return JWT Token
// @access  Public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // find User by email
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ email: "User not found" });
            }
            // check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User matched
                        // create jwt payload
                        const payload = { id: user.id, email: user.email, avatar: user.avatar }
                        // sign token
                        jwt.sign(payload,
                            process.env.secretOrKey,
                            { expiresIn: 43200 }, (err, token) => {
                                res.json({ success: true, token: 'Bearer ' + token })
                            })
                    } else {
                        return res.status(400).json({ password: "Invalid Password" });
                    }
                })
        })
})


// @route   GET /api/users/current
// @desc    Returns  the current user
// @access  Private

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            console.log(err);
        })
})

module.exports = router;